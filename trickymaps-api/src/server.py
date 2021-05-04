import io
import json

from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
from gcputils import get_random_point, get_location_from_point, get_locations_from_points, get_route
from streetviewutils import construct_video
from utils import encode_filename, reencode_video
from calculations import distance, distance2, calculate_score
import os.path
from os import path



def make_server() -> Flask:
    app = Flask(__name__)

    @app.route('/')
    def root_path():
        return "TrickyMaps REST Endpoint"

    @app.route('/api/get_random_point', methods=['GET', 'POST'])
    def get_point():
        print(request.json)
        print(request)
        obj = request.json
        print("HELLO" + str(request.data))
        return get_random_point(obj['lat'], obj['lon'], obj['dist'])
    
    @app.route('/api/get_location_from_point', methods=['GET', 'POST'])
    def get_location():
        print(request.json)
        print(request)
        obj_start = request.json
        return get_location_from_point(
            obj_start['lat'], 
            obj_start['lon'], 
            )

    @app.route('/api/get_locations_from_points', methods=['GET', 'POST'])
    def get_locations():
        print(request.json)
        obj_start = request.json
        obj_destination = get_random_point(
            obj_start['lat'], 
            obj_start['lon'], 
            obj_start['dist']
            )
        return get_locations_from_points(
            obj_start['lat'], 
            obj_start['lon'], 
            obj_destination['lat'], 
            obj_destination['lon']
            )
    
    @app.route('/api/get_route_from_points', methods=['GET', 'POST'])
    def get__route_from_points():
        print(request.json)
        print(request)

        obj_start = request.json
        def loop_until_success():
            try: 
                obj_destination = get_random_point(
                    obj_start['lat'], 
                    obj_start['lon'], 
                    obj_start['dist']
                )
                result = get_route(
                    obj_start['lat'], 
                    obj_start['lon'], 
                    obj_destination['lat'], 
                    obj_destination['lon']
                    )
                return result
            except Exception:
                return loop_until_success()
        
        return loop_until_success()
    
    @app.route('/api/get_score', methods=['GET', 'POST'])
    def get_score():
        obj = request.json
        print(request.json)
        print(request)

        guess_cors = [
            obj['guess_lat'], 
            obj['guess_lon'] 
        ]

        distance_cors = [
            obj['destination_lat'],
            obj['destination_lon']
        ]

        distance_value = distance2(
            guess_cors,
            distance_cors
            )

        test = {
            'feet_from_destination': round(distance_value),
            'score': calculate_score(distance_value)
        }

        print(test)

        return test

    @app.route('/api/get_video', methods=['GET', 'POST'])
    def get_locations_vid():
        print(request.data)
        print(request)
        obj_start = request.json

        def get_successful_route():
            try: 
                obj_destination = get_random_point(
                    obj_start['lat'], 
                    obj_start['lon'], 
                    obj_start['dist']
                )
                result = get_route(
                    obj_start['lat'], 
                    obj_start['lon'], 
                    obj_destination['lat'], 
                    obj_destination['lon']
                    )
                return obj_destination
            except Exception:
                return get_successful_route()
        
        obj_destination = get_successful_route()

        locations = get_locations_from_points(
            obj_start['lat'], 
            obj_start['lon'], 
            obj_destination['lat'], 
            obj_destination['lon']
            )
        start = locations['start_location_name']
        end = locations['destination_location_name']
        address_string = start + end

        filename_hash = encode_filename(address_string, obj_start['fps'])
        file_path = "../static/final_" + filename_hash + ".mov"

        if (path.exists(file_path)):
            print("RETURNED CACHED VIDEO")
            result = {
                "start_location_name": start,
                "end_location_name": end,
                "start_cords": obj_start,
                "end_cords": obj_destination,
                "filename": "final_" + filename_hash + ".mov",
                "cached": True
            }
        else:
            print("RETURNED ENCODED VIDEO")
            construct_video(start, end, True, filename_hash, obj_start['fps'])
            reencode_video(filename_hash)
            result = {
                "start_location_name": start,
                "end_location_name": end,
                "start_cords": obj_start,
                "end_cords": obj_destination,
                "filename": "final_" + filename_hash + ".mov",
                "cached": False

            }


        return result
    
    #this is dumb security wise
    @app.route('/api/static_video/<path:filename>')
    def download_file(filename: str):
        folder_path = "../static"
        return send_from_directory(folder_path, filename)

    return app


if __name__ == '__main__':
    #args = get_args()
    app = make_server()
    app.debug = True
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
    app.run(host="0.0.0.0", port=5800)
