<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/vendor/autoload.php';

// Clear any output buffer
ob_start(); // Start output buffering
ob_clean();  // Discard any existing content in the buffer


// Add CORS headers
header("Content-Type: application/json");

$allowedOrigins = [
    'http://localhost:3000',
    'https://yohanneshaile.com',
    'https://www.yohanneshaile.com',
    'https://img-delta-ebon.vercel.app/',
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? ''; // Get the origin of the request

if (in_array($origin, $allowedOrigins, true)) {
    header("Access-Control-Allow-Origin: " . $origin);
} else {
    // If the origin is not allowed, you can either:
    // 1. Send a 403 Forbidden response (more secure)
    http_response_code(403);
    echo json_encode(['error' => 'Origin not allowed']);
    exit;
    // 2. Or, don't set the Access-Control-Allow-Origin header at all
    //    (browser will block the request)
}

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Check if it's an OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Max-Age: 86400"); // Cache preflight response for 24 hours
    http_response_code(204); // Respond with "No Content" status
    exit; // Stop further execution
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize input data
    $name = htmlspecialchars($_POST['name'] ?? ''); // Use null coalescing operator
    $email = htmlspecialchars($_POST['email'] ?? '');
    $message = htmlspecialchars($_POST['message'] ?? '');

        // Check if required fields are empty
    if (empty($name) || empty($email) || empty($message)) {
        http_response_code(400); // Bad Request
        echo json_encode(['success' => false, 'message' => 'Please fill in all required fields.']);
        exit();
    }

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        $mail->SMTPDebug = SMTP::DEBUG_OFF;  // Disable SMTP debugging  (Very important!)

        $mail->Host = 'smtp.gmail.com'; // Set the SMTP server to send through
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Use SSL
        $mail->Port = 465;

        $mail->Username = "yh.yohannes@gmail.com"; // SMTP username
        $mail->Password = "eiil dttw cqvm fcpx"; // SMTP password

        //Recipients
        $mail->setFrom($email, $name);
        $mail->addAddress('yh.yohannes@gmail.com', 'Yohannes'); // Add a recipient
        $mail->addReplyTo($email, $name); // Add Reply-To header

        // Content
        $mail->isHTML(true); // Set email format to HTML
        $mail->Subject = 'My Website - Contact Form Submission';
        $mail->Body    = $message;

        $mail->send();
        // Return JSON response
        echo json_encode(['success' => true, 'message' => 'Message has been sent']);

    } catch (Exception $e) {
        http_response_code(500); //Internal server error - email failure
        echo json_encode(['success' => false, 'message' => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]); // Send JSON
    } finally {
        exit(); // Stop execution
    }
} else {
     http_response_code(400); // Bad Request
     echo json_encode(['success' => false, 'message' => 'Invalid request method.  Please use POST.']);
     exit();

}
?>