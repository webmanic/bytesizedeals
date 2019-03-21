<?php
    
    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/token/index.php');
    require_once(dirname(__FILE__) . '/../select/restaurant.php');
    require_once(dirname(__FILE__) . '/../../service/email/restaurant/index.php');
    require_once(dirname(__FILE__) . '/../../service/geocoding/index.php');

    class Restaurant{

        function __construct(){

        }

        function restaurant_signup($user,
                                   $title, 
                                   $description, 
                                   $categories,
                                   $link, 
                                   $logo,
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
                                   $discount){
        
            global $conn;

            $obj = new stdClass();
            $geoCoding = new GeoCoding();
            $token = new GenerateToken(20);
            $token = $token -> token;
            $tokenPayment = new GenerateToken(20);
            $tokenPayment = $tokenPayment -> token;

            $user_id = $user -> user_id;

            $galleryDatabase = join(',', $galleryDatabase);
            $addressObj = new stdClass();
            $addressObj -> address_line1 = $address_line1;
            $addressObj -> address_line2 = $address_line2; 
            $addressObj -> address_line3 = $address_line3;
            $addressObj -> city = $city;
            $addressObj -> postcode = $postcode;
            $addressObj -> county = $county;
            $addressObj -> country = $country;     
            $addressArray = $geoCoding -> getAddressArray($addressObj);
            $fullAddress = join(" ", $addressArray);
            $geoCoding = $geoCoding -> getCoordinates($fullAddress);
            
            if($geoCoding['status'] ==  'OK'){
                $latitude = $geoCoding['results'][0]['geometry']['location']['lat'];
                $longitude = $geoCoding['results'][0]['geometry']['location']['lng'];
            }else{
                $latitude = 0;
                $longitude = 0;
            }
            
            $dataJSON = json_decode($data);
            $payment_id = $dataJSON->transactions[0]->related_resources[0]->sale->id;
            $amount_breakdown = json_encode($dataJSON->transactions[0]->amount);
            $amount = $dataJSON->transactions[0]->amount->total;
            $currency = $dataJSON->transactions[0]->amount->currency;
            $paymentType = strtolower($dataJSON->type);
            $paid = 1;
            if($paymentType == 'cash'){
                $paid = 0;
            }
            
            $visible = $profile_visible == 'true' ? 1 : 0;
            $checkRestaurant = new CheckRestaurant();
            $checkRestaurant = $checkRestaurant -> checkRestaurant($user);

            $emailRestaurant = new RestaurantEmail();
            
            $query_user = $conn->query("SELECT user.*, 
                                               personal.*, 
                                               user_role.user_id, 
                                               user_role.role_id 
                                        FROM user_role 
                                        INNER JOIN user ON user.id = user_role.user_id 
                                        INNER JOIN personal ON personal.user_id = user_role.user_id 
                                        WHERE user_role.user_id=$user_id 
                                        AND user_role.role_id=2");
        
            $query_restaurant = "INSERT INTO restaurant (title, description, categories, opening_hours, link, telephone_no, mobile_no, logo, gallery, user_id, token, visible, discount)
                                 VALUES ('$title', '$description', '$categories', '$opening_hours', '$link', '$telephone_no', '$mobile_no', '$logo', '$galleryDatabase', $user_id, '$token', $visible, '$discount');
                                 SET @last_id_in_restaurant = LAST_INSERT_ID();
                                 INSERT INTO restaurant_address (address_line1, address_line2, address_line3, city, county, post_code, country, longitude, latitude, restaurant_id)
                                 VALUES ('$address_line1', '$address_line2', '$address_line3', '$city', '$county', '$postcode', '$country', $longitude, $latitude, @last_id_in_restaurant);
                                 INSERT INTO restaurant_invoice(payment_id, data, amount_breakdown, amount, currency, type, paid, restaurant_id, user_id, token)
                                 VALUES ('$payment_id','$data', '$amount_breakdown', $amount, '$currency', '$paymentType', $paid, @last_id_in_restaurant, $user_id, '$tokenPayment');";

            //if(true){
            if($checkRestaurant -> status == 200){

                if ($query_user->num_rows > 0) {

                    $emailDetail = new stdClass();

                    while($row = $query_user->fetch_assoc()){
                        $emailDetail -> email = $row['email'];
                        $emailDetail -> username = $row['username'];
                        $emailDetail -> firstname = ucfirst($row['firstname']);
                        $emailDetail -> lastname = ucfirst($row['lastname']);
                        $emailDetail -> restaurant_title = $title;
                        $emailDetail -> restaurant_logo = $logo;
                        $emailDetail -> data = $data;
                    }

                    if ($conn->multi_query($query_restaurant) === TRUE) {

                        $emailRestaurant -> restaurantSignupUser($emailDetail);
                        $emailRestaurant -> restaurantSignupAdmin($emailDetail);

                        $obj -> status = 200;
                        $obj -> message = "Successfully signed up";
                    } else {
                        $obj -> status = 500;
                        //$obj -> message = "Error: " . $sql . "<br>" . $conn->error;
                        $obj -> message = "Technical Error";
                    }
                }else{
                    $obj -> status = 401;
                    $obj -> message = "Unauthorised";
                }
            }else{
                $obj -> status = $checkRestaurant -> status;
                $obj -> message = $checkRestaurant -> message;
            }
            return $obj;
        }

    }
?>