<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST');
header("Access-Control-Allow-Headers: X-Requested-With");
header('Content-Type: application/json');

$voornaam     = $_POST['voornaam'];
$achternaam   = $_POST['achternaam'];
$bedrijfsnaam = $_POST['bedrijfsnaam'];
$email        = $_POST['email'];
$phone        = $_POST['phone'];
$opmerking    = $_POST['opmerking'];
$products     = $_POST['products'];


$products = json_decode($products);
$productsHTML = "<tr><td class='title'>Product Foto:</td><td class='title'>Product Titel:</td><td class='title'>Product url:</td><td class='title'>Product quantity: </td></tr>";
foreach($products as $product){
  $productsHTML .= "<tr><td><img src=".$product->image."/></td><td>".$product->title."</td><td>".$product->url."</td><td>".$product->quantity."</td></tr>";
}

$html = "
<!doctype html>
<html>
  <head>
    <style>
      body{ font-family:sans-serif;font-size:14px; }
      table{ text-align:left; border-collapse:collapse; }
      table td, table th{ border:1px solid #000;padding:5px; }
      .title {font-weight:bold;font-size:14px;}
      .quote-table td{ display:table-cell;vertical-align:middle; }
      .quote-table td.right{ text-align:right;float:none!important; }
      .quote-table td.center { text-align:center; }
      .quote-table td.no-products{ padding:15px 0;color:#666; }
      .quote-table thead{ border-bottom:1px solid #ccc; }
      .quote-table thead td{ font-weight:bold;padding:10px 0; }
      .quote-table tbody td{ padding:10px 0; }
      .quote-table tbody td.title{ padding:10px 15px; }
      .quote-table tbody tr{  border-bottom:1px solid #ddd; }

      .quote-table td.image{ width:75px;text-align:center; }
      .quote-table td a:hover{ color:#000; }
      .quote-table td .options, .quote-table td .variants{ padding-left:15px;font-size:13px; }
      .quote-table td .variants { font-style:italic; }
      .quote-table td .options.no-options{ font-style:italic; }
      .quote-table td .options strong{ padding-top:5px; }
      .quote-table td .options span{ font-style:italic; }
      .quote-table td .quantity input{ float:left;max-width:100px;text-align:center; }
      .quote-table td .cart-product-remove{ float: right;display: inline-block!important;font-size: 18px;vertical-align: middle;line-height: 20px;padding: 10px 0; }
    </style>
  </head>
  <body>
    <h1>Offerte aanvraag</h1><p>Er is een offerte aanvraag gedaan vanuit <strong>$voornaam $achternaam van $bedrijfsnaam</strong>, hieronder de gegevens.</p>
    <br/>
    <h3>Gegevens klant</h3>
    <table width='500'>
      <tbody>
      <tr>
      <td>Voornaam:</td>
      <td>$voornaam</td>
      </tr>
      <tr>
      <td>achternaam:</td>
      <td>$achternaam</td>
      </tr>
      <tr>
      <td>bedrijfsnaam:</td>
      <td>$bedrijfsnaam</td>
      </tr>
      <tr>
      <td>email:</td>
      <td>$email</td>
      </tr>
      <tr>
      <td>telefoonnummer:</td>
      <td>$phone</td>
      </tr>
      <tr>
      <td>opmerking:</td>
      <td>$opmerking</td>
      </tr>
      </tbody>
    </table>
    <br/>
    <h3>Gekozen producten</h3>
    <table width='500'>
    <tbody>
    $productsHTML
    </tbody>
    </table>
  </body>
</html>
";

include("PHPMailer/class.phpmailer.php");
require("PHPMailer/PHPMailerAutoload.php");

$mail = new PHPMailer();
$mail->IsSMTP();

$mail->Host = "localhost";
$mail->SMTPAuth = true;

$mail->Username = "mailer1@api.instijlmedia.nl";  // SMTP username
$mail->Password = "KwKzUV60ps";  // SMTP password

$mail->From = "noreply@instijlmedia.nl";
$mail->FromName = 'jurjen@instijlmedia.nl'; // Shop title

$mail->AddAddress("jurjen@instijlmedia.nl", "test");
// $mail->AddAddress("thijs@instijlmedia.nl", "InStijl Media");
$mail->SMTPDebug = 0;
$mail->WordWrap = 50;
$mail->IsHTML(true);
$mail->Subject = "Offerte aanvraag";

$mail->Body  = $html;

if(!$mail->Send()){
  die('Iets ging mis tijdens het versturen van uw email. Neem alstublieft contact op via de contactpagina.');
}
else{
  die("success");
}

?>
