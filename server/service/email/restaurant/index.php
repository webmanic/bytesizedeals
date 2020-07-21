<?php

    require_once(dirname(__FILE__) . '/../../config/index.php');
    require_once(dirname(__FILE__) . '/../html/head.php');
    require_once(dirname(__FILE__) . '/../html/header.php');
    require_once(dirname(__FILE__) . '/../html/footer.php');

    class RestaurantEmail{

        function __construct(){

        }

        function restaurantSignupUser($emailDetail){

            global $API_ENDPOINT, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $SUPPORT_EMAIL;

            $username = $emailDetail -> username;
            $firstname = $emailDetail -> firstname;
            $lastname = $emailDetail -> lastname;
            $restaurant_title = $emailDetail -> restaurant_title;
            $restaurant_logo = $emailDetail -> restaurant_title;
            $data = json_decode($emailDetail -> data);
            $tax_vat = (floatval($data->transactions[0]->amount->details->tax) / floatval($data->transactions[0]->amount->total)) * 100;
            $payment_type = strtolower($data->type) == 'cash' ? 'Cash' : 'PayPal';
            $to = $emailDetail -> email; // note the comma
            $subject = "{$EMAIL_TITLE} Restaurant Signup";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h1>Confirmation:</h1>
                            <p>Hello {$firstname} {$lastname}, thank you for signing up your <b>{$restaurant_title}</b> restaurant details using <b>{$payment_type}</b> payment method, we will review it and you will receive confirmation email for the approval.</p>
                            <h3>Reference:</h3>
                            <table id=\"customers\">
                                <thead>
                                    <tr>
                                        <th width=\"20%\">
                                            ID:
                                        </th>
                                        <th width=\"80%\">
                                            Description:
                                        </th>
                                        <th width=\"20%\">
                                            Amount:
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {$data->transactions[0]->related_resources[0]->sale->id}
                                        </td>
                                        <td>
                                            <b>{$restaurant_title}</b>
                                        </td>
                                        <td>
                                            &pound;{$data->transactions[0]->amount->details->subtotal}
                                        </td>
                                    <tr>";
            if(floatval($tax_vat) > 0){
            $message .= "          <tr>
                                        <td class=\"cost_title\" colspan=\"2\">
                                            VAT($tax_vat%):
                                        </td>
                                        <td colspan=\"1\">
                                            &pound;{$data->transactions[0]->amount->details->tax}
                                        </td>
                                    </tr>";
            }
            $message .= "          <tr>
                                        <td class=\"cost_title\" colspan=\"2\">
                                            <b>Total:</b>
                                        </td>
                                        <td colspan=\"1\">
                                            <b>&pound;{$data->transactions[0]->amount->total}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
            $headers .= "From: {$EMAIL_TITLE} Restaurant Signup Approval <{$SUPPORT_EMAIL}>" . "\r\n"; 

            mail($to, $subject, $message, $headers);
        }

        function restaurantSignupAdmin($emailDetail){

            global $API_ENDPOINT, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $EMAIL_ADMIN, $SUPPORT_EMAIL;

            $username = $emailDetail -> username;
            $firstname = $emailDetail -> firstname;
            $lastname = $emailDetail -> lastname;
            $restaurant_title = $emailDetail -> restaurant_title;
            $restaurant_logo = $emailDetail -> restaurant_title;
            $data = json_decode($emailDetail -> data);
            $tax_vat = (floatval($data->transactions[0]->amount->details->tax) / floatval($data->transactions[0]->amount->total)) * 100;
            $payment_type = strtolower($data->type) == 'cash' ? 'Cash' : 'PayPal';

            $to = $EMAIL_ADMIN; // note the comma
            $subject = "{$EMAIL_TITLE} Restaurant Signup Approval";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h2>Confirmation:</h2>
                            <p><b>{$username}</b> ({$firstname} {$lastname}) has signed up for the <b>{$restaurant_title}</b> using <b>{$payment_type}</b> payment method and waiting for the approval.</p>
                            <h3>Reference:</h3>
                            <table id=\"customers\">
                                <thead>
                                    <tr>
                                        <th width=\"20%\">
                                            ID:
                                        </th>
                                        <th width=\"80%\">
                                            Description:
                                        </th>
                                        <th width=\"20%\">
                                            Amount:
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {$data->transactions[0]->related_resources[0]->sale->id}
                                        </td>
                                        <td>
                                            <b>{$restaurant_title}</b>
                                        </td>
                                        <td>
                                            &pound;{$data->transactions[0]->amount->details->subtotal}
                                        </td>
                                    <tr>";
            if(floatval($tax_vat) > 0){
            $message .= "          <tr>
                                        <td class=\"cost_title\" colspan=\"2\">
                                            VAT($tax_vat%):
                                        </td>
                                        <td colspan=\"1\">
                                            &pound;{$data->transactions[0]->amount->details->tax}
                                        </td>
                                    </tr>";
            }
            $message .= "           <tr>
                                        <td class=\"cost_title\" colspan=\"2\">
                                            <b>Total:</b>
                                        </td>
                                        <td colspan=\"1\">
                                            <b>&pound;{$data->transactions[0]->amount->total}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
            $headers .= "To: {$SUPPORT_EMAIL} <{$to}>" . "\r\n"; 
            $headers .= "From: {$EMAIL_TITLE} Restaurant Signup Approval <{$SUPPORT_EMAIL}>" . "\r\n"; 

            mail($to, $subject, $message, $headers);
        }

        function restaurantConfirmApproval($emailDetail){
            
            global $API_ENDPOINT, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $SUPPORT_EMAIL;

            $username = $emailDetail -> username;
            $firstname = $emailDetail -> firstname;
            $lastname = $emailDetail -> lastname;
            $restaurant_title = $emailDetail -> restaurant_title;
            $restaurant_logo = $emailDetail -> restaurant_title;
            $active = $emailDetail -> active;
            $start_date = $emailDetail -> start_date;
            $end_date = $emailDetail -> end_date;
            $data = json_decode($emailDetail -> data);
            $tax_vat = (floatval($data->transactions[0]->amount->details->tax) / floatval($data->transactions[0]->amount->total)) * 100;
            $payment_type = strtolower($data->type) == 'cash' ? 'Cash' : 'PayPal';
            $message = $active == 1 ? 'Approved' : 'Rejected';
            $restaurant_active = $emailDetail -> restaurant_active;
            $active_message;

            if($restaurant_active == 1){
                $active_message = "the <b>{$restaurant_title}</b> that you have signed up has been <b>{$message}</b>";
            }else{
                $active_message = "the <b>{$restaurant_title}</b> that you have renewed has been <b>{$message}</b>";
            }

            $to = $emailDetail -> email;; // note the comma
            $subject = "{$EMAIL_TITLE} Restaurant Signup Approval";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h2>Hello,</h2>
                            <p><b>{$username}</b> ({$firstname} {$lastname}), $active_message using <b>{$payment_type}</b> payment method.</p>
                            <h3>Overview:</h3>
                            <table id=\"customers\">
                                <thead>
                                    <tr>
                                        <th width=\"20%\">
                                            ID:
                                        </th>
                                        <th width=\"60%\">
                                            Description:
                                        </th>
                                        <th width=\"10%\">
                                            Start date:
                                        </th>
                                        <th width=\"10%\">
                                            End date:
                                        </th>
                                        <th width=\"20%\">
                                            Amount:
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {$data->transactions[0]->related_resources[0]->sale->id}
                                        </td>
                                        <td>
                                            <b>{$restaurant_title}</b>
                                        </td>
                                        <td>
                                            {$start_date}
                                        </td>
                                        <td>
                                            {$end_date}
                                        </td>
                                        <td>
                                            &pound;{$data->transactions[0]->amount->details->subtotal}
                                        </td>
                                    <tr>";
            if(floatval($tax_vat) > 0){
            $message .= "           <tr>
                                        <td class=\"cost_title\" colspan=\"4\">
                                            VAT($tax_vat%):
                                        </td>
                                        <td colspan=\"1\">
                                            &pound;{$data->transactions[0]->amount->details->tax}
                                        </td>
                                    </tr>";
            }
            $message .= "           <tr>
                                        <td class=\"cost_title\" colspan=\"4\">
                                            <b>Total:</b>
                                        </td>
                                        <td colspan=\"1\">
                                            <b>&pound;{$data->transactions[0]->amount->total}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
            $headers .= "From: {$EMAIL_TITLE} Restaurant Signup Approval <{$SUPPORT_EMAIL}>" . "\r\n"; 

            mail($to, $subject, $message, $headers);
        }


        function restaurantRenew($emailDetail){
            
            global $API_ENDPOINT, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $SUPPORT_EMAIL, $YEAR_TO_EXTEND;

            $username = $emailDetail -> username;
            $firstname = $emailDetail -> firstname;
            $lastname = $emailDetail -> lastname;
            $restaurant_title = $emailDetail -> restaurant_title;
            $start_date = $emailDetail -> start_date;
            $end_date = $emailDetail -> end_date;
            $noDays = $emailDetail -> no_days;
            $active = $emailDetail -> active;
            $data = json_decode($emailDetail -> data);
            $payment_type = strtolower($data->type) == 'cash' ? 'Cash' : 'PayPal';
            $tax_vat = (floatval($data->transactions[0]->amount->details->tax) / floatval($data->transactions[0]->amount->total)) * 100;
            $colspan = $active == 1 ? 4 : 2;

            if($noDays >= 0){
                $year_message = "{$YEAR_TO_EXTEND} year" . $YEAR_TO_EXTEND > 1 ? 's' : '' . "(+{$noDays} day)" . $noDays > 1 ? 's' : '';
            }else{
                $year_message = "{$YEAR_TO_EXTEND} year" . $YEAR_TO_EXTEND > 1 ? 's' : '';
            }

            $to = $emailDetail -> email;; // note the comma
            $subject = "{$EMAIL_TITLE} Restaurant Signup Renewal";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h1>Renewal Confirmation:</h1>
                            <p>Hello {$firstname} {$lastname}, thank you for renewing your contract with <b>{$restaurant_title}</b> restaurant details using <b>{$payment_type}</b> payment method.";
            if($payment_type == 'Cash'){
            $message .=    "<br/><br/>Please wait for an admin to review and approve your <b>{$restaurant_title}</b> restaurant details.
                           ";
            }
            $message .=    "</p>
                            <h3>Overview:</h3>
                            <table id=\"customers\">
                                <thead>
                                    <tr>
                                        <th width=\"20%\">
                                            ID:
                                        </th>
                                        <th width=\"60%\">
                                            Description:
                                        </th>
                            ";
            if($active == 1){
            $message .=     "           <th width=\"10%\">
                                            Start date:
                                        </th>
                                        <th width=\"10%\">
                                            End date:
                                        </th>
                            ";
            }
            $message .=     "           <th width=\"20%\">
                                            Amount:
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {$data->transactions[0]->related_resources[0]->sale->id}
                                        </td>
                                        <td>
                                            <b>{$restaurant_title}</b>
                                        </td>
                            ";
            if($active == 1){
            $message .=     "           <td>
                                            {$start_date}
                                        </td>
                                        <td>
                                            {$end_date}
                                        </td>
                            ";
            }
            $message .=     "           <td>
                                            &pound;{$data->transactions[0]->amount->details->subtotal}
                                        </td>
                                    <tr>";
            if(floatval($tax_vat) > 0){
            $message .= "           <tr>
                                        <td class=\"cost_title\" colspan=\"$colspan\">
                                            VAT($tax_vat%):
                                        </td>
                                        <td colspan=\"1\">
                                            &pound;{$data->transactions[0]->amount->details->tax}
                                        </td>
                                    </tr>";
            }
            $message .= "           <tr>
                                        <td class=\"cost_title\" colspan=\"$colspan\">
                                            <b>Total:</b>
                                        </td>
                                        <td colspan=\"1\">
                                            <b>&pound;{$data->transactions[0]->amount->total}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
            $headers .= "From: {$EMAIL_TITLE} Restaurant Signup Renewal <{$SUPPORT_EMAIL}>" . "\r\n"; 

            mail($to, $subject, $message, $headers);
        }

        function restaurantRenewAdmin($emailDetail){
            
            global $API_ENDPOINT, $EMAIL_ADMIN, $EMAIL_TITLE, $HEAD, $HEADER, $FOOTER, $SUPPORT_EMAIL, $YEAR_TO_EXTEND;

            $username = $emailDetail -> username;
            $firstname = $emailDetail -> firstname;
            $lastname = $emailDetail -> lastname;
            $restaurant_title = $emailDetail -> restaurant_title;
            $start_date = $emailDetail -> start_date;
            $end_date = $emailDetail -> end_date;
            $noDays = $emailDetail -> no_days;
            $data = json_decode($emailDetail -> data);
            $payment_type = strtolower($data->type) == 'cash' ? 'Cash' : 'PayPal';
            $tax_vat = (floatval($data->transactions[0]->amount->details->tax) / floatval($data->transactions[0]->amount->total)) * 100;
            $active = $emailDetail -> active;
            $colspan = $active == 1 ? 4 : 2;

            if($noDays >= 0){
                $year_message = "{$YEAR_TO_EXTEND} year" . $YEAR_TO_EXTEND > 1 ? 's' : '' . "(+{$noDays} day)" . $noDays > 1 ? 's' : '';
            }else{
                $year_message = "{$YEAR_TO_EXTEND} year" . $YEAR_TO_EXTEND > 1 ? 's' : '';
            }

            $to = $EMAIL_ADMIN; // note the comma
            $subject = "{$EMAIL_TITLE} Restaurant Signup Renewal";
            $message = "
                <!DOCTYPE html>
                <html lang=\"en\">
                    {$HEAD}
                    <body class=\"wrap\">
                        {$HEADER}
                        <div class=\"body_container\">
                            <h1>Renewal Confirmation:</h1>
                            <p>Hello {$firstname} {$lastname} has renewed contract with <b>{$restaurant_title}</b> restaurant details using <b>{$payment_type}</b> payment method.</p>
                            <h3>Overview:</h3>
                            <table id=\"customers\">
                                <thead>
                                    <tr>
                                        <th width=\"20%\">
                                            ID:
                                        </th>
                                        <th width=\"60%\">
                                            Description:
                                        </th>
                        ";
            if($active == 1){
            $message .= "               <th width=\"10%\">
                                            Start date:
                                        </th>
                                        <th width=\"10%\">
                                            End date:
                                        </th>
                        ";
            }
            $message .= "               <th width=\"20%\">
                                            Amount:
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            {$data->transactions[0]->related_resources[0]->sale->id}
                                        </td>
                                        <td>
                                            <b>{$restaurant_title}</b>
                                        </td>
                        ";
            if($active == 1){
            $message .= "               <td>
                                            {$start_date}
                                        </td>
                                        <td>
                                            {$end_date}
                                        </td>
                        ";
            }
            $message .= "              <td>
                                            &pound;{$data->transactions[0]->amount->details->subtotal}
                                        </td>
                                    <tr>";
            if(floatval($tax_vat) > 0){
            $message .= "           <tr>
                                        <td class=\"cost_title\" colspan=\"$colspan\">
                                            VAT($tax_vat%):
                                        </td>
                                        <td colspan=\"1\">
                                            &pound;{$data->transactions[0]->amount->details->tax}
                                        </td>
                                    </tr>";
            }
            $message .= "           <tr>
                                        <td class=\"cost_title\" colspan=\"$colspan\">
                                            <b>Total:</b>
                                        </td>
                                        <td colspan=\"1\">
                                            <b>&pound;{$data->transactions[0]->amount->total}</b>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
            $headers .= "To: {$SUPPORT_EMAIL} <{$to}>" . "\r\n"; 
            $headers .= "From: {$EMAIL_TITLE} Restaurant Signup Renewal <{$SUPPORT_EMAIL}>" . "\r\n"; 

            mail($to, $subject, $message, $headers);
        }
    }
    
?>