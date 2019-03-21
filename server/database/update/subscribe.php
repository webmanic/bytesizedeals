<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/password/index.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/token/index.php');
    require_once(dirname(__FILE__) . '/../../service/jwt/index.php');

    class UpdateSubscribe{

        function __construct(){

        }

        function emailSubscribe($token){

            global $conn;

            $obj = new stdClass();
            $tokenGenerate = new GenerateToken(150);
            $tokenGenerate = $tokenGenerate -> token;

            $query_subscribe = $conn->query("SELECT *
                                             FROM subscribe 
                                             WHERE token='$token' AND active=0");
        
            $active_subscribe = "UPDATE subscribe 
                                 SET active=1, token='$tokenGenerate'
                                 WHERE token='$token'";
            
            if ($query_subscribe->num_rows > 0) {
                if ($conn->query($active_subscribe) === TRUE) {
                    $obj -> status = 200;
                    $obj -> message = "Successfully updated";
                }else{
                    $obj -> status = 500;
                    $obj -> message = "Technical Error";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Already Subscribed";
            }
            return $obj;
        }

        function emailUnsubscribe($token){

            global $conn;

            $obj = new stdClass();
            $tokenGenerate = new GenerateToken(150);
            $tokenGenerate = $tokenGenerate -> token;

            $query_subscribe = $conn->query("SELECT *
                                             FROM subscribe 
                                             WHERE token='$token' AND active=1");
        
            $active_subscribe = "UPDATE subscribe 
                                 SET active=0, token='$tokenGenerate'
                                 WHERE token='$token'";
            
            if ($query_subscribe->num_rows > 0) {
                if ($conn->query($active_subscribe) === TRUE) {
                    $obj -> status = 200;
                    $obj -> message = "Successfully updated";
                }else{
                    $obj -> status = 401;
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