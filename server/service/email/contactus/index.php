<?php

    require_once(dirname(__FILE__) . '/../../config/index.php');
    require_once(dirname(__FILE__) . '/../html/head.php');
    require_once(dirname(__FILE__) . '/../html/header.php');
    require_once(dirname(__FILE__) . '/../html/footer.php');

    class ContactUsEmail{

        function __construct(){

        }

        function contactSubmit($contactUsDetail){

            global $API_ENDPOINT, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $SUPPORT_EMAIL;

            $email = $contactUsDetail -> email;
            $subject = $contactUsDetail -> subject;
            $message = $contactUsDetail -> message;
            $type = $contactUsDetail -> type;

            $to = $email;
            $subject = "{$EMAIL_TITLE} Signup Enquiry";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h2>Hello</h2>
                            <p>Thank you for contacting us, we will response to you as soon as possible.</p>
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
            $headers[] = "To: {$to} <{$to}>";
            $headers[] = "From: {$EMAIL_TITLE} Signup <{$SUPPORT_EMAIL}>";

            mail('', $subject, $message, implode("\r\n", $headers));
        }

        function contactSubmitAdmin($contactUsDetail){

            global $API_ENDPOINT, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $EMAIL_ADMIN, $SUPPORT_EMAIL;

            $email = $contactUsDetail -> email;
            $subjects = $contactUsDetail -> subject;
            $message = $contactUsDetail -> message;
            $type = $contactUsDetail -> type;

            $to = $EMAIL_ADMIN;
            $subject = "{$EMAIL_TITLE} Signup Enquiry";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h2>Contact Enquiry From: {$email}</h2>
                            <label>Subject:</label>
                            <p>{$subjects}</p>
                            <label>Message:</label>
                            <p>{$message}</p>
                            <label>Type:</label>
                            <p>{$type}</p>
                            <hr/>
                            <p class=\"more_information\">Please do not reply to this email; this address is not monitored. Please use our contact page.</p>
                        </div>
                        {$FOOTER}
                    </body>
                </html>
            ";

            // To send HTML mail, the Content-type header must be set
            $headers[] = "MIME-Version: 1.0";
            $headers[] = "Content-type: text/html; charset=iso-8859-1";
            $headers[] = "To: {$EMAIL_TITLE} support <{$to}>";
            $headers[] = "From: {$EMAIL_TITLE} Signup <{$SUPPORT_EMAIL}>";

            mail('', $subject, $message, implode("\r\n", $headers));
        }
    }
?>