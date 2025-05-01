<?php
include 'database.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$sql = "SELECT title, description, location, salary, company, contactNumber, contactEmail FROM jobs ORDER BY created_at DESC";
$result = $conn->query($sql);

$jobs = [];

while ($row = $result->fetch_assoc()) {
  $jobs[] = $row;
}

echo json_encode($jobs);
?>
