<?php

    class DateTimeUtils{

        public $date;

        function __construct(){
            $this -> date = new DateTime();
        }

        function getUnixTime(){
            return $this -> date -> getTimestamp();
        }

        function getExpiryUnixTime($minutes_to_add){
            return $this -> date -> add(new DateInterval('PT' . $minutes_to_add . 'M')) -> getTimestamp();
        }
    }

?>