<?php

    require_once(dirname(__FILE__) . '/../../config/index.php');
    require_once(dirname(__FILE__) . '/../html/head.php');
    require_once(dirname(__FILE__) . '/../html/header.php');
    require_once(dirname(__FILE__) . '/../html/footer.php');

    class SignupEmail{

        function __construct(){

        }

        function signupUser($signupDetail, $jwt){

            global $API_ENDPOINT, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $API_ENDPOINT_FRONTEND, $SUPPORT_EMAIL;

            $username = $signupDetail -> username;
            $password = $signupDetail -> password;
            $email = $signupDetail -> email;
            $firstname = $signupDetail -> firstname;
            $lastname = $signupDetail -> lastname;

            $to = $email;
            $subject = "{$EMAIL_TITLE} Signup";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h2>Hello {$firstname} {$lastname},</h2>
                            <p>Thank you for signing up, please activate the following link below.</p>
                            <p><a href=\"{$API_ENDPOINT_FRONTEND}/activate/{$jwt}\" class=\"activate\">Activate</a></p>
                            <hr/>
                            <p class=\"more_information\">Please do not reply to this email, this email address is not monitored. Please use our contact page.</p>
                        </div>
                        {$FOOTER}
                    </body>
                </html>
            ";

            // To send HTML mail, the Content-type header must be set
            $headers = "MIME-Version: 1.0" . "\r\n"; 
            $headers .= "Content-type: text/html; charset=iso-8859-1" . "\r\n"; 
            $headers .= "From: {$EMAIL_TITLE} Signup <{$SUPPORT_EMAIL}>" . "\r\n"; 

            mail($to, $subject, $message, $headers);
        }
    }
?>