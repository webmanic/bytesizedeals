<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../server/database/select/restaurant.php');

    $geoLcoation = new stdClass();

    $pageNo = 0;

    if(isset($_GET['search'])){
        $search = $_GET['search'];
    }else{
        $search = '';
    }

    if(isset($_GET['pageNo'])){
        $pageNo = intval($_GET['pageNo']);
        if($pageNo < 0){
            $pageNo = 0;
        }
    }

    if(isset($_GET['latitude'],
             $_GET['longitude']) && 
       !empty($_GET['latitude']) &&
       !empty($_GET['longitude'])){
        $geoLcoation -> latitude = $_GET['latitude'];
        $geoLcoation -> longitude = $_GET['longitude'];
        $geoLcoation -> found = true;
    }else{
        $geoLcoation -> found = false;
    }


    $listRestaurant = new CheckRestaurant();

    $listRestaurant = $listRestaurant -> listRestaurant($search, $geoLcoation, $pageNo);

    if($listRestaurant  -> status != 200){
        $response = new HttpStatusCode($listRestaurant -> status);
        $response -> data = $listRestaurant;
        print(json_encode($response));
    }else{
        $response = new HttpStatusCode(200);
        $response -> data = $listRestaurant ;
        print(json_encode($response));
    }
    
?>