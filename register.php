<?php
include("db.php"); // Make sure this connects to your database

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect input data from the form
    $firstname = trim($_POST['firstname']);
    $lastname = trim($_POST['lastname']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Basic validation
    if (empty($firstname) || empty($lastname) || empty($email) || empty($password)) {
        echo "All fields are required.";
        exit();
    }

    // Check if user already exists
    $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo "Email already registered.";
        exit();
    }

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert user into database
    $stmt = $conn->prepare("INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $firstname, $lastname, $email, $hashedPassword);

    if ($stmt->execute()) {
        // Redirect to page.html
        header("Location: page.html");
        exit();
    } else {
        echo "Something went wrong: " . $conn->error;
    }

    $stmt->close();
    $conn->close();
}
?>
