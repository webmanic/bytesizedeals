<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require(dirname(__FILE__) . '/../../../server/database/select/user.php');
    require(dirname(__FILE__) . '/../../../server/utils/validation/email/index.php');

    if(isset($_POST["username"]) && 
      (!empty($_POST["username"])))
    {
        $username = $_POST["username"];

        $reset = new CheckUser();
        $reset = $reset -> reset($username);

        if($reset -> status != 200){
            $response = new HttpStatusCode($reset -> status);
            $response -> data = $reset;
            print(json_encode($response));
        }
        else{
            $response = new HttpStatusCode(200);
            $response -> data = $reset;
            print(json_encode($response));
        }
        
    }else{
        $response = new HttpStatusCode(400);
        $response -> data -> message = "Input Fields are required";
        print(json_encode($response));
    }
?>
