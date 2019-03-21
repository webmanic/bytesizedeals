<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../service/email/contactus/index.php');
    require_once(dirname(__FILE__) . '/../../service/jwt/index.php');
 
    class ContactUs{

        function __construct(){

        }

        function submit($email, $subject, $message, $type){

            global $conn;

            $obj = new stdClass();
            $contactUsObj = new stdClass();
            $contactUsEmail = new ContactUsEmail();

            $sql = "INSERT INTO contact_us (email, subject, message, type)
                    VALUES ('$email', '$subject', '$message', '$type');";

            if ($conn->query($sql) === TRUE) {

                $contactUsObj -> email = $email;
                $contactUsObj -> subject = $subject;
                $contactUsObj -> message = $message;
                $contactUsObj -> type = $type;

                $contactUsEmail -> contactSubmit($contactUsObj);
                $contactUsEmail -> contactSubmitAdmin($contactUsObj);

                $obj -> status = 200;
                $obj -> message = "Successfully signed up";
            } else {
                $obj -> status = 500;
                //$obj -> message = "Error: " . $sql . "<br>" . $conn->error;
                $obj -> message = "Technical Error";
            }

            return $obj;
        }
    }
?>
