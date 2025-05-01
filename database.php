<?php
$host = "localhost";
$dbname = "jameskocpanel_database";
$username = "jameskocpanel_user1";
$password = "JamesKo208";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
