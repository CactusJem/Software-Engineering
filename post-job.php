<?php
include 'database.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? '';
$description = $data['description'] ?? '';
$location = $data['location'] ?? '';
$salary = $data['salary'] ?? '';
$company = $data['company'] ?? '';
$contactNumber = $data['contactNumber'] ?? '';
$contactEmail = $data['contactEmail'] ?? '';

if ($title && $description && $location && $salary && $company && $contactNumber && $contactEmail) {
  $stmt = $conn->prepare("INSERT INTO jobs (title, description, location, salary, company, contactNumber, contactEmail) VALUES (?, ?, ?, ?, ?, ?, ?)");
  $stmt->bind_param("sssssss", $title, $description, $location, $salary, $company, $contactNumber, $contactEmail);
  $stmt->execute();

  echo json_encode(["success" => true]);
} else {
  http_response_code(400);
  echo json_encode(["error" => "Missing required fields"]);
}
?>
