<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/token/index.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/password/index.php');
    require_once(dirname(__FILE__) . '/../../service/email/signup/index.php');
    require_once(dirname(__FILE__) . '/../../service/jwt/index.php');
 
    class Signup{

        function __construct(){

        }

        function signup($username, $email, $password, $firstname, $lastname, $roleId){

            global $conn;

            $obj = new stdClass();
            $signupObj = new stdClass();
            $signup = new SignupEmail();
            $token = new GenerateToken(20);
            $password = new PasswordHash($password);
            $jwt = new JWTUtils();
            $token = $token -> token;
            $password = $password -> password;

            $email = mysqli_real_escape_string($conn, $email);
            $username = mysqli_real_escape_string($conn, $username);
            $password = mysqli_real_escape_string($conn, $password);
            $firstname = mysqli_real_escape_string($conn, $firstname);
            $lastname = mysqli_real_escape_string($conn, $lastname);

            $sql = "INSERT INTO user (username, email, password, token)
                    VALUES ('$username', '$email', '$password', '$token');
                    SET @last_id_in_user = LAST_INSERT_ID();
                    INSERT INTO user_role (user_id, role_id)
                    VALUES (@last_id_in_user, $roleId);
                    INSERT INTO personal (firstname, lastname, user_id)
                    VALUES ('$firstname', '$lastname', @last_id_in_user);";

            if ($conn->multi_query($sql) === TRUE) {
                $signupObj -> username = $username;
                $signupObj -> email = $email;
                $signupObj -> password = $password;
                $signupObj -> firstname = ucfirst($firstname);
                $signupObj -> lastname = ucfirst($lastname);
                $signupObj -> token = $token;
                $signupObj -> user_id = $conn->insert_id;
                $jwt = $jwt -> generateActivateToken($signupObj);
                $signup -> signupUser($signupObj, $jwt);
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
