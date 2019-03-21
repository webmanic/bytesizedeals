<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');

    class UpdatePurchase{

        function __construct(){

        }

        function paid($user, $id, $payment_id, $payment_token, $paid){

            global $conn;

            $obj = new stdClass();

            $user_id = $user -> user_id;

            $paid = "UPDATE restaurant_invoice 
                     SET paid=$paid
                     WHERE token='$payment_token'";
            
            if ($conn->query($paid) === TRUE) {
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