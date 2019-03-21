<?php

    require_once(dirname(__FILE__) . '/../connection/connection.php');

    class Purchase{

        function __construct(){

        }

        function getPurchasedRestaurantListUser($user){

            global $conn;

            $obj = new stdClass();

            $user_id = $user -> user_id;

            $query_purchase = "SELECT restaurant_invoice.id,
                                      restaurant_invoice.payment_id,
                                      restaurant_invoice.datetime, 
                                      restaurant_invoice.start_date,
                                      restaurant_invoice.end_date,
                                      restaurant_invoice.amount_breakdown,
                                      restaurant_invoice.amount,
                                      restaurant_invoice.currency,
                                      restaurant_invoice.type,
                                      restaurant_invoice.paid
                           FROM restaurant_invoice
                           WHERE restaurant_invoice.user_id = $user_id 
                           ORDER BY restaurant_invoice.id desc";

            $result_purchase = $conn->query($query_purchase);
            
            if ($result_purchase->num_rows > 0) {

                $list_purchase = [];

                while($row = $result_purchase->fetch_assoc()) {
                    if($row["amount_breakdown"]){
                        $row["amount_breakdown"] = json_decode($row["amount_breakdown"]);
                        $row["paid"] = $row["paid"] == 1 ? true: false;
                    }
                    array_push($list_purchase, $row);
                }
                $obj -> status = 200;
                $obj -> data = $list_purchase;
            }else{
                $obj -> status = 404;
                $obj -> message = "Not Found";
            }
            return $obj;
        }


        function getPurchasedRestaurantListAdmin(){

            global $conn;

            $obj = new stdClass();

            $query_purchase = "SELECT restaurant.title,
                                      restaurant.telephone_no,
                                      restaurant.mobile_no,
                                      restaurant_invoice.id,
                                      restaurant_invoice.payment_id,
                                      restaurant_invoice.datetime, 
                                      restaurant_invoice.start_date,
                                      restaurant_invoice.end_date,
                                      restaurant_invoice.amount_breakdown,
                                      restaurant_invoice.amount,
                                      restaurant_invoice.currency,
                                      restaurant_invoice.user_id,
                                      restaurant_invoice.restaurant_id,
                                      restaurant_invoice.type,
                                      restaurant_invoice.paid,
                                      restaurant_invoice.token,
                                      user.username,
                                      user.email,
                                      personal.firstname,
                                      personal.lastname
                              FROM restaurant_invoice
                              INNER JOIN user on user.id = restaurant_invoice.user_id
                              INNER JOIN personal on personal.user_id = restaurant_invoice.user_id
                              INNER JOIN restaurant on restaurant.id = restaurant_invoice.restaurant_id
                              ORDER BY restaurant_invoice.id desc";

            $result_purchase = $conn->query($query_purchase);
            
            if ($result_purchase->num_rows > 0) {

                $list_purchase = [];

                while($row = $result_purchase->fetch_assoc()) {
                    if($row["amount_breakdown"]){
                        $row["amount_breakdown"] = json_decode($row["amount_breakdown"]);
                        $row["paid"] = $row["paid"] == 1 ? true: false;
                    }
                    array_push($list_purchase, $row);
                }
                $obj -> status = 200;
                $obj -> data = $list_purchase;
            }else{
                $obj -> status = 404;
                $obj -> message = "Not Found";
            }
            return $obj;
        }



    }

?>