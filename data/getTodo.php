<?php
 header("Access-Control-Allow-Origin: *");

$homepage = file_get_contents('toDoList.json');
echo $homepage;
