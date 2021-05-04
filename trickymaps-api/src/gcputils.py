from geopy import Point
from geopy.distance import distance, geodesic
import random
import googlemaps
from datetime import datetime

#this needs to be removed and moved to config.json (do not push this to github)
gmaps = googlemaps.Client(key='REPLACE_WITH_YOUR_GCP_API_KEY')

# given: lat1, lon1, bearing, distMiles
def get_random_point(lat1: float, lon1: float, distance: int):
    distance_miles = random.randint(1, distance)
    bearing = random.randint(1,360)
    result = geodesic(miles=distance_miles).destination(Point(lat1, lon1), bearing).format_decimal()
    obj = [float(idx) for idx in result.split(', ')]
    obj_final = {
        "lat": obj[0],
        "lon": obj[1]
    }
    return obj_final

def get_location_from_point(lat1: float, lon1: float):
    # Look up an address with reverse geocoding
    reverse_geocode_result = gmaps.reverse_geocode((lat1, lon1))

    obj = {
        "destination": reverse_geocode_result
    }

    obj_final = {
        "location_name": obj["destination"][0]["formatted_address"]
    }

    return obj_final

def get_locations_from_points(lat1: float, lon1: float, lat2: float, lon2:float):
    # Look up an address with reverse geocoding
    reverse_geocode_result_1 = gmaps.reverse_geocode((lat1, lon1))
    reverse_geocode_result_2 = gmaps.reverse_geocode((lat2, lon2))

    obj = {
        "start_location_name": reverse_geocode_result_1[0]["formatted_address"],
        "destination_location_name": reverse_geocode_result_2[0]["formatted_address"]
    }

    return obj

def get_route(lat1: float, lon1: float, lat2: float, lon2:float):
    start = (lat1, lon1)
    end = (lat2, lon2)
    # add support for when it returns null becuase of invalid location
    result = gmaps.directions(start, end)
    if result == 0:
        raise Exception
    else:
        obj = {"directions": result}
    return obj



