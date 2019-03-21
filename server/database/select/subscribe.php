<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');

    class CheckSubscribe{

        function __construct(){

        }

        function checkEmailExists($email){

            global $conn;

            $obj = new stdClass();

            $sql = "SELECT * 
                    FROM subscribe 
                    WHERE email='$email' 
                    AND email='$email'";

            $result = $conn->query($sql);

            if ($result->num_rows > 0) {

                $token = "";

                while($row = $result->fetch_assoc()) {
                    $token = $row['token'];
                }

                $obj -> found = true;
                $obj -> token = $token;
            }else{
                $obj -> found = false;
            } 
            return $obj;
        }
    }

?>