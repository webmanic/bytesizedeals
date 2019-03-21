<?php

    require_once(dirname(__FILE__) . '/../config/index.php');

    class GeoCoding{

        function __construct(){

        }

        function getAddressArray($addressObj){

            $address_list = [];

            if(!empty($addressObj -> address_line1)){
                array_push($address_list, $addressObj -> address_line1);
            }
            if(!empty($addressObj -> address_line2)){
                array_push($address_list, $addressObj -> address_line2);
            }
            if(!empty($addressObj -> address_line3)){
                array_push($address_list, $addressObj -> address_line3);
            }
            if(!empty($addressObj -> city)){
                array_push($address_list, $addressObj -> city);
            }
            if(!empty($addressObj -> postcode)){
                array_push($address_list, $addressObj -> postcode);
            }
            if(!empty($addressObj -> county)){
                array_push($address_list, $addressObj -> county);
            }
            if(!empty($addressObj -> country)){
                array_push($address_list, $addressObj -> country);
            }

            return $address_list;
        }

        function getCoordinates($address){

            global $GOOGLE_GEOCODING_API_KEY;
 
            $address = str_replace(" ", "+", $address); // replace all the white space with "+" sign to match with google search pattern

            $url = "https://maps.googleapis.com/maps/api/geocode/json?address=$address&key=$GOOGLE_GEOCODING_API_KEY";
                
            $response = file_get_contents($url);
                
            $json = json_decode($response,TRUE); //generate array object from the response from the web

            return $json;
        }

        /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
        /*::                                                                         :*/
        /*::  This routine calculates the distance between two points (given the     :*/
        /*::  latitude/longitude of those points). It is being used to calculate     :*/
        /*::  the distance between two locations using GeoDataSource(TM) Products    :*/
        /*::                                                                         :*/
        /*::  Definitions:                                                           :*/
        /*::    South latitudes are negative, east longitudes are positive           :*/
        /*::                                                                         :*/
        /*::  Passed to function:                                                    :*/
        /*::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :*/
        /*::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :*/
        /*::    unit = the unit you desire for results                               :*/
        /*::           where: 'M' is statute miles (default)                         :*/
        /*::                  'K' is kilometers                                      :*/
        /*::                  'N' is nautical miles                                  :*/
        /*::  Worldwide cities and other features databases with latitude longitude  :*/
        /*::  are available at https://www.geodatasource.com                          :*/
        /*::                                                                         :*/
        /*::  For enquiries, please contact sales@geodatasource.com                  :*/
        /*::                                                                         :*/
        /*::  Official Web site: https://www.geodatasource.com                        :*/
        /*::                                                                         :*/
        /*::         GeoDataSource.com (C) All Rights Reserved 2017		   		     :*/
        /*::                                                                         :*/
        /*::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::*/
        function distance($lat1, $lon1, $lat2, $lon2, $unit) {
            $theta = $lon1 - $lon2;
            $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
            $dist = acos($dist);
            $dist = rad2deg($dist);
            $miles = $dist * 60 * 1.1515;
            $unit = strtoupper($unit);
        
            if ($unit == "K") {
            return ($miles * 1.609344);
            } else if ($unit == "N") {
                return ($miles * 0.8684);
            } else {
                return $miles;
                }
        }
    }
?>