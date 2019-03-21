<?php
    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/token/index.php');
    require_once(dirname(__FILE__) . '/../select/restaurant.php');
    require_once(dirname(__FILE__) . '/../update/restaurant.php');

    class Blog{

        function __construct(){

        }

        function blog_comment($user, $restaurant_id, $comment, $rate){

            global $conn;
            
            $obj = new stdClass();

            $token = new GenerateToken(20);
            $token = $token -> token;
            $user_id = $user -> user_id;

            $reviewRestaurant = new UpdateRestaurant();

            if($rate < 0){
                $rate = 1;
            }else if($rate > 6){
                $rate = 5;
            }

            $query_role = "SELECT user_role.user_id, 
                                  user_role.role_id,
                                  restaurant.active 
                           FROM user_role,
                                restaurant 
                           WHERE user_role.user_id=$user_id 
                           AND user_role.role_id=3
                           AND restaurant.active=1";
            $result_role = $conn->query($query_role);
            
            $query_blog = "INSERT INTO blog (comment, rate, user_id, restaurant_id, token)
                           VALUES ('$comment', $rate, $user_id, $restaurant_id, '$token')";

            if ($result_role->num_rows > 0){
                if ($conn->multi_query($query_blog) === TRUE) {
                    $reviewRestaurant = $reviewRestaurant -> updateRestaurantReview($restaurant_id, $rate);
                    if($reviewRestaurant -> status != 200){
                        $obj -> status = 500;
                        $obj -> message = "Technical Error";
                    }else{
                        $obj -> status = 200;
                        $obj -> message = "Successfully Reviewed";
                    }
                } else {
                    $obj -> status = 500;
                    //$obj -> message = "Error: " . $sql . "<br>" . $conn->error;
                    $obj -> message = "Technical Error";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorised";
            }
            return $obj;
        }

    }

?>