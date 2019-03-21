<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../server/utils/https/status/index.php');
    require(dirname(__FILE__) . '/../../server/database/select/subscribe.php');
    require(dirname(__FILE__) . '/../../server/database/insert/subscribe.php');
    require(dirname(__FILE__) . '/../../server/database/update/subscribe.php');
    require(dirname(__FILE__) . '/../../server/utils/validation/email/index.php');

    if(isset($_POST["email"]) && !empty($_POST["email"])){

        $email = $_POST["email"];

        $emailValid = new EmailValidation($email);
        $emailValid = $emailValid -> isEmailValid();

        if($emailValid -> valid == false){
            $response = new HttpStatusCode(400);
            $response -> data = $emailValid;
            print(json_encode($response));
        }else{

            $checkEmailSubscribe = new CheckSubscribe();
            $checkEmailSubscribe = $checkEmailSubscribe -> checkEmailExists($email);

            if($checkEmailSubscribe -> found){
                $updateSubscribe = new UpdateSubscribe();
                $updateSubscribe = $updateSubscribe -> emailSubscribe($checkEmailSubscribe -> token);
        
                if($updateSubscribe  -> status != 200){
                    $response = new HttpStatusCode($updateSubscribe -> status);
                    $response -> data = $updateSubscribe;
                    print(json_encode($response));
                }else{
                    $response = new HttpStatusCode(200);
                    $response -> data = $updateSubscribe;
                    print(json_encode($response));
                }
            }else{
                $insert = new Subscribe();
                $insert = $insert -> subscribeEmail($email);

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
        }
    }else{
        $response = new HttpStatusCode(400);
        $response -> data = $emailValid;
        print(json_encode($response));
    }
?>