<?php

// please only use the fields thata re present in the html form itself for now we have listed all possible ones

$to = "office@example.com";

if (isset($_POST)){

	$subject = "Startuply system email";
	
	if ($_POST['fullname'] ! =''){
		$message = "Fullname: " . $_POST['fullname'];
	} else {
		$message = "First name: " . $_POST['fname'];
		$message = "Last name: " . $_POST['lname'];
	}
	$message .= "<br>Phone: " . $_POST['Phone'];
	$message .= "<br>Website: " . $_POST['website'];
	$message .= "<br>Email: " . $_POST['email'];
	$message .= "<br>Message: " . $_POST['message'];
	
};

$headers  = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=utf-8" . "\r\n";
$headers .= "From: " . $_POST['fullname'] . " <" . $_POST['email'] . ">". "\r\n";

if( mail($to, $subject, $message, $headers) ) {
	echo "ok";
} else {
	echo "error";
}