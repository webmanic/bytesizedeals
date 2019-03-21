<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../server/database/update/purchase.php');
    require_once(dirname(__FILE__) . '/../../../server/service/jwt/index.php');

    if(isset(getallheaders()['X-Token'],
             $_POST['id'],
             $_POST['payment_id'],
             $_POST['token'],
             $_POST['paid']) &&
       !empty(getallheaders()['X-Token']) &&
       !empty($_POST['id']) &&
       !empty($_POST['paid']) &&
       !empty($_POST['payment_id']) &&
       !empty($_POST['token'])){

        $token = getallheaders()['X-Token'];
        $id = $_POST['id'];
        $payment_id = $_POST['payment_id'];
        $payment_token = $_POST['token'];
        $paid = $_POST['paid'] == 'true' ? 1 : 0;

        $jwt = new JWTUtils();
        $purchase = new UpdatePurchase();

        try{
            $user = $jwt -> isValid($token);

            if(in_array("administrator", $user -> role)){
                $purchase = $purchase -> paid($user, $id, $payment_id, $payment_token, $paid);
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