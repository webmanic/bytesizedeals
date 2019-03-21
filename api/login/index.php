<?php
    
    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../server/utils/https/status/index.php');
    require(dirname(__FILE__) . '/../../server/database/select/user.php');
    require(dirname(__FILE__) . '/../../server/utils/validation/email/index.php');

    if(isset($_POST["username"], 
             $_POST["password"]) && 
      (!empty($_POST["username"]) && 
       !empty($_POST["password"])))
    {
        $username = $_POST["username"];
        $password = $_POST["password"];

        $loginCheck = new CheckUser();
        $loginCheck = $loginCheck -> checkLogin($username, $username, $password);

        if($loginCheck -> status != 200){
            $response = new HttpStatusCode($loginCheck -> status);
            $response -> data = $loginCheck;
            print(json_encode($response));
        }
        else{
            $response = new HttpStatusCode(200);
            $response -> data = $loginCheck;
            print(json_encode($response));
        }
        
    }else{
        $response = new HttpStatusCode(400);
        $response -> data -> message = "Input Fields are required";
        print(json_encode($response));
    }
?>