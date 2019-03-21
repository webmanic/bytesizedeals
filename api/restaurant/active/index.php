<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../server/database/update/restaurant.php');
    require_once(dirname(__FILE__) . '/../../../server/service/jwt/index.php');

    if(isset(getallheaders()['X-Token'],
             $_POST['restaurant_id'],
             $_POST['restaurant_user_id'],
             $_POST['restaurant_active'],
             $_POST['restaurant_extra_days'],
             $_POST['restaurant_token'],
             $_POST['restaurant_extra_days']) &&
       !empty(getallheaders()['X-Token']) &&
       !empty($_POST['restaurant_id']) &&
       !empty($_POST['restaurant_user_id']) &&
       !empty($_POST['restaurant_active']) &&
       !empty($_POST['restaurant_extra_days']) && 
       !empty($_POST['restaurant_token']) &&
       !empty($_POST['restaurant_extra_days'])){

        $token = getallheaders()['X-Token'];
        $restaurant_id = $_POST['restaurant_id'];
        $restaurant_user_id = $_POST['restaurant_user_id'];
        $restaurant_active = $_POST['restaurant_active'];
        $restaurant_extra_days = $_POST['restaurant_extra_days'];
        $restaurant_token = $_POST['restaurant_token'];
        $active = $_POST['active'] == "true" ? 1 : 2;

        $jwt = new JWTUtils();

        try{

            $user = $jwt -> isValid($token);

            $activeRestaurant = new UpdateRestaurant();
            $activeRestaurant = $activeRestaurant -> activeRestaurant($user -> user_id, $restaurant_id, $restaurant_user_id, $restaurant_token, $restaurant_active, $restaurant_extra_days, $active);

            if($activeRestaurant  -> status != 200){
                $response = new HttpStatusCode($activeRestaurant -> status);
                $response -> data = $activeRestaurant;
                print(json_encode($response));
            }else{
                $response = new HttpStatusCode(200);
                $response -> data = $activeRestaurant ;
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