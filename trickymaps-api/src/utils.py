import hashlib
import subprocess, os

def encode_filename(start_address):
    result = hashlib.md5(start_address.encode())
  
    # printing the equivalent hexadecimal value.
    print("The hexadecimal equivalent of hash is : ", end ="")
    print(result.hexdigest())

    return result.hexdigest()

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
