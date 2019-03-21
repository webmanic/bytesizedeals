<?php   
    class EmailValidation{

        private $email;

        function __construct($email){
            $this -> email = $email;
        }

        function isEmailValid(){
            $obj = new stdClass();
            if (filter_var($this -> email, FILTER_VALIDATE_EMAIL)) {
                $obj -> valid = true;

            } else {
                $obj -> message = "Invalid Email";
                $obj -> valid = false;
            }
            return $obj;
        }
        
    }
?>