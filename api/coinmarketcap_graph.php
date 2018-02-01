<?php
	//Set header
	header('Content-type: application/json');
	//You can allow CORS for local testing... would not recommend for regular use.
	//header('Access-Control-Allow-Origin: *');
	//Get query strings from current url
	parse_str($_SERVER['QUERY_STRING'], $query_strings);

	//Check that there is a coin parameter
	if (array_key_exists('coin', $query_strings)) {
		//Base URL for Graph API
		$url = 'https://graphs2.coinmarketcap.com/currencies/';

		//Add append coin information to url
		$url .= $query_strings['coin'] . '/';

		//if start and end date are provided, append to url
		if (array_key_exists('start', $query_strings) and array_key_exists('end', $query_strings)) {
			$url .= $query_strings['start'] . '/' . $query_strings['end'] . '/';
		}
	 
		//query coinmarketcap api, hide any errors with error control operator
		$data = @file_get_contents($url);

		 //return results
		if ($data == FALSE ) {
			//file_get_contents failed
			echo '{}';
		} else {
			//success!
			echo $data;
		};
	} else {
	//Return empty json
		echo '{}';
	}
?>