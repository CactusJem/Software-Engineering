<?php
$host = "localhost";
$dbname = "urdatabsename";
$username = "urusername";
$password = "urpassword";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
