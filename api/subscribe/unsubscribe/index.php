<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require(dirname(__FILE__) . '/../../../server/database/select/subscribe.php');
    require(dirname(__FILE__) . '/../../../server/database/update/subscribe.php');

    if(isset($_GET["token"]) && !empty($_GET["token"])){

        $token = $_GET["token"];

        $updateSubscribe = new UpdateSubscribe();
        $updateSubscribe = $updateSubscribe -> emailUnsubscribe($token);

        if($updateSubscribe  -> status != 200){
            $response = new HttpStatusCode($updateSubscribe -> status);
            $response -> data = $updateSubscribe;
            print(json_encode($response));
        }else{
            $response = new HttpStatusCode(200);
            $response -> data = $updateSubscribe;
            print(json_encode($response));
        }
    }else{
        $response = new HttpStatusCode(401);
        $response -> data = $emailValid;
        print(json_encode($response));
    }

?>