<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/token/index.php');
    require_once(dirname(__FILE__) . '/../select/restaurant.php');

    class Subscribe{

        function __construct(){

        }

        function subscribeEmail($email){

            global $conn;
            
            $obj = new stdClass();

            $token = new GenerateToken(150);
            $token = $token -> token;

            $query_subscribe = "INSERT subscribe (email, token)
                           VALUES ('$email', '$token')";

            if ($conn->multi_query($query_subscribe) === TRUE) {
                $obj -> status = 200;
                $obj -> message = "Successfully Subscribed";
            } else {
                $obj -> status = 404;
                //$obj -> message = "Error: " . $sql . "<br>" . $conn->error;
                $obj -> message = "Not Found";
            }

            return $obj;
        }
    }
?>