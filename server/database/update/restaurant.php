<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/password/index.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/token/index.php');
    require_once(dirname(__FILE__) . '/../../service/jwt/index.php');
    require_once(dirname(__FILE__) . '/../../service/geocoding/index.php');
    require_once(dirname(__FILE__) . '/../../service/email/restaurant/index.php');
    require_once(dirname(__FILE__) . '/../../service/config/index.php');

    class UpdateRestaurant{

        function __construct(){

        }

        function activeRestaurant($user_id, $restaurant_id, $restaurant_user_id, $restaurant_token, $restaurant_active, $restaurant_extra_days, $active){

            global $conn, $YEAR_TO_EXTEND;

            $obj = new stdClass();

            $token = new GenerateToken(20);
            $token = $token -> token;

            $tokenPayment = new GenerateToken(20);
            $tokenPayment = $tokenPayment -> token;

            $emailRestaurant = new RestaurantEmail();

            $start_date = date('Y-m-d');
            $end_date = date('Y-m-d', strtotime($start_date . "+{$YEAR_TO_EXTEND} year"));

            $datediff = strtotime($end_date) - strtotime($start_date);
            $noDays = round($datediff / (60 * 60 * 24));
            $restaurant_extra_days = intval($restaurant_extra_days);
            if($noDays >= 0 && $restaurant_active == 2){
                $noDays += 1;
                $end_date = date('Y-m-d', strtotime($end_date . "+{$restaurant_extra_days} days"));
            }

            $query_role = $conn->query("SELECT user_id, role_id 
                                        FROM user_role 
                                        WHERE user_id=$user_id AND role_id=1");

            $query_restaurant = $conn->query("SELECT user.*,
                                                     restaurant.*,
                                                     restaurant_invoice.*,
                                                     personal.*
                                              FROM restaurant
                                              INNER JOIN restaurant_invoice ON restaurant_invoice.restaurant_id = restaurant.id
                                              INNER JOIN user ON user.id = restaurant.user_id
                                              INNER JOIN personal ON personal.user_id = restaurant.user_id
                                              WHERE restaurant.id=$restaurant_id 
                                              AND restaurant.user_id=$restaurant_user_id 
                                              AND restaurant.token='$restaurant_token'");

            $active_restaurant = "UPDATE restaurant 
                                  SET active = $active, 
                                      token = '$token',
                                      start_date = '$start_date',
                                      end_date = '$end_date',
                                      extra_days = 0
                                  WHERE id=$restaurant_id";
            

            $update_payment = "UPDATE restaurant_invoice 
                              SET start_date = '$start_date',
                                  end_date = '$end_date',
                                  paid = 1,
                                  token = '$tokenPayment'
                              WHERE restaurant_id=$restaurant_id";
            
            if ($query_role->num_rows > 0) {

                if ($query_restaurant->num_rows > 0) {

                    if ($conn->query($active_restaurant) === TRUE) {

                        $emailDetail = new stdClass();

                        while($row = $query_restaurant->fetch_assoc()){
                            $emailDetail -> email = $row['email'];
                            $emailDetail -> username = $row['username'];
                            $emailDetail -> firstname = ucfirst($row['firstname']);
                            $emailDetail -> lastname = ucfirst($row['lastname']);
                            $emailDetail -> restaurant_title = ucfirst($row['title']);;
                            $emailDetail -> active = $active;
                            $emailDetail -> data = $row['data'];
                            $emailDetail -> start_date = date('d/m/Y');
                            $emailDetail -> end_date = date('d/m/Y', strtotime('+1 years'));
                            $emailDetail -> restaurant_active = $restaurant_active;
                        }

                        if($active != 1){
                            $emailRestaurant -> restaurantConfirmApproval($emailDetail);
                            $obj -> status = 200;
                            $obj -> message = "Successfully updated";
                        }else{
                            if ($conn->query($update_payment) === TRUE) {
                                $emailRestaurant -> restaurantConfirmApproval($emailDetail);
                                $obj -> status = 200;
                                $obj -> message = "Successfully updated";
                            }else{
                                $obj -> status = 500;
                                $obj -> message = "Technical Error";
                            }
                        }
                    }else{
                        $obj -> status = 401;
                        $obj -> message = "Unauthorised";
                    }
                }else{
                    $obj -> status = 401;
                    $obj -> message = "Not Found";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorised";
            }

            return $obj;
        }


        function renewRestaurant($user_id, $restaurant_id, $restaurant_token, $data, $extra_days){

            global $conn, $YEAR_TO_EXTEND;
            
            $obj = new stdClass();

            $token = new GenerateToken(20);
            $token = $token -> token;

            $tokenPayment = new GenerateToken(20);
            $tokenPayment = $tokenPayment -> token;

            $emailRestaurant = new RestaurantEmail();

            $dataJSON = json_decode($data);
            $payment_id = $dataJSON->transactions[0]->related_resources[0]->sale->id;
            $amount_breakdown = json_encode($dataJSON->transactions[0]->amount);
            $amount = $dataJSON->transactions[0]->amount->total;
            $currency = $dataJSON->transactions[0]->amount->currency;
            $type = $dataJSON->type;
            $active = 1;

            $paid = 1;
            if($type == "cash"){
                $paid = 0;
                $active = 2;
            }

            $startDate = date('Y-m-d');
            $endDate = date('Y-m-d', strtotime($startDate . "+{$YEAR_TO_EXTEND} year"));
            $noDays = 0;

            $query_restaurant = $conn->query("SELECT user.*,
                                                     restaurant.*,
                                                     personal.*
                                              FROM restaurant
                                              INNER JOIN user ON user.id = restaurant.user_id
                                              INNER JOIN personal ON personal.user_id = restaurant.user_id
                                              WHERE restaurant.id=$restaurant_id 
                                              AND restaurant.user_id=$user_id 
                                              AND restaurant.token='$restaurant_token'");

            if($active == 1){
                $renew_restaurant = "UPDATE restaurant 
                                    SET token = '$token',
                                        start_date = '$startDate',
                                        end_date = '$endDate',
                                        active = 1
                                    WHERE id=$restaurant_id";
            }else if($active == 2){
                $renew_restaurant = "UPDATE restaurant 
                                    SET token = '$token',
                                        extra_days = $extra_days,
                                        active = 2
                                    WHERE id=$restaurant_id";
            }

            $insert_restaurant_invoice = "INSERT INTO restaurant_invoice(payment_id, data, amount_breakdown, amount, currency, type, paid, restaurant_id, user_id, start_date, end_date, token)
                                          VALUES ('$payment_id','$data', '$amount_breakdown', $amount, '$currency', '$type', $paid, $restaurant_id, $user_id, '$startDate', '$endDate', '$tokenPayment')";

            if ($query_restaurant->num_rows > 0) {

                while($row = $query_restaurant->fetch_assoc()){
                    $end_date = strtotime($row['end_date']);
                    $datediff = $end_date - strtotime($startDate) ;
                    $noDays = round($datediff / (60 * 60 * 24));
                    if($noDays >= 0){
                        $noDays += 1;
                        $endDate = date('Y-m-d', strtotime($endDate . "+$noDays days"));
                        if($active == 1){
                            $renew_restaurant = "UPDATE restaurant 
                                                SET token = '$token',
                                                    start_date = '$startDate',
                                                    end_date = '$endDate',
                                                    active = $active,
                                                WHERE id=$restaurant_id";
                        }else if($active == 2){
                            $renew_restaurant = "UPDATE restaurant 
                                                SET token = '$token',
                                                    active = 2,
                                                    extra_days = $extra_days
                                                WHERE id=$restaurant_id";
                        }
                        $insert_restaurant_invoice = "INSERT INTO restaurant_invoice(payment_id, data, amount_breakdown, amount, currency, type, paid, restaurant_id, user_id, start_date, end_date, token)
                                                      VALUES ('$payment_id','$data', '$amount_breakdown', $amount, '$currency', '$type', $paid, $restaurant_id, $user_id, '$startDate', '$endDate', '$tokenPayment')";
                    }
                }

                if ($conn->multi_query($insert_restaurant_invoice) === TRUE) {

                    if ($conn->query($renew_restaurant) === TRUE) {

                        $emailDetail = new stdClass();

                        mysqli_data_seek($query_restaurant, 0);
                        while($row = $query_restaurant->fetch_assoc()){
                            $emailDetail -> email = $row['email'];
                            $emailDetail -> username = $row['username'];
                            $emailDetail -> firstname = ucfirst($row['firstname']);
                            $emailDetail -> lastname = ucfirst($row['lastname']);
                            $emailDetail -> restaurant_title = ucfirst($row['title']);;
                            $emailDetail -> data = $data;
                            $emailDetail -> start_date = date("d/m/Y", strtotime($startDate));
                            $emailDetail -> end_date = date("d/m/Y", strtotime($endDate));
                            $emailDetail -> no_days = $noDays;
                            $emailDetail -> active = $active;

                        }

                        $emailRestaurant -> restaurantRenew($emailDetail);
                        $emailRestaurant -> restaurantRenewAdmin($emailDetail);

                        $obj -> status = 200;
                        $obj -> message = "Successfully updated";
                        $obj -> start_date = date("d/m/Y", strtotime($startDate));
                        $obj -> end_date = date("d/m/Y", strtotime($endDate));
                        $obj -> token = $token;
                    }else{
                        $obj -> status = 401;
                        $obj -> message = "Unauthorised";
                    }
                }else{
                    $obj -> status = 500;
                    $obj -> message = "Technical Error";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Not Found";
            }

            return $obj;
        }

        function updateRestaurant($user, $restaurant_id, $restaurant_token, $title, $description, $categories, $link, $logoDatabase, $galleryDatabase, $address_line1, $address_line2, $address_line3, $city, $postcode, $county, $country, $telephone_no, $mobile_no, $opening_hours, $profile_visible, $discount){
            
            global $conn;

            $obj = new stdClass();
            $geoCoding = new GeoCoding();
            $token = new GenerateToken(20);
            $token = $token -> token;

            $user_id = $user -> user_id;

            $galleryDatabase = join(',', $galleryDatabase);
            $addressObj = new stdClass();
            $addressObj -> address_line1 = $address_line1;
            $addressObj -> address_line2 = $address_line2; 
            $addressObj -> address_line3 = $address_line3;
            $addressObj -> city = $city;
            $addressObj -> post_code = $postcode;
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
            $visible = $profile_visible == 'true' ? 1 : 0;

            $query_restaurant = $conn->query("SELECT * 
                                              FROM restaurant 
                                              WHERE id=$restaurant_id 
                                              AND user_id=$user_id 
                                              AND token='$restaurant_token' 
                                              AND active=1 OR active=2
                                              AND CURDATE() between restaurant.start_date AND restaurant.end_date");
        
            $update_restaurant = "UPDATE restaurant, restaurant_address
                                  SET restaurant.title='$title', 
                                      restaurant.description='$description', 
                                      restaurant.link='$link',
                                      restaurant.logo='$logoDatabase',
                                      restaurant.gallery='$galleryDatabase',
                                      restaurant.token='$token',
                                      restaurant.telephone_no='$telephone_no',
                                      restaurant.mobile_no='$mobile_no',
                                      restaurant.categories='$categories',
                                      restaurant.opening_hours='$opening_hours',
                                      restaurant.visible=$visible,
                                      restaurant.discount='$discount',
                                      restaurant_address.address_line1='$address_line1',
                                      restaurant_address.address_line2='$address_line2',
                                      restaurant_address.address_line3='$address_line3',
                                      restaurant_address.city='$city',
                                      restaurant_address.post_code='$postcode',
                                      restaurant_address.county='$county',
                                      restaurant_address.country='$country',
                                      restaurant_address.longitude=$longitude,
                                      restaurant_address.latitude=$latitude
                                  WHERE restaurant.id=$restaurant_id 
                                  AND restaurant_address.restaurant_id=$restaurant_id";

            if ($query_restaurant->num_rows > 0){
                if ($conn->query($update_restaurant) === TRUE) {
                    while($row = $query_restaurant->fetch_assoc()) {
                        $logo = $row['logo'];
                        if(file_exists("../../..$logo")){
                            unlink("../../..$logo");
                        }
                        $galleries = explode(',' , $row['gallery']);
                        foreach($galleries as &$gallery){
                            if($gallery && file_exists("../../..$gallery")){
                                unlink("../../..$gallery");
                            }
                        }
                    }
                    $obj -> status = 200;
                    $obj -> message = "Successfully updated";
                    $obj -> token = $token;
                }else{
                    $obj -> status = 500;
                    $obj -> message = "Technical Error";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorised";
            }
            return $obj;
        }

        function updateRestaurantReview($restaurant_id, $rate){

            global $conn;

            $obj = new stdClass();

            $update_restaurant = "UPDATE restaurant
                                  SET restaurant.review = restaurant.review + 1,
                                      restaurant.rate = restaurant.rate + $rate
                                  WHERE restaurant.id=$restaurant_id";

            if ($conn->query($update_restaurant) === TRUE) {
                $obj -> status = 200;
                $obj -> message = "Successfully updated";
            }else{
                $obj -> status = 500;
                $obj -> message = "Technical Error";
            }
 
            return $obj;
        }

        function updateDeletedRestaurantReview($restaurant_id, $rate){

            global $conn;

            $obj = new stdClass();

            $update_restaurant = "UPDATE restaurant
                                  SET restaurant.review = restaurant.review - 1,
                                      restaurant.rate = restaurant.rate - $rate
                                  WHERE restaurant.id=$restaurant_id";

            if ($conn->query($update_restaurant) === TRUE) {
                $obj -> status = 200;
                $obj -> message = "Successfully updated";
            }else{
                $obj -> status = 500;
                $obj -> message = "Technical Error";
            }
 
            return $obj;
        }
    }

?>