<?php 
    class PasswordHash{

        function __construct($password){
            $this -> password = $this -> passwordHashCrypt($password);
        }

        function passwordHashCrypt($password){
            return password_hash($password, PASSWORD_DEFAULT);
        }

    }

?>