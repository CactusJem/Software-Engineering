<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Debug log function
function logError($message) {
    $logFile = __DIR__ . '/gpt_error.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $message\n", FILE_APPEND);
}

// Handle preflight (CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // If it's a GET request, show a simple form
    echo '
    <form action="ai-proxy.php" method="POST">
        <label for="message">Enter your message:</label><br>
        <input type="text" id="message" name="message"><br>
        <input type="submit" value="Submit">
    </form>
    ';
    exit;  // Prevent further script execution
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Only POST requests are allowed"]);
    exit;
}

// Debug raw input
$rawInput = file_get_contents("php://input");
logError("Raw input: " . $rawInput);

$input = json_decode($rawInput, true);
if (!$input) {
    // Try fallback to POST
    $input = $_POST;
    logError("Fallback to \$_POST: " . json_encode($input));
}

$message = $input['message'] ?? null;

if (!$message) {
    echo json_encode(["error" => "No input received", "debug" => $input]);
    exit;
}

// OpenAI API Key — ideally store securely!
$apiKey = "your-api-key-here";

$data = [
    "model" => "gpt-3.5-turbo",
    "messages" => [
        ["role" => "system", "content" => "You are a helpful job search assistant. Provide brief and useful responses about job hunting, resume tips, and career advice."],
        ["role" => "user", "content" => $message]
    ],
    "max_tokens" => 150
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if (curl_errno($ch)) {
    $error = "cURL Error: " . curl_error($ch);
    logError($error);
    echo json_encode(["error" => $error]);
} elseif ($httpCode >= 400) {
    $error = "OpenAI API returned HTTP $httpCode: " . $response;
    logError($error);
    echo json_encode(["error" => "OpenAI API error", "details" => json_decode($response, true)]);
} else {
    logError("Success: " . substr($response, 0, 100) . "...");
    echo $response;
}

curl_close($ch);
?>
