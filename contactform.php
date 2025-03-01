<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require __DIR__ . '/vendor/autoload.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['mail']);
    $message = htmlspecialchars($_POST['message']);

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->SMTPAuth = true;

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
        $mail->Subject = 'Contact Form Submission';
        $mail->Body    = $message;

        $mail->send();
        echo 'Message has been sent';
        sleep(3); // Wait for 3 seconds before redirecting
        header('Location: /index.html'); // Redirect to the main site
        exit(); // Ensure no further code is executed
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
?>