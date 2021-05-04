import hashlib
import subprocess, os

def encode_filename(address, fps):
    result = hashlib.md5(start_address.encode())
  
    # printing the equivalent hexadecimal value.
    print("The hexadecimal equivalent of hash is : ", end ="")
    print(result.hexdigest())

    final_string = result.hexdigest() + "_" + fps

    return final_string

def reencode_video(filename):
    filepath_source = "../static/{}.mp4".format(filename)
    filepath_output = '../static/final_{}.mov'.format(filename)
    FFMPEG_PATH = "ffmpeg"

    try:
        subprocess.call([FFMPEG_PATH, '-i', filepath_source, filepath_output])
    finally:
        # always cleanup original even if there are errors
        subprocess.call(['rm', '-f', filepath_source])

    return filepath_output
