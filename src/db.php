<?php
$host = "localhost";
$user = "jameskocpanel_user1";
$pass = "JamesKo208";
$dbname = "jameskocpanel_database";

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
