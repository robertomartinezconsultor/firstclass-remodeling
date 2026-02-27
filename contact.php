<?php
// Simple PHP form handler for First Class Remodeling
// Redirects all inquiries to the designated email address.

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitize form input
    $name    = isset($_POST['name']) ? trim($_POST['name']) : '';
    $email   = isset($_POST['email']) ? trim($_POST['email']) : '';
    $phone   = isset($_POST['phone']) ? trim($_POST['phone']) : '';
    $message = isset($_POST['message']) ? trim($_POST['message']) : '';

    // Build email subject and body
    $subject = 'NUEVO PROSPECTO - First Class Remodeling';
    $to      = 'firstclassremodelingtx@gmail.com';
    $body    = "Nombre: $name\n";
    $body   .= "Correo: $email\n";
    $body   .= "Teléfono: $phone\n";
    $body   .= "Mensaje:\n$message\n";

    // Set headers. The From address should be from the domain so SPF doesn't fail.
    $headers  = 'From: no-reply@firstclassremodelingtx.com' . "\r\n";
    $headers .= 'Reply-To: ' . $email . "\r\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();

    // Send email
    mail($to, $subject, $body, $headers);

    // Redirect to thank-you page or back to contact page with success query
    header('Location: thank-you.html');
    exit;
}

// If form not submitted properly, redirect back to contact page
header('Location: contact.html');
exit;
?>