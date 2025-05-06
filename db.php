<?php
$host = "localhost"; //change if needed 
$user = "urusername";
$pass = "urpassword";
$dbname = "urdatabsename";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
