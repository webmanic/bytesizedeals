<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');

    class CheckMyAccount{

        function __construct(){

        }

        function getMyAccount($user){

            global $conn;

            $user_id  = $user -> user_id;
            
            $obj = new stdClass();

            $query_myaccount = "SELECT user.id,
                                       user.username,
                                       user.email,
                                       personal.firstname,
                                       personal.lastname,
                                       GROUP_CONCAT(role.role SEPARATOR ',') AS role
                                       FROM user 
                                       INNER JOIN personal ON user.id = personal.user_id 
                                       INNER JOIN user_role ON user.id = user_role.user_id 
                                       INNER JOIN role ON role.id = user_role.role_id 
                                       WHERE ((user.id=$user_id AND user.id=$user_id)) 
                                       AND user.active=1";

            
            $result_myaccount = $conn->query($query_myaccount);

            if ($result_myaccount->num_rows > 0){

                $list_user = [];
                
                while($row = $result_myaccount->fetch_assoc()) {
                    $row['role'] = explode(',', $row['role']);
                    array_push($list_user, $row);
                }

                $obj -> status = 200;
                $obj -> data = $list_user;
            }else{
                $obj -> status = 401;
                $obj -> message = "Unauthorised";
            }
            return $obj;
        }
    }

?>