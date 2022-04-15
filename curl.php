<?

$ch = curl_init();

$username = "info@richcode.ru";
$password = "iyPYpuvNAVYC4+2Y";

$baseURL = "https://rc-portal.richcode.life/nagios/cgi-bin/";
$query = $_REQUEST['query'];
if ($query == "service")
	$cgi = "statusjson";
else
	$cgi = "objectjson";

$encodedQuery = http_build_query($_REQUEST);
$url = $baseURL.$cgi.".cgi?".$encodedQuery;


curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
$return = curl_exec($ch);

curl_close($ch);

echo $return?$return:"{}";
?>
