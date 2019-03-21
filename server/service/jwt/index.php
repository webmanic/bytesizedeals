<?php

    require_once(dirname(__FILE__) . '/../config/index.php');
    require_once(dirname(__FILE__) . '/../../../vendor/autoload.php');
    require_once(dirname(__FILE__) . '/../../utils/datetime/datetime.php');

    use \Firebase\JWT\JWT;
    
    class JWTUtils{

        function generateToken($list_user){

            global $JWTKey;

            $date = new DateTimeUtils();

            $unix = $date->getUnixTime();
            $unixExpiry = $date->getExpiryUnixTime(60);

            $user_id = intval($list_user['id']);
            $role = explode(",", $list_user['role']);
            
            $token = array(
                "iss" => "http://bytesizedeals.co.uk/",
                "aud" => "http://bytesizedeals.co.uk/",
                "iat" => $unix,
                "nbf" => $unix,
                //"exp" => $unixExpiry,
                "user_id" => $user_id,
                "role" => $role
            );

            $jwt = JWT::encode($token, $JWTKey);

            return $jwt;
        }

        function generateActivateToken($list_signup){

            global $JWTKey;

            $date = new DateTimeUtils();

            $unix = $date->getUnixTime();
            $unixExpiry = $date->getExpiryUnixTime(60);

            
            $token = array(
                "iss" => "http://bytesizedeals.co.uk/",
                "aud" => "http://bytesizedeals.co.uk/",
                "iat" => $unix,
                "nbf" => $unix,
                "user_id" => $list_signup -> user_id,
                "token" => $list_signup -> token
            );

            $jwt = JWT::encode($token, $JWTKey);

            return $jwt;
        }

        function generateResetPasswordToken($list_user){

            global $JWTKey;

            $date = new DateTimeUtils();

            $unix = $date->getUnixTime();
            $unixExpiry = $date->getExpiryUnixTime(60 * 24);

            $user_id = intval($list_user['id']);
            $token = $list_user['token'];
            
            $token = array(
                "iss" => "http://bytesizedeals.co.uk/",
                "aud" => "http://bytesizedeals.co.uk/",
                "iat" => $unix,
                "nbf" => $unix,
                "exp" => $unixExpiry,
                "user_id" => $user_id,
                "token" => $token,
                "reset" => true
            );

            $jwt = JWT::encode($token, $JWTKey);

            return $jwt;
        }

        function isValid($token){

            global $JWTKey;
            
            $jwt = JWT::decode($token, $JWTKey, array('HS256'));

            return  $jwt;
        }
    }
?>