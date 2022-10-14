<?php
//control check if submit is clicked and true
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");

include("PHPMailer/class.phpmailer.php");
require("PHPMailer/PHPMailerAutoload.php");

$confirmation_url = 'Your_thankyou_page';
// step 6
$firstname = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$date = $_POST['date'];
$time = $_POST['time'];
$information = $_POST['information'];


if (empty($firstname) || empty($email)) {
    header("HTTP/1.1 500 Internal Server Error");
    die('Niet alle verplichte velden zijn ingevuld');
} else {
    $mail = new PHPMailer(true);
    $mail->IsSMTP();
    $mail->Host = "localhost";   // specify main and backup server
    $mail->SMTPAuth = true;     // turn on SMTP authentication
    $mail->Username = "mailer1@api.instijlmedia.nl";  // SMTP username
    $mail->Password = "KwKzUV60ps";  // SMTP password
    $mail->From = 'mailer1@api.instijlmedia.nl';
    $mail->FromName = "customer_company_name";
    $mail->AddAddress("CUSTOM_ADDRESS");
    $mail->SMTPDebug = 0;
    $mail->WordWrap = 50;
    $mail->IsHTML(true);
    $mail->Subject = "Informatie aanvragen";

    
    $mail->Body = "
    <!doctype html>
    <html>
       <head>
           <style>
              table thead tr td { background:#0051BA;color:white; }
              table tr td {padding:5px 10px;}
           </style>
        </head>
    <body>
       <p>Nieuwe offerte aanvraag.</p>
       <br />
       <table>
           <thead>
                <tr><td>KlantInformatie:</td></tr>
           </thead>
           <tr style='background:#EAF2FA;'><td>Naam: </td><td>$firstname</td></tr>
           <tr><td>Telefoonnummer: </td><td>$phone</td></tr>
           <tr style='background:#EAF2FA;'><td>email: </td><td>$email</td></tr>
           <tr><td>Datum: </td><td>$date</td></tr>
           <tr style='background:#EAF2FA;'><td>Tijd: </td><td>$time</td></tr>
        </table>
        <br />
        Opmerking : $information
    </body>
	";

    // Try to send mail, otherwise error message
    if (!$mail->Send()) {
        header("HTTP/1.1 500 Internal Server Error");
        echo "<p>Er is iets foutegegaan met het versturen </p>";
        echo "Error: " . $mail->ErrorInfo;
        exit;
    } else {
        header("Location: ". $confirmation_url);
    }

// Confirmation mail to customer
    $mail->ClearAllRecipients();
    $mail->AddAddress($email);
	$mail->FromName = "customer_company_name";
    $mail->Subject = "Bevestiging van je aanvraag";
    $mail->Body = "<p>Hieronder vindt je de samenvatting van de aanvraag</p>
    <!doctype html>
    <html>
       <head>
           <style>
              table thead tr td { background:#0051BA;color:white; }
              table tr td {padding:5px 10px;}
           </style>
        </head>
    <body>
       <table>
           <thead>
                <tr><td>Jouw informatie:</td></tr>
           </thead>
           <tr style='background:#EAF2FA;'><td>Naam: </td><td>$firstname</td></tr>
           <tr><td>Telefoonnummer: </td><td>$phone</td></tr>
           <tr style='background:#EAF2FA;'><td>email: </td><td>$email</td></tr>
           <tr><td>Datum: </td><td>$date</td></tr>
           <tr style='background:#EAF2FA;'><td>Tijd: </td><td>$time</td></tr>
        </table>
        <br />
        Opmerking : $information
    </body>
	";


        // Try to send mail, otherwise error message
    if (!$mail->Send()) {
        header("HTTP/1.1 500 Internal Server Error");
        echo "<p>Er is iets foutegegaan met het versturen </p>";
        echo "Error: " . $mail->ErrorInfo;
        exit;
    } else {
        header("Location: ". $confirmation_url);
    }

}

?>