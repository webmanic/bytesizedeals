<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../select/blog.php');
    require_once(dirname(__FILE__) . '/../update/restaurant.php');

    class DeleteBlog{

        function __construct(){

        }

        function blog_comment_delete($user, $restaurant_id, $blog_id, $blog_user_id, $blog_token){

            global $conn;
            
            $obj = new stdClass();
            
            $checkBlogComment = new CheckBlog();
            $checkBlogComment = $checkBlogComment -> getBlogComment($restaurant_id, $blog_id, $blog_user_id, $blog_token);

            $query_delete_blog_comment = "DELETE FROM blog 
                                          WHERE restaurant_id=$restaurant_id
                                          AND id=$blog_id
                                          AND user_id=$blog_user_id
                                          AND token='$blog_token'";

            if($checkBlogComment -> status == 200){

                $rate = $checkBlogComment -> rate;

                if ($conn->query($query_delete_blog_comment) === TRUE) {

                    $updateDeletedRestaurantReview = new UpdateRestaurant();
                    $updateDeletedRestaurantReview = $updateDeletedRestaurantReview -> updateDeletedRestaurantReview($restaurant_id, $rate); 
                    if($updateDeletedRestaurantReview -> status == 200){
                        $obj -> message = "Successfully Deleted";
                        $obj -> status = 200;
                    }else{
                        $obj -> status = 500;
                        $obj -> message = "Technical Error";
                    }
                } else {
                    $obj -> status = 500;
                    //$obj -> message = "Error: " . $sql . "<br>" . $conn->error;
                    $obj -> message = "Technical Errors";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorised";
            }
            return $obj;
        }
    }

?>