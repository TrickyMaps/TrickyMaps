from polyline.codec import PolylineCodec
import urllib.parse
import json
import urllib.request
import urllib.error
import tempfile
import os
from calculations import calculate_initial_compass_bearing, calculate_pitch
import cv2
import threading
import subprocess
import time

#this needs to be removed and moved to config.json (do not push this to github)
GOOGLE_STREETVIEW_API_KEY = 'REPLACE_WITH_YOUR_GCP_API_KEY'

GOOGLE_MAPS_DIRECTIONS_API = 'https://maps.googleapis.com/maps/api/directions/json?'

STREETVIEW_URL = ("http://maps.googleapis.com/maps/api/streetview"
                  "?size=640x480&key=" + GOOGLE_STREETVIEW_API_KEY)


def _build_directions_url(origin, destination) -> str:
    query_paramaters = [('origin', origin), ('destination', destination), ('key', GOOGLE_STREETVIEW_API_KEY)]
    return GOOGLE_MAPS_DIRECTIONS_API + urllib.parse.urlencode(query_paramaters)


def get_result(url: str) -> 'json':
    """parses the json"""
    response = None
    try:
        response = urllib.request.urlopen(url)
        json_text = response.read().decode(encoding='utf-8')
        #print(json.loads(json_text))

        return json.loads(json_text)

    finally:
        if response is not None:
            response.close()


def build_coords(json) -> list:
    # Builds coords from the polylines
    result = []
    for i in json['routes'][0]['legs'][0]['steps']:
        result.extend(PolylineCodec().decode(i['polyline']['points']))
    return result


def unique(sequence):
    seen = set()
    return [x for x in sequence if not (x in seen or seen.add(x))]


def get_heading(start, end):
    #Print compass bearing for each image
    #print('{0:.4f}'.format(calculate_initial_compass_bearing(start, end)))
    return '{0:.4f}'.format(calculate_initial_compass_bearing(start, end))


class StreetViewThread(threading.Thread):
    def __init__(self, coordinates, pointindex, centercoord, height):
        threading.Thread.__init__(self)
        self.coordinates = coordinates
        self.pointindex = pointindex
        self.result = []
        self.centercoord = centercoord
        self.height = height

    def run(self):
        for idx, coord in tuple(enumerate(self.coordinates))[:-3]:
            # -3 doesn't iterate through overlapping list. (for heading).
            # It looks 3 coords ahead for smoother change of view angle.
            # I lose 3 coords, tiny sacrifice.
            try:
                outfile = tempfile.NamedTemporaryFile(delete=False,
                                                      prefix=("{0:06}".format(self.pointindex + idx) + '__'))
                outfile.close()

                heading = get_heading(coord, self.coordinates[idx + 3])
                pitch = 0

                url = "{}&location={},{}&heading={}&pitch={}".format(STREETVIEW_URL, coord[0], coord[1], heading,
                                                                     pitch)  # coord,next_coord
                #print(url)                                                     
                # Since I broke the coords list into chunks for different workers it can't look at the next coords at the end
                # of a single chunk. There has to be some overlap. So I added 3 from the next chunk into this chunk while
                # ending before the overlap.
                # [COORD1,COORD2,COORD3,COORD4,COORD5,COORD6],[COORD4,COORD5,COORD6,COORD7....]
                #                     ^Stops iterating here
                print('{:.1%}'.format(idx / len(self.coordinates)))

                urllib.request.urlretrieve(url, outfile.name)
                self.result.append(outfile.name)

            except urllib.error.URLError as oops:
                print("Uhhhh ohhhh, Error found!")
                print(oops)
                os.unlink(outfile.name)


def streetview_thread(coordinates, centercoord=(0, 0), height=0.0):
    NumberOfThreads = 20  # 20 is default number of threads "workers" unless the amount of images is less.
    NumberOfThreads = len(coordinates) if len(coordinates) < NumberOfThreads  else NumberOfThreads
    slicedlist = [coordinates[i:i + (len(coordinates) // NumberOfThreads) + 3] for i in
                  range(0, len(coordinates), len(coordinates) // NumberOfThreads)]
    result_path = []
    threads = []
    for i in range(NumberOfThreads):
        t = StreetViewThread(slicedlist[i], (len(slicedlist[0]) * i), centercoord, height)
        threads.append(t)
        t.start()
    for t in threads:
        t.join()
        result_path.extend(t.result)
    return sorted(result_path, key=str)


def make_video(images, output_path, fps, size=(640, 480), is_color=True):
    """Makes video using XVID codec. Increase FPS for faster timelapse."""
    #fourcc = cv2.VideoWriter_fourcc(*'FFV1')
    #fourcc = cv2.VideoWriter_fourcc(*'XVID')
    #fourcc = cv2.VideoWriter_fourcc(*'DIVX')
    #fourcc = cv2.VideoWriter_fourcc(*'DIV3')
    #fourcc = cv2.VideoWriter_fourcc('F','M','P','4')
    #fourcc = cv2.VideoWriter_fourcc('D','I','V','X')
    #fourcc = cv2.VideoWriter_fourcc('D','I','V','3')
    #fourcc = cv2.VideoWriter_fourcc('F','F','V','1')
    fps_num = int(fps)

    fourcc = cv2.VideoWriter_fourcc('m', 'p', '4', 'v')
    vid = cv2.VideoWriter(output_path, fourcc, fps_num, size, is_color)
    for image in images:
        img = cv2.imread(image)
        vid.write(img)
    vid.release()
    cv2.destroyAllWindows()



def save_location():
    outputlocation = input("Where do you want to save this file?: \n")
    while not os.path.exists(outputlocation):
        print("Invalid Path: " + outputlocation + "\nTry again")
        outputlocation = input("Where do you want to save this file?: \n")
    return outputlocation


def construct_video(start_address, end_address, accurate_bool, filename_hash, fps):
    #start = "130 Constitution Street, Bristol RI"#input('Input Origin: ')
    start = start_address
    end = end_address
    accurate = accurate_bool
    #end = "Roger Williams University"#input('Input Destination: ')
    #accurate = input('Is the information above accurate? Type True or False: ')

    if accurate == "True":
        print("Generating a drive time-lapse")
        outputname = filename_hash + ".mp4"
        #input('Please type in name of file: \n') + ".mp4"
        outputlocation = "../static" #save_location()
        imagelocations = streetview_thread(build_coords(get_result(_build_directions_url(start, end))))
    else:
        print("Generating a drive time-lapse")
        outputname = filename_hash + ".mp4"
        #input('Please type in name of file: \n') + ".mp4"
        outputlocation = "../static"
        imagelocations = streetview_thread(build_coords(get_result(_build_directions_url(start, end))))

    make_video(imagelocations, os.path.join(outputlocation, outputname), fps)

    print("Video Generated Successfully at " + os.path.join(outputlocation, outputname))
    #if os.path.exists(os.path.join(outputlocation, outputname)):
    #    subprocess.call("/Users/coreysabia/Desktop/ffmpeg -i " + os.path.join("/Users/coreysabia/Documents/GitHub/Tricky-Maps-Test-API/static/", outputname) + " /Users/coreysabia/Documents/GitHub/Tricky-Maps-Test-API/static/seeeeee.mov")
    #else:
    #   print("dude")

# TODO:
# Better input correction and error handling.
# Figure out how to USE JAVASCRIPT API TO CALL StreetViewService