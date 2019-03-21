<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../../server/utils/https/status/index.php');
    require(dirname(__FILE__) . '/../../../../server/database/update/user.php');
    require(dirname(__FILE__) . '/../../../../server/utils/validation/email/index.php');

    if(isset(getallheaders()['X-Token'],
             $_POST["password"]) && 
      (!empty(getallheaders()['X-Token']) &&
       !empty($_POST["password"])))
    {
        $password = $_POST["password"];
        $token = getallheaders()['X-Token'];
        $jwt = new JWTUtils();

        try{

            $user = $jwt -> isValid($token);

            $resetPassword = new UpdateUser();
            $resetPassword = $resetPassword -> resetPassword($user, $password);

            if($resetPassword -> status != 200){
                $response = new HttpStatusCode($resetPassword -> status);
                $response -> data = $resetPassword;
                print(json_encode($response));
            }
            else{
                $response = new HttpStatusCode(200);
                $response -> data = $resetPassword;
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
