<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../../server/utils/https/status/index.php');
    require_once(dirname(__FILE__) . '/../../../server/database/insert/restaurant.php');
    require_once(dirname(__FILE__) . '/../../../server/service/jwt/index.php');
    require_once(dirname(__FILE__) . '/../../../server/service/file/index.php');

    global $logo, $logoFileType;

    $uploadOk = false;

    if(isset($_FILES["logo"]["name"])){
        $width = 679;
        $height = 400;
        $logo = basename($_FILES["logo"]["name"]);
        $logoFileType = strtolower(pathinfo($logo, PATHINFO_EXTENSION));
        $check = getimagesize($_FILES["logo"]["tmp_name"]);
        if($check !== false) {
            if($check[0] == $width && $check[1] == $height){
                $uploadOk = true;
            }else{
                $response = new HttpStatusCode(400);
                $response -> data -> message = "Invalid Image";
                $response -> data -> height = $height;
                $response -> data -> width = $width ;
                print(json_encode($response));
                return;
            }
            
        } else {
            $uploadOk = false;
        }
    }

    if(isset(getallheaders()['X-Token'],
             $_POST['title'],
             $_POST['description'],
             $_POST['categories'],
             $_POST['telephone_no'],
             $_POST['address_line1'],
             $_POST['city'],
             $_POST['postcode'],
             $_POST['country'],
             $_POST['opening_hours'],
             $_POST['data'],
             $_POST['profile_visible']) && 
       !empty(getallheaders()['X-Token']) &&
       !empty($_POST['title']) &&
       !empty($_POST['description']) &&
       !empty($_POST['categories']) &&
       !empty($_POST['telephone_no']) &&
       !empty($_POST['address_line1']) &&
       !empty($_POST['city']) &&
       !empty($_POST['postcode']) &&
       !empty($_POST['country']) &&
       !empty($_POST['opening_hours']) &&
       !empty($_POST['data']) &&
       !empty($_POST['profile_visible']) &&
       $uploadOk){

        $jwt = new JWTUtils();
        $file = new CheckFile();
        $insertRestaurant = new Restaurant();

        try{

            $token = getallheaders()['X-Token'];
            $user = $jwt -> isValid($token);

            $title = $_POST["title"];
            $description = $_POST["description"];
            $categories = $_POST["categories"];
            $link = $_POST["link"];
            $telephone_no = $_POST["telephone_no"];
            $address_line1 = $_POST["address_line1"];
            $city = $_POST["city"];
            $postcode = $_POST["postcode"];
            $county = $_POST["county"];
            $country = $_POST["country"];
            $opening_hours = $_POST["opening_hours"];
            $data = $_POST["data"];
            $profile_visible = $_POST["profile_visible"];
            if(isset($_POST["address_line2"])){
                $address_line2 = $_POST["address_line2"];
            }else{
                $address_line2 = '';
            }
            if(isset($_POST["address_line3"])){
                $address_line3 = $_POST["address_line3"];
            }else{
                $address_line3 = '';
            }
            if(isset($_POST["link"])){
                $link = $_POST["link"];
            }else{
                $link = '';
            }
            if(isset($_POST["mobile_no"])){
                $mobile_no = $_POST["mobile_no"];
            }else{
                $mobile_no = '';
            }
            if(isset($_POST["discount"])){
                $discount = $_POST["discount"];
            }else{
                $discount = '';
            }
            
            $logoDatabase = $file -> generateImage($logoFileType, 'logo', null);

            $galleryDatabase = [];

            if(isset($_FILES["gallery"]["name"])){
                $i = 0;
                foreach($_FILES["gallery"]["name"] as &$logoFile){
                    $logo = basename($logoFile);
                    $logoFileType = strtolower(pathinfo($logo, PATHINFO_EXTENSION));
                    $gallery = $file -> generateImage($logoFileType, 'gallery', $i);
                    array_push($galleryDatabase, $gallery);
                    $i ++;
                }
            }

            $insertRestaurant = $insertRestaurant -> restaurant_signup($user,
                                                                       $title, 
                                                                       $description,
                                                                       $categories, 
                                                                       $link, 
                                                                       $logoDatabase,
                                                                       $galleryDatabase, 
                                                                       $address_line1, 
                                                                       $address_line2, 
                                                                       $address_line3, 
                                                                       $city, 
                                                                       $postcode, 
                                                                       $county,
                                                                       $country,
                                                                       $telephone_no,
                                                                       $mobile_no,
                                                                       $opening_hours,
                                                                       $data,
                                                                       $profile_visible,
                                                                       $discount);
            if($insertRestaurant -> status != 200){
                unlink("../../../$logoDatabase");
                foreach($galleryDatabase as &$gallery){
                    unlink("../../../$gallery");
                }
                $response = new HttpStatusCode($insertRestaurant -> status);
                $response -> data = $insertRestaurant;
                print(json_encode($response));
            }else{
                $response = new HttpStatusCode(200);
                $response -> data = $insertRestaurant;
                print(json_encode($response));
            }

        } catch (Exception $e) {
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