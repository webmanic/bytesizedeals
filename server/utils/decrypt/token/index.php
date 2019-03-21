<?php
    class GenerateToken{

        function __construct($length){
            $this -> token = $this -> generateToken($length);
        }

        function generateToken($length){
            $token = bin2hex(random_bytes($length));
            return $token;
        }
    }
?>