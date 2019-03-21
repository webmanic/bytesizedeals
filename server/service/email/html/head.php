<?php
    require_once(dirname(__FILE__) . '/../../config/index.php');
    $HEAD = "
        <head>
            <meta charset=\"UTF-8\">
            <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
            <meta http-equiv=\"X-UA-Compatible\" content=\"ie=edge\">
            <title>{$EMAIL_TITLE}</title>
            <link href=\"https://fonts.googleapis.com/css?family=Roboto\" rel=\"stylesheet\">
            <style>
                .wrap{
                    padding-top: 15px;
                    padding-bottom: 15px;
                    margin: 0px;
                    background: #c5c5c5;
                    font-family: \"Roboto\", sans-serif;
                    width: 100%;
                    height: 100%;
                    box-sizing: border-box;
                }
                .body_container{
                    background: white;
                    width: 50%;
                    margin: auto;
                    min-height: 300px;
                    padding: 15px;
                    padding-top: 50px;
                    box-sizing: border-box;
                }
                .header{
                    background: #000000;
                    padding: 15px;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    box-sizing: border-box;
                    height: 70px;
                }
                .header img{
                    width: 250px;
                }
                .footer{
                    background: #000000;
                    color: white;
                    padding: 15px;
                    box-sizing: border-box;
                    font-size: 12px;
                }
                .body_container,
                .header,
                .footer{
                    width: 660px;
                    margin: auto;
                }
                .footer .container_left{
                    width: 50%;
                    float: left;
                }
                .footer .container_left h2{
                    margin-top: 0px;
                }
                .footer .container_right{
                    width: 50%;
                    float: right;
                }
                .footer .container_right .rewards{
                    text-align: right;
                }
                .footer .container_right .rewards img{
                    width: 50px;
                }
                .footer .copy_right{
                    clear: both;
                    text-align: center;
                    font-size: 10px;
                }
                hr{
                    border: 1px solid #f5f5f5;
                    margin-top: 20px;
                }
                p.more_information{
                    font-size: 10px;
                    color: #c1c1c1;
                }
                table{
                    border-spacing: 0px;
                }
                a.activate{
                    color: white;
                    background: #0089ff;
                    width: 100%;
                    display: block;
                    text-align: center;
                    padding: 15px;
                    box-sizing: border-box;
                    width: 70%;
                    margin: auto;
                    text-decoration: none;
                    font-size: 20px;
                }
                a.activate:hover{
                    text-decoration: underline;
                }
                .rewards_title{
                    text-align: center;
                    padding-left: 118px;
                }
                #customers {
                    border-collapse: collapse;
                    width: 100%;
                }
                
                #customers td, #customers th {
                    border: 1px solid #ddd;
                    padding: 8px;
                }
                
                #customers tr:nth-child(even){background-color: #f2f2f2;}
                
                #customers tr:hover {background-color: #ddd;}
                
                #customers th {
                    padding-top: 12px;
                    padding-bottom: 12px;
                    text-align: left;
                    background-color: orange;
                    color: black;
                }
                .cost_title{
                    text-align: right;
                }
            </style>
        </head>
    ";
?>