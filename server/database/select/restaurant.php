<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/password/index.php');
    require_once(dirname(__FILE__) . '/../../service/jwt/index.php');
    require_once(dirname(__FILE__) . '/../../service/geocoding/index.php');

    class CheckRestaurant{

        function __construct(){

        }
     
        function checkRestaurant($user){

            global $conn;

            $obj = new stdClass();

            $user_id = $user -> user_id;

            $sql = "SELECT user_id 
                    FROM restaurant 
                    WHERE user_id = $user_id 
                    AND user_id = $user_id
                    AND active != 2";
            
            $result = $conn->query($sql);
            
            if ($result -> num_rows > 0) {
                $obj -> status = 409;
                $obj -> message = "Already signed up";
            } else {
                $obj -> status = 200;
                //$obj -> message = "Error: " . $sql . "<br>" . $conn->error;
                $obj -> message = "Not signed up";
            }

            return $obj;
        }

        function listRestaurantUser($user){

            global $conn;

            $obj = new stdClass();

            $user_id = $user -> user_id;

            $query_restaurant = "SELECT * 
                                 FROM restaurant 
                                 INNER JOIN restaurant_address 
                                 ON restaurant.id = restaurant_address.restaurant_id
                                 WHERE user_id=$user_id AND active = 1 OR active = 2";

            $result_restaurant = $conn->query($query_restaurant);

            if ($result_restaurant->num_rows > 0) {

                $list_restaurant = [];

                while($row = $result_restaurant->fetch_assoc()) {
                    $logo = explode('/' , $row['logo']);
                    $row['categories'] = explode(',' , $row['categories']);
                    $row['gallery'] = explode(',' , $row['gallery']);
                    $row['logoName'] = array_pop($logo);
                    $row['visible'] = $row['visible'] == 1 ? true : false;
                    array_push($list_restaurant, $row);
                }

                $obj -> status = 200;
                $obj -> data = $list_restaurant;

            }else{
                $obj -> status = 401;
                $obj -> message = "Not Found";
            }

            return $obj;

        }

        function listRestaurantActive($user){

            global $conn;

            $obj = new stdClass();
            $response = new stdClass();

            $user_id = $user -> user_id;

            $query_restaurant = "SELECT id, 
                                        active 
                                 FROM restaurant 
                                 WHERE user_id=$user_id";

            $result_restaurant = $conn->query($query_restaurant);

            if ($result_restaurant->num_rows > 0) {
                
                while($row = $result_restaurant->fetch_assoc()) {
                    $response -> active = $row['active'];
                    $response -> restaurant_id = $row['id'];
                }

                $obj -> status = 200;
                $obj -> data = $response;

            }else{
                $obj -> status = 401;
                $obj -> message = "Not Found";
            }

            return $obj;

        }

        function listRestaurantAdmin($user, $active, $search, $geoLcoation, $pageNo){

            global $conn;

            $obj = new stdClass();
            $geoLocation = new GeoCoding();

            $offset = 0;
            $page_result = 8; 
            $offset = $pageNo * $page_result;

            $user_latitude = 0;
            $user_longitude = 0;

            if($geoLcoation -> found == true){
                $user_latitude = $geoLcoation -> latitude;
                $user_longitude = $geoLcoation -> longitude;
            }

            $user_id = $user -> user_id;

            $query_role = "SELECT user_id, role_id 
                           FROM user_role 
                           WHERE user_id=$user_id 
                           AND role_id=1";
            $result_role = $conn->query($query_role);

            $query_restaurant = "SELECT SQL_CALC_FOUND_ROWS
                                        user.id as user_id,
                                        user.email,
                                        user.username,
                                        restaurant.mobile_no,
                                        restaurant.telephone_no,
                                        restaurant.id as restaurant_id, 
                                        restaurant.title, 
                                        restaurant.description, 
                                        restaurant.categories,
                                        restaurant.opening_hours,
                                        restaurant.link, 
                                        restaurant.logo, 
                                        restaurant.gallery,
                                        restaurant.review,
                                        restaurant.rate,
                                        restaurant.token,
                                        restaurant.active,
                                        restaurant.start_date,
                                        restaurant.end_date,
                                        restaurant.extra_days,
                                        restaurant.datetime, 
                                        restaurant_address.address_line1, 
                                        restaurant_address.address_line2, 
                                        restaurant_address.address_line3 ,
                                        restaurant_address.city,
                                        restaurant_address.county,
                                        restaurant_address.post_code,
                                        restaurant_address.country,
                                        restaurant_address.longitude,
                                        restaurant_address.latitude,
                                        (3959 * acos(cos(radians($user_latitude)) * cos(radians(restaurant_address.latitude)) * cos(radians(restaurant_address.longitude) - radians($user_longitude)) + sin(radians($user_latitude)) * sin(radians(restaurant_address.latitude)))) 
                                AS distance
                                FROM restaurant 
                                INNER JOIN user ON user.id = restaurant.user_id
                                INNER JOIN restaurant_address ON restaurant.id = restaurant_address.restaurant_id
                                WHERE restaurant.active=$active OR restaurant.active=2
                                ORDER BY distance
                                LIMIT $offset , $page_result";

            $result_restaurant = $conn->query($query_restaurant);
            
            if ($result_role->num_rows > 0) {

                if ($result_restaurant->num_rows > 0) {

                    $result_restaurant_count = $conn->query("Select FOUND_ROWS()"); 
                    $result_restaurant_count = $result_restaurant_count->fetch_assoc()["FOUND_ROWS()"]; 

                    $list_restaurant = [];

                    while($row = $result_restaurant->fetch_assoc()) {
                        if($row['categories']){
                            $row['categories'] = explode(',' , $row['categories']);
                        }
                        $logo = explode('/' , $row['logo']);
                        if($row['gallery']){
                            $row['gallery'] = explode(',' , $row['gallery']);
                        }
                        $row['logoName'] = array_pop($logo);
                        $row['opening_hours'] = json_decode($row['opening_hours']);
                        if($geoLcoation -> found == true && $row["latitude"] != 0 && $row["longitude"] != 0){
                            $row['distance'] = $geoLocation -> distance($row["latitude"], $row["longitude"], $geoLcoation -> latitude, $geoLcoation -> longitude, 'M');
                        }else{
                            unset($row['distance']);
                        }
                        array_push($list_restaurant, $row);
                    }

                    $obj -> status = 200;
                    $obj -> data = $list_restaurant;
                    $obj -> rowNo = intval(ceil($result_restaurant_count / $page_result));
                    
                }else{
                    $obj -> status = 404;
                    $obj -> message = "Not Found";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorised";
            }

            return $obj;
        }

        function listRestaurantId($id, $geoLcoation){

            global $conn;

            $obj = new stdClass();
            $geoLocation = new GeoCoding();

            $user_latitude = 0;
            $user_longitude = 0;

            if($geoLcoation -> found == true){
                $user_latitude = $geoLcoation -> latitude;
                $user_longitude = $geoLcoation -> longitude;
            }
            
            $query_restaurant = "SELECT user.email,
                                        restaurant.id,
                                        restaurant.mobile_no,
                                        restaurant.telephone_no,  
                                        restaurant.title, 
                                        restaurant.description, 
                                        restaurant.discount,
                                        restaurant.categories,
                                        restaurant.opening_hours,
                                        restaurant.link, 
                                        restaurant.logo, 
                                        restaurant.gallery, 
                                        restaurant.datetime, 
                                        restaurant.review,
                                        restaurant.rate,
                                        restaurant_address.address_line1, 
                                        restaurant_address.address_line2, 
                                        restaurant_address.address_line3,
                                        restaurant_address.city,
                                        restaurant_address.county,
                                        restaurant_address.post_code,
                                        restaurant_address.country, 
                                        restaurant_address.latitude,
                                        restaurant_address.longitude,
                                        (3959 * acos(cos(radians($user_latitude)) * cos(radians(restaurant_address.latitude)) * cos(radians(restaurant_address.longitude) - radians($user_longitude)) + sin(radians($user_latitude)) * sin(radians(restaurant_address.latitude)))) 
                                 AS distance
                                 FROM restaurant 
                                 INNER JOIN user ON user.id = restaurant.user_id
                                 INNER JOIN restaurant_address ON restaurant.id = restaurant_address.restaurant_id
                                 WHERE restaurant.id=$id 
                                 AND restaurant.active=1
                                 AND restaurant.visible=1
                                 AND CURDATE() between restaurant.start_date AND restaurant.end_date";

            $result_restaurant = $conn->query($query_restaurant);

            if ($result_restaurant->num_rows > 0) {

                $list_restaurant = [];

                while($row = $result_restaurant->fetch_assoc()) {
                    if($row['categories']){
                        $row['categories'] = explode(',' , $row['categories']);
                    }
                    $logo = explode('/' , $row['logo']);
                    if($row['gallery']){
                        $row['gallery'] = explode(',' , $row['gallery']);
                    }
                    $row['opening_hours'] = json_decode($row['opening_hours']);
                    $row['logoName'] = array_pop($logo);
                    if($geoLcoation -> found == true && $row["latitude"] != 0 && $row["longitude"] != 0){
                        $row['distance'] = $geoLocation -> distance($row["latitude"], $row["longitude"], $geoLcoation -> latitude, $geoLcoation -> longitude, 'M');
                    }else{
                        unset($row['distance']);
                    }
                    array_push($list_restaurant, $row);
                }

                $obj -> status = 200;
                $obj -> data = $list_restaurant;

            }else{
                $obj -> status = 404;
                $obj -> message = "Not Found";
            }

            return $obj;

        }


        function listRestaurantProfileId($id, $geoLcoation){

            global $conn;

            $obj = new stdClass();
            $geoLocation = new GeoCoding();

            $user_latitude = 0;
            $user_longitude = 0;

            if($geoLcoation -> found == true){
                $user_latitude = $geoLcoation -> latitude;
                $user_longitude = $geoLcoation -> longitude;
            }
            
            $query_restaurant = "SELECT user.email,
                                        restaurant.id,
                                        restaurant.mobile_no,
                                        restaurant.telephone_no,  
                                        restaurant.title, 
                                        restaurant.description, 
                                        restaurant.discount,
                                        restaurant.categories,
                                        restaurant.opening_hours,
                                        restaurant.link, 
                                        restaurant.logo, 
                                        restaurant.gallery, 
                                        restaurant.datetime, 
                                        restaurant.review,
                                        restaurant.rate,
                                        restaurant.visible,
                                        restaurant.start_date,
                                        restaurant.end_date,
                                        restaurant.token,
                                        restaurant.active,
                                        restaurant_address.address_line1, 
                                        restaurant_address.address_line2, 
                                        restaurant_address.address_line3,
                                        restaurant_address.city,
                                        restaurant_address.county,
                                        restaurant_address.post_code,
                                        restaurant_address.country, 
                                        restaurant_address.latitude,
                                        restaurant_address.longitude,
                                        (3959 * acos(cos(radians($user_latitude)) * cos(radians(restaurant_address.latitude)) * cos(radians(restaurant_address.longitude) - radians($user_longitude)) + sin(radians($user_latitude)) * sin(radians(restaurant_address.latitude)))) 
                                 AS distance
                                 FROM restaurant 
                                 INNER JOIN user ON user.id = restaurant.user_id
                                 INNER JOIN restaurant_address ON restaurant.id = restaurant_address.restaurant_id
                                 WHERE restaurant.id=$id 
                                 AND restaurant.active=1 OR restaurant.active=2";

            $result_restaurant = $conn->query($query_restaurant);

            if ($result_restaurant->num_rows > 0) {

                $list_restaurant = [];

                while($row = $result_restaurant->fetch_assoc()) {
                    if($row['categories']){
                        $row['categories'] = explode(',' , $row['categories']);
                    }
                    $logo = explode('/' , $row['logo']);
                    if($row['gallery']){
                        $row['gallery'] = explode(',' , $row['gallery']);
                    }
                    $row['opening_hours'] = json_decode($row['opening_hours']);
                    $row['logoName'] = array_pop($logo);
                    if($geoLcoation -> found == true && $row["latitude"] != 0 && $row["longitude"] != 0){
                        $row['distance'] = $geoLocation -> distance($row["latitude"], $row["longitude"], $geoLcoation -> latitude, $geoLcoation -> longitude, 'M');
                    }else{
                        unset($row['distance']);
                    }
                    array_push($list_restaurant, $row);
                }

                $obj -> status = 200;
                $obj -> data = $list_restaurant;

            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorized";
            }

            return $obj;

        }


        function listRestaurant($search, $geoLcoation, $pageNo){

            global $conn;

            $obj = new stdClass();
            $geoLocation = new GeoCoding();

            $offset = 0;
            $page_result = 8; 
            $offset = $pageNo * $page_result;

            $user_latitude = 0;
            $user_longitude = 0;

            if($geoLcoation -> found == true){
                $user_latitude = $geoLcoation -> latitude;
                $user_longitude = $geoLcoation -> longitude;
            }

            $query_restaurant = "SELECT SQL_CALC_FOUND_ROWS
                                        user.email,
                                        restaurant.mobile_no,
                                        restaurant.telephone_no,
                                        restaurant.id, 
                                        restaurant.title, 
                                        restaurant.categories,
                                        restaurant.opening_hours,
                                        restaurant.link, 
                                        restaurant.logo, 
                                        restaurant.review,
                                        restaurant.rate,
                                        restaurant.datetime, 
                                        restaurant_address.address_line1, 
                                        restaurant_address.address_line2, 
                                        restaurant_address.address_line3 ,
                                        restaurant_address.city,
                                        restaurant_address.county,
                                        restaurant_address.post_code,
                                        restaurant_address.country,
                                        restaurant_address.longitude,
                                        restaurant_address.latitude,
                                        (3959 * acos(cos(radians($user_latitude)) * cos(radians(restaurant_address.latitude)) * cos(radians(restaurant_address.longitude) - radians($user_longitude)) + sin(radians($user_latitude)) * sin(radians(restaurant_address.latitude)))) 
                                 AS distance
                                 FROM restaurant 
                                 INNER JOIN user ON user.id = restaurant.user_id
                                 INNER JOIN restaurant_address ON restaurant.id = restaurant_address.restaurant_id
                                 WHERE (restaurant.title LIKE '%$search%'
                                 OR restaurant.categories LIKE '%$search%'
                                 OR restaurant_address.post_code LIKE '%$search%') 
                                 AND restaurant.visible=1 
                                 AND (restaurant.active=1 OR restaurant.active=2)
                                 AND CURDATE() between restaurant.start_date AND restaurant.end_date
                                 ORDER BY distance
                                 LIMIT $offset , $page_result";

            $result_restaurant = $conn->query($query_restaurant);

            if ($result_restaurant->num_rows > 0) {

                $result_restaurant_count = $conn->query("Select FOUND_ROWS()"); 
                $result_restaurant_count = $result_restaurant_count->fetch_assoc()["FOUND_ROWS()"]; 
 
                $list_restaurant = [];
                
                while($row = $result_restaurant->fetch_assoc()) {
                    if($row['categories']){
                        $row['categories'] = explode(',' , $row['categories']);
                    }
                    $logo = explode('/' , $row['logo']);
                    $row['logoName'] = array_pop($logo);
                    $row['opening_hours'] = json_decode($row['opening_hours']);
                    if($geoLcoation -> found == true && $row["latitude"] != 0 && $row["longitude"] != 0){
                        $row['distance'] = $geoLocation -> distance($row["latitude"], $row["longitude"], $geoLcoation -> latitude, $geoLcoation -> longitude, 'M');
                    }else{
                        unset($row['distance']);
                    }
                    array_push($list_restaurant, $row);
                }
                $obj -> status = 200;
                $obj -> data = $list_restaurant;
                $obj -> rowNo = intval(ceil($result_restaurant_count / $page_result));

            }else{
                $obj -> status = 404;
                $obj -> message = "Not Found";
            }

            return $obj;

        }
    }

?>