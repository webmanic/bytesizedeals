<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../../server/database/select/restaurant.php');
    require_once(dirname(__FILE__) . '/../../../../server/service/jwt/index.php');

    if(isset(getallheaders()['X-Token']) &&
       !empty(getallheaders()['X-Token'])){

        $token = getallheaders()['X-Token'];

        $jwt = new JWTUtils();

        try{

            $user = $jwt -> isValid($token);

            $listRestaurant = new CheckRestaurant();

            $listRestaurant = $listRestaurant -> listRestaurantUser($user);

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