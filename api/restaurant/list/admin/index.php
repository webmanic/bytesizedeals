<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../../server/database/insert/restaurant.php');
    require_once(dirname(__FILE__) . '/../../../../server/service/jwt/index.php');

    if(isset(getallheaders()['X-Token'],
             $_GET['active']) &&
       !empty(getallheaders()['X-Token'])){

        $geoLcoation = new stdClass();

        $pageNo = 0;

        if(isset($_GET['search'])){
            $search = $_GET['search'];
        }else{
            $search = '';
        }

        if(isset($_GET['pageNo'])){
            $pageNo = intval($_GET['pageNo']);
            if($pageNo < 0){
                $pageNo = 0;
            }
        }

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

        $token = getallheaders()['X-Token'];
        $active = $_GET['active'] === "true" ? 1 : 0;

        $jwt = new JWTUtils();

        try{

            $user = $jwt -> isValid($token);

            $listRestaurant = new CheckRestaurant();

            $listRestaurant = $listRestaurant -> listRestaurantAdmin($user, $active, $search, $geoLcoation, $pageNo);

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
        $response = new HttpStatusCode(400);
        $response -> data -> message = "Input Fields are required";
        print(json_encode($response));
    } 

?>