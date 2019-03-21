<?php

    require_once(dirname(__FILE__) . '/../../../server/utils/decrypt/token/index.php');

    class CheckFile{

        function __construct(){

        }

        function generateImage($fileType, $type, $key){
            $target_path = "/resource/$type/";
            $target_file_path = "../../.." . $target_path;
            $imageToken = new GenerateToken(10);
            $imageToken = $imageToken -> token;
            $fileName = $imageToken . "." . $fileType;
            $file = $target_file_path . $fileName;
            if (file_exists($file)) {
                generateImage($fileType, $type, $key);
            } else {
                if (!is_dir($target_file_path)) {
                    mkdir($target_file_path);
                }
                if(is_array($_FILES[$type]['tmp_name'])){
                    move_uploaded_file($_FILES[$type]['tmp_name'][$key], $file);
                }else{
                    move_uploaded_file($_FILES[$type]['tmp_name'], $file);
                }
                return $target_path . $fileName;
            }
        }
    }
?>