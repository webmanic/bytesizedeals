<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../../server/database/update/blog.php');
    require_once(dirname(__FILE__) . '/../../../../server/service/jwt/index.php');

    if(isset(getallheaders()['X-Token'],
       $_POST['restaurant_id'],
       $_POST['blog_id'],
       $_POST['blog_user_id'],
       $_POST['blog_token']) &&
       !empty(getallheaders()['X-Token']) &&
       !empty($_POST['restaurant_id']) &&
       !empty($_POST['blog_id']) &&
       !empty($_POST['blog_user_id']) &&
       !empty($_POST['blog_token'])){

        $token = getallheaders()['X-Token'];

        $jwt = new JWTUtils();

        try{
            $user = $jwt -> isValid($token);
            $restaurant_id = $_POST['restaurant_id'];
            $blog_id = $_POST['blog_id'];
            $blog_user_id = $_POST['blog_user_id'];
            $blog_token = $_POST['blog_token'];

            if($user->user_id != $blog_user_id){
                $update = new UpdateBlog();
                $update = $update -> blog_comment_flag($user, $restaurant_id, $blog_id, $blog_user_id, $blog_token);

                if($update  -> status != 200){
                    $response = new HttpStatusCode($update -> status);
                    $response -> data = $update;
                    print(json_encode($response));
                }else{
                    $response = new HttpStatusCode(200);
                    $response -> data = $update ;
                    print(json_encode($response));
                }
            }else{
                $response = new HttpStatusCode(401);
                $response -> data -> message = "Unauthorised";
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