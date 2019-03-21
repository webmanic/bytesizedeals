<?php

    header('Content-type: application/json');

    require(dirname(__FILE__) . '/../../server/utils/https/status/index.php');
    require(dirname(__FILE__) . '/../../server/database/select/user.php');
    require(dirname(__FILE__) . '/../../server/database/insert/signup.php');
    require(dirname(__FILE__) . '/../../server/utils/validation/email/index.php');

    if(isset($_POST["email"],
             $_POST["username"], 
             $_POST["password"],
             $_POST["firstname"],
             $_POST["lastname"],
             $_POST["type"]) && 
      (!empty($_POST["email"]) && 
       !empty($_POST["username"]) && 
       !empty($_POST["password"]) && 
       !empty($_POST["firstname"]) &&
       !empty($_POST["lastname"]) &&
       !empty($_POST["type"])))
    {
        $email = $_POST["email"];
        $username = $_POST["username"];
        $password = $_POST["password"];
        $firstname = $_POST["firstname"];
        $lastname = $_POST["lastname"];
        $type = $_POST["type"];
        $roleId = $type == 'restaurant' ? 2 : 3;

        $emailValid = new EmailValidation($email);
        $emailValid = $emailValid -> isEmailValid();

        if($emailValid -> valid == false){
            $response = new HttpStatusCode(400);
            $response -> data = $emailValid;
            print(json_encode($response));
        }
        else{
            $emailUsernameExists = new CheckUser();
            $emailUsernameExists -> checkUsernameExists($username);
            $emailUsernameExists -> checkEmailExists($email);
            $emailUsernameExists = $emailUsernameExists -> getResponseUsernameOrEmailExist();

            if($emailUsernameExists -> found){
                $response = new HttpStatusCode(409);
                $response -> data = $emailUsernameExists;
                print(json_encode($response));
            }else{
                
                $insert = new Signup();
                $insert = $insert -> signup($username, $email, $password, $firstname, $lastname, $roleId);
               
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
        $response -> data -> message = "Input Fields are required";
        print(json_encode($response));
    }
?>