<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../server/database/update/user.php');
    require_once(dirname(__FILE__) . '/../../../server/service/jwt/index.php');

    if(isset(getallheaders()['X-Token']) &&
       !empty(getallheaders()['X-Token'])){

        $token = getallheaders()['X-Token'];
        $jwt = new JWTUtils();

        try{

            $user = $jwt -> isValid($token);

            $activeUser = new UpdateUser();
            $activeUser = $activeUser -> activeUser($user -> user_id, $user -> token);

            if($activeUser  -> status != 200){
                $response = new HttpStatusCode($activeUser -> status);
                $response -> data = $activeUser;
                print(json_encode($response));
            }else{
                $response = new HttpStatusCode(200);
                $response -> data = $activeUser;
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