<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../server/database/insert/blog.php');
    require_once(dirname(__FILE__) . '/../../../server/service/jwt/index.php');

    if(isset(getallheaders()['X-Token'],
       $_POST['restaurant_id'],
       $_POST['comment'],
       $_POST['rate']) &&
       !empty(getallheaders()['X-Token']) &&
       !empty($_POST['restaurant_id']) &&
       !empty($_POST['comment'] && 
       !empty($_POST['rate']))){

        $token = getallheaders()['X-Token'];

        $jwt = new JWTUtils();

        try{
            $user = $jwt -> isValid($token);
            $restaurant_id = $_POST['restaurant_id'];
            $comment = $_POST['comment'];
            $rate = $_POST['rate'];

            $insert = new Blog();
            $insert = $insert -> blog_comment($user, $restaurant_id, $comment, $rate);

            if($insert  -> status != 200){
                $response = new HttpStatusCode($insert -> status);
                $response -> data = $insert;
                print(json_encode($response));
            }else{
                $response = new HttpStatusCode(200);
                $response -> data = $insert ;
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