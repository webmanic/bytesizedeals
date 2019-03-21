<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/password/index.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/token/index.php');
    require_once(dirname(__FILE__) . '/../../service/jwt/index.php');
    require_once(dirname(__FILE__) . '/../select/user.php');

    class UpdateUser{

        function __construct(){

        }

        function activeUser($user_id, $token){

            global $conn;
            
            $obj = new stdClass();

            $query_user = $conn->query("SELECT * 
                                        FROM user 
                                        WHERE id=$user_id AND token='$token'");

            $token = new GenerateToken(20);

            $token = $token -> token;
            
            $active_user = "UPDATE user 
                            SET active=1
                            WHERE id=$user_id";

            if ($query_user->num_rows > 0) {
                $active = $query_user->fetch_assoc()['active'];
                if(!$active){
                    if ($conn->query($active_user) === TRUE) {
                        $obj -> status = 200;
                        $obj -> message = "Successfully Activated";
                    }else{
                        $obj -> status = 401;
                        $obj -> message = "Technical Error";
                    }
                }
                else{
                    $obj -> status = 409;
                    $obj -> message = "Already Activated";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorised";
            }
            return $obj;
        }

        function resetPassword($user, $password){

            global $conn;
            
            $obj = new stdClass();
            $jwt = new JWTUtils();

            $token = new GenerateToken(20);

            $reset = new CheckUser();
            $reset = $reset -> resetValid($user);

            $user_token = $user -> token;
            $password = new PasswordHash($password);
            $password = $password -> password;

            $token = $token -> token;

            if ($reset -> status == 200) {

                $reset_password = "UPDATE user 
                                   SET password='$password', token='$token'
                                   WHERE token='$user_token'";

                if ($conn->query($reset_password) === TRUE) {
                    $reset = new CheckUser();
                    $reset = $reset -> checkLoginReset($user, $token);
                    if($reset -> status == 200){
                        $obj -> status = 200;
                        $obj -> message = "Successfully Password Reset";
                        $obj -> token = $reset -> token;
                    }else{
                        $obj -> status = $reset -> status;
                        $obj -> message = $reset -> message;
                    }
                }else{
                    $obj -> status = 404;
                    $obj -> message = "Not Found";
                }
            }else{
                $obj -> status = $reset -> status;
                $obj -> message = $reset -> message;
            } 

            return $obj;
        }
    }

?>