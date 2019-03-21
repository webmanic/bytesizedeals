<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');

    class CheckBlog{

        function __construct(){

        }

        function listComment($restaurant_id, $pageNo){

            global $conn;

            $obj = new stdClass();

            $offset = 0;
            $page_result = 4; 
            $offset = $pageNo * $page_result;

            $query_blog = "SELECT SQL_CALC_FOUND_ROWS
                                  user.username, 
                                  blog.id,
                                  blog.user_id,
                                  blog.restaurant_id,
                                  blog.comment, 
                                  blog.datetime,
                                  blog.rate,
                                  blog.token
                           FROM blog
                           INNER JOIN user ON user.id = blog.user_id 
                           WHERE blog.restaurant_id = $restaurant_id
                           ORDER BY blog.datetime desc
                           LIMIT $offset , $page_result";

            $result_blog = $conn->query($query_blog);
            
            if ($result_blog->num_rows > 0) {

                $result_blog_count = $conn->query("Select FOUND_ROWS()"); 
                $result_blog_count = $result_blog_count->fetch_assoc()["FOUND_ROWS()"]; 

                $list_blog = [];

                while($row = $result_blog->fetch_assoc()) {
                    array_push($list_blog, $row);
                }

                $obj -> status = 200;
                $obj -> data = $list_blog;
                $obj -> rowNo = intval(ceil($result_blog_count / $page_result));
            }else{
                $obj -> status = 404;
                $obj -> message = "Not Found";
            }
            return $obj;
        }


        function getBlogComment($restaurant_id, $blog_id, $blog_user_id, $blog_token){
            global $conn;
            
            $obj = new stdClass();

            $query_blog = "SELECT blog.restaurant_id,
                                  blog.id, 
                                  blog.user_id,
                                  blog.token,
                                  blog.rate 
                            FROM  blog
                            WHERE blog.restaurant_id=$restaurant_id
                            AND blog.id=$blog_id 
                            AND blog.user_id=$blog_user_id
                            AND blog.token='$blog_token'";
            
            $result_blog = $conn->query($query_blog);

            if ($result_blog->num_rows > 0){
                $obj -> status = 200;
                $obj -> rate = $result_blog -> fetch_assoc()["rate"]; 
            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorised";
            }
            return $obj;
        }
    }

?>