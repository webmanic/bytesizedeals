<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../../server/database/select/restaurant.php');
    require_once(dirname(__FILE__) . '/../../../../server/service/jwt/index.php');

    if(isset($_GET['id'],
       getallheaders()['X-Token']) && 
       !empty($_GET['id']) &&
       !empty(getallheaders()['X-Token'])){
        
        $jwt = new JWTUtils();
        $geoLcoation = new stdClass();

        try{

            $id = intval($_GET['id']);
            $token = getallheaders()['X-Token'];
            $user = $jwt -> isValid($token);

            if(isset($_GET['latitude'],
                    $_GET['longitude']) && 
            !empty($_GET['latitude']) &&
            !empty($_GET['longitude'])){
                $geoLcoation -> latitude = $_GET['latitude'];
                $geoLcoation -> longitude = $_GET['longitude'];
                $geoLcoation -> found = true;
            }else{
                $geoLcoation -> found = false;
            }
            
            $listRestaurant = new CheckRestaurant();

            $listRestaurant = $listRestaurant -> listRestaurantProfileId($id, $geoLcoation);

            if($listRestaurant  -> status != 200){
                $response = new HttpStatusCode($listRestaurant -> status);
                $response -> data = $listRestaurant;
                print(json_encode($response));
            }else{
                $response = new HttpStatusCode(200);
                $response -> data = $listRestaurant ;
                print(json_encode($response));
            }
        }catch(Exception $e){
            $response = new HttpStatusCode(401);
            $response -> invalid = "Invalid Token";
            print(json_encode($response));
        }
    }else{
        $response = new HttpStatusCode(401);
        $response -> data -> message = "Unauthorized";
        print(json_encode($response));
    } 

?>