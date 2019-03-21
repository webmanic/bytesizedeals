<?php

    require_once(dirname(__FILE__) . '/../../config/index.php');
    require_once(dirname(__FILE__) . '/../html/head.php');
    require_once(dirname(__FILE__) . '/../html/header.php');
    require_once(dirname(__FILE__) . '/../html/footer.php');

    class Password{

        function __construct(){

        }
        
        function reset($userDetail){

            global $API_ENDPOINT, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $API_ENDPOINT_FRONTEND, $SUPPORT_EMAIL;

            $id = $userDetail['id'];
            $username = $userDetail['username'];
            $email = $userDetail['email'];
            $firstname = ucfirst($userDetail['firstname']);
            $lastname = ucfirst($userDetail['lastname']);
            $jwt = $userDetail['token'];

            $to = $email;
            $subject = "{$EMAIL_TITLE} Reset Password";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h2>Reset your password?</h2>
                            <p>If you requested a password reset for {$username}, click the button below. If you did not make this request, ignore this email. Reset account link will be valid up to 24hrs.</p>
                            <p><a href=\"{$API_ENDPOINT_FRONTEND}/login/reset/password/{$jwt}\" class=\"activate\">Reset Password</a></p>
                            <hr/>
                            <p class=\"more_information\">Please do not reply to this email, this email address is not monitored. Please use our contact page.</p>
                        </div>
                        {$FOOTER}
                    </body>
                </html>
            ";

            // To send HTML mail, the Content-type header must be set
            $headers[] = "MIME-Version: 1.0";
            $headers[] = "Content-type: text/html; charset=iso-8859-1";
            $headers[] = "To: {$firstname} {$lastname} <{$to}>";
            $headers[] = "From: {$EMAIL_TITLE} Signup <{$SUPPORT_EMAIL}>";

            mail('', $subject, $message, implode("\r\n", $headers));
        }
    }
?>