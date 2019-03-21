<?php

    require(dirname(__FILE__) . '/../config/config.php');

    // Create connection
    $conn = new mysqli($dbconfig->servername, $dbconfig->username, $dbconfig->password, $dbconfig->database);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
?>