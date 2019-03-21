<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../server/database/select/blog.php');
    
    $pageNo = 0;

    if(isset($_GET['pageNo'])){
        $pageNo = intval($_GET['pageNo']);
        if($pageNo < 0){
            $pageNo = 0;
        }
    }

    if(isset($_GET['restaurant_id']) &&
       !empty($_GET['restaurant_id'])){

        $restaurant_id = $_GET['restaurant_id'];

        $blog = new CheckBlog();
        $blog = $blog -> listComment($restaurant_id, $pageNo);

        if($blog  -> status != 200){
            $response = new HttpStatusCode($blog -> status);
            $response -> data = $blog;
            print(json_encode($response));
        }else{
            $response = new HttpStatusCode(200);
            $response -> data = $blog ;
            print(json_encode($response));
        }
    }else{
        $response = new HttpStatusCode(400);
        $response -> data -> message = "Input Fields are required";
        print(json_encode($response));
    } 
?>