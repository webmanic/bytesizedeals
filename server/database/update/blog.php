<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../select/blog.php');

    class UpdateBlog{

        function __construct(){

        }

        function blog_comment_flag($user, $restaurant_id, $blog_id, $blog_user_id, $blog_token){

            global $conn;
            
            $obj = new stdClass();
            
            $checkBlogComment = new CheckBlog();
            $checkBlogComment = $checkBlogComment -> getBlogComment($restaurant_id, $blog_id, $blog_user_id, $blog_token);

            $query_updare_blog_flag = "UPDATE blog 
                                       SET flag = flag + 1
                                       WHERE restaurant_id=$restaurant_id
                                       AND id=$blog_id
                                       AND user_id=$blog_user_id
                                       AND token='$blog_token'";

            if($checkBlogComment -> status == 200){

                if ($conn->query($query_updare_blog_flag) === TRUE) {

                    $obj -> message = "Successfully Updated";
                    $obj -> status = 200;
             
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