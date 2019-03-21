<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../server/utils/https/status/index.php');
    require(dirname(__FILE__) . '/../../server/database/insert/contactus.php');
    require(dirname(__FILE__) . '/../../server/utils/validation/email/index.php');

    if(isset($_POST["email"],
             $_POST["subject"], 
             $_POST["message"],
             $_POST["type"]) && 
      (!empty($_POST["email"]) && 
       !empty($_POST["subject"]) && 
       !empty($_POST["message"]) && 
       !empty($_POST["type"])))
    {
        $email = $_POST["email"];
        $subject = $_POST["subject"];
        $message = $_POST["message"];
        $type = $_POST["type"];

        $emailValid = new EmailValidation($email);
        $emailValid = $emailValid -> isEmailValid();

        if($emailValid -> valid == false){
            $response = new HttpStatusCode(400);
            $response -> data = $emailValid;
            print(json_encode($response));
        }
        else{
            $insert = new ContactUs();
            $insert = $insert -> submit($email, $subject, $message, $type);
            
            if($insert -> status != 200){
                $response = new HttpStatusCode($insert -> status);
                $response -> data = $insert;
                print(json_encode($response));
            }else{
                $response = new HttpStatusCode(200);
                $response -> data = $insert;
                print(json_encode($response));
            }
        }
    }else{
        $response = new HttpStatusCode(400);
        $response -> data -> message = "Input Fields are required";
        print(json_encode($response));
    }
?>