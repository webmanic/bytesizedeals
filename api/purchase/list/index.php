<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../server/database/select/purchase.php');
    require_once(dirname(__FILE__) . '/../../../server/service/jwt/index.php');

    if(isset(getallheaders()['X-Token']) &&
       !empty(getallheaders()['X-Token'])){

        $token = getallheaders()['X-Token'];

        $jwt = new JWTUtils();
        $purchase = new Purchase();

        try{
            $user = $jwt -> isValid($token);

            if(in_array("restaurant", $user -> role)){
                $purchase = $purchase -> getPurchasedRestaurantListUser($user);
            }else if(in_array("administrator", $user -> role)){
                $purchase = $purchase -> getPurchasedRestaurantListAdmin();
            }else{
                throw new Exception('Invalid Token'); 
            }

            if($purchase  -> status != 200){
                $response = new HttpStatusCode($purchase -> status);
                $response -> data = $purchase;
                print(json_encode($response));
            }else{
                $response = new HttpStatusCode(200);
                $response -> data = $purchase ;
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