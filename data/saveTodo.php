<?php
 // header("Access-Control-Allow-Origin: *");

 $json_data = json_encode($_POST);
file_put_contents('toDoList.json', $json_data);

?>
