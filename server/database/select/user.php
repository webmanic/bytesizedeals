<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');
    require_once(dirname(__FILE__) . '/../../utils/decrypt/password/index.php');
    require_once(dirname(__FILE__) . '/../../service/jwt/index.php');
    require_once(dirname(__FILE__) . '/../../service/email/password/index.php');

    class CheckUser{

        private $found = false;
        private $list = [];

        function __construct(){
        }

        function checkUsernameExists($username){

            global $conn;

            $obj = new stdClass();

            $username = mysqli_real_escape_string($conn, $username);

            $sql = "SELECT username 
                    FROM user 
                    WHERE username='$username' 
                    AND username='$username'";

            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $this -> found = true;
                $this -> list['username'] = $username;
            } 
        }

        function checkEmailExists($email){

            global $conn;

            $obj = new stdClass();

            $email = mysqli_real_escape_string($conn, $email);

            $sql = "SELECT email 
                    FROM user 
                    WHERE email='$email' 
                    AND email='$email'";

            $result = $conn->query($sql);

            if ($result->num_rows > 0) {
                $this -> found = true;
                $this -> list['email'] = $email;
            } 
        }

        function getResponseUsernameOrEmailExist(){

            global $found, $list;

            $obj = new stdClass();
            
            if($found){
                $obj -> message = "Already Exists";
            }

            $obj -> found = $this -> found;
            $obj -> list = $this -> list;

            return $obj;
        }

        function checkLogin($email, $username, $password){

            global $conn;

            $obj = new stdClass();
            $jwt = new JWTUtils();

            $email = mysqli_real_escape_string($conn, $email);
            $username = mysqli_real_escape_string($conn, $username);
            $password = mysqli_real_escape_string($conn, $password);

            $query_user = "SELECT user.id,
                             user.username,
                             user.password,
                             GROUP_CONCAT(user_role.role_id SEPARATOR ',') AS role_id,
                             GROUP_CONCAT(role.role SEPARATOR ',') AS role
                             FROM user 
                             INNER JOIN user_role ON user.id = user_role.user_id 
                             INNER JOIN role ON role.id = user_role.role_id 
                             WHERE ((user.username='$username' AND user.username='$username') 
                             OR  (user.email='$email' AND user.email='$email')) 
                             AND user.active=1";

            $query_user = $conn->query($query_user);

            if ($query_user->num_rows > 0) {
                
                $list_user = [];
                
                while($row = $query_user->fetch_assoc()) {
                    array_push($list_user, $row);
                }

                $list_user = $list_user[0];

                $passwordHashed = $list_user['password']; 
            
                if(password_verify($password, $passwordHashed)) {
                    $obj -> status = 200;
                    $obj -> message = "Login Successfully";
                    $obj -> token = $jwt -> generateToken($list_user);

                }else{
                    $obj -> status = 401;
                    $obj -> message = "Incorrect Login";
                }
            }else{
                $obj -> status = 401;
                $obj -> message = "Incorrect Login";

            } 
            return $obj;
        }


        function checkLoginReset($user, $token){
            
            global $conn;

            $obj = new stdClass();
            $jwt = new JWTUtils();

            $user_id = $user -> user_id;

            $query_user = "SELECT user.id,
                             user.username,
                             user.password,
                             GROUP_CONCAT(user_role.role_id SEPARATOR ',') AS role_id,
                             GROUP_CONCAT(role.role SEPARATOR ',') AS role
                             FROM user 
                             INNER JOIN user_role ON user.id = user_role.user_id 
                             INNER JOIN role ON role.id = user_role.role_id 
                             WHERE (user.id=$user_id AND user.id=$user_id) 
                             AND  (user.token='$token' AND user.token='$token') 
                             AND user.active=1";

            $query_user = $conn->query($query_user);

            if ($query_user->num_rows > 0) {
                
                $list_user = [];
                
                while($row = $query_user->fetch_assoc()) {
                    array_push($list_user, $row);
                }

                $list_user = $list_user[0];

                $obj -> status = 200;
                $obj -> message = "Token Successfully Generated";
                $obj -> token = $jwt -> generateToken($list_user);

            }else{
                $obj -> status = 401;
                $obj -> message = "Incorrect Login";

            } 
            return $obj;
        }

        function reset($username){

            global $conn;

            $password = new Password();
            $obj = new stdClass();
            $jwt = new JWTUtils();

            $username = mysqli_real_escape_string($conn, $username);

            $query_user = "SELECT user.id,
                                  user.username,
                                  user.email,
                                  user.token,
                                  personal.firstname,
                                  personal.lastname
                             FROM user 
                             INNER JOIN personal on personal.user_id = user.id
                             WHERE (user.email='$username' 
                             OR user.username='$username') 
                             AND user.active=1";

            $query_user = $conn->query($query_user);

            if ($query_user->num_rows > 0) {

                $list_user = [];
                
                while($row = $query_user->fetch_assoc()) {
                    array_push($list_user, $row);
                }

                $list_user = $list_user[0];

                $jwt = $jwt -> generateResetPasswordToken($list_user);

                $list_user['token'] = $jwt;

                $password -> reset($list_user);

                $obj -> status = 200;
                $obj -> message = "Successfully Sent";

            }else{
                $obj -> status = 404;
                $obj -> message = "Account Not found";
            } 
            return $obj;
        }

        function resetValid($user){

            global $conn;
            
            $obj = new stdClass();

            $user_id = $user -> user_id;
            $user_token = $user -> token;
            $reset = $user -> reset;

            $query_user = "SELECT *
                           FROM user 
                           WHERE id=$user_id
                           AND token='$user_token' 
                           AND active=1";

            $query_user = $conn->query($query_user);

            if ($query_user->num_rows > 0 && $reset) {
                $obj -> status = 200;
                $obj -> message = "Account found";
            }else{
                $obj -> status = 404;
                $obj -> message = "Account Not found";
            } 
            return $obj;
        }
    }
?>