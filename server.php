<?php

function cors()
{

    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }

    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

        exit(0);
    }
}
include('/usr/share/phpqrcode/qrlib.php');

// FOR POST METHOD
$POST_REQUEST = $_SERVER['REQUEST_URI'];
$GET_REQUEST = $_SERVER['SCRIPT_NAME'];

// FOR GET METHOD
$method = $_SERVER['REQUEST_METHOD'];
// $method = $_SERVER['PHP_SELF'];

// REFERENCE => https://www.php.net/manual/en/reserved.variables.server.php

/*
$indicesServer = array(
    'PHP_SELF',
    'argv',
    'argc',
    'GATEWAY_INTERFACE',
    'SERVER_ADDR',
    'SERVER_NAME',
    'SERVER_SOFTWARE',
    'SERVER_PROTOCOL',
    'REQUEST_METHOD',
    'REQUEST_TIME',
    'REQUEST_TIME_FLOAT',
    'QUERY_STRING',
    'DOCUMENT_ROOT',
    'HTTP_ACCEPT',
    'HTTP_ACCEPT_CHARSET',
    'HTTP_ACCEPT_ENCODING',
    'HTTP_ACCEPT_LANGUAGE',
    'HTTP_CONNECTION',
    'HTTP_HOST',
    'HTTP_REFERER',
    'HTTP_USER_AGENT',
    'HTTPS',
    'REMOTE_ADDR',
    'REMOTE_HOST',
    'REMOTE_PORT',
    'REMOTE_USER',
    'REDIRECT_REMOTE_USER',
    'SCRIPT_FILENAME',
    'SERVER_ADMIN',
    'SERVER_PORT',
    'SERVER_SIGNATURE',
    'PATH_TRANSLATED',
    'SCRIPT_NAME',
    'REQUEST_URI',
    'PHP_AUTH_DIGEST',
    'PHP_AUTH_USER',
    'PHP_AUTH_PW',
    'AUTH_TYPE',
    'PATH_INFO',
    'ORIG_PATH_INFO'
);
*/

/*
echo '<table cellpadding="10">';
foreach ($indicesServer as $arg) {
    if (isset($_SERVER[$arg]))
        echo '<tr><td>' . $arg . '</td><td>' . $_SERVER[$arg] . '</td></tr>';
    else
        echo '<tr><td>' . $arg . '</td><td>-</td></tr>';
}
echo '</table>';
*/

cors();

switch ($method) {
    case "GET":
        switch ($GET_REQUEST) {
            case '/numToWordRupee':

                $amount = $_GET["amount"];

                $response = new \stdClass();

                if (strlen($amount) > 15) {
                    $word = "Unsupported Digit Count";
                } else {
                    $word = numberToWords($amount);
                }

                $response->word = $word;
                $JSON = json_encode($response);
                echo $JSON;

                break;

            case '/md5sum':

                $string = $_GET["string"];

                $response = new \stdClass();

                $checksum = md5Algo($string);

                $response->checksum = $checksum;
                $JSON = json_encode($response);
                echo $JSON;
                break;

            case '/captchaGeneration':
                $string = $_GET["string"];

                $response = new \stdClass();

                $captcha_message = generateCaptcha($string);

                $response->return_message = "Captcha Generation Success";
                $JSON = json_encode($response);
                echo $JSON;
                break;

            case '/otpGeneration':
                $type = $_GET["type"];
                $length = $_GET["length"];

                $response = new \stdClass();

                $randomOTP = randomOTP($type, $length);

                $response->randomOTP = $randomOTP;
                $JSON = json_encode($response);
                echo $JSON;
                break;

            default:
                http_response_code(404);
                echo "None";
                break;
        }
        break;
    case "POST":
        switch ($POST_REQUEST) {
            case '/dateDiff':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $INPUT_DATA = $input["data"]["inputData"];

                $fromDate = intval($INPUT_DATA["fromDate"]);
                $fromMonth = intval($INPUT_DATA["fromMonth"]);
                $fromYear = intval($INPUT_DATA["fromYear"]);
                $fromHour = intval($INPUT_DATA["fromHour"]);
                $fromMinute = intval($INPUT_DATA["fromMinute"]);
                $fromSecond = intval($INPUT_DATA["fromSecond"]);
                $toDate = intval($INPUT_DATA["toDate"]);
                $toMonth = intval($INPUT_DATA["toMonth"]);
                $toYear = intval($INPUT_DATA["toYear"]);
                $toHour = intval($INPUT_DATA["toHour"]);
                $toMinute = intval($INPUT_DATA["toMinute"]);
                $toSecond = intval($INPUT_DATA["toSecond"]);

                $FROM_DATE = sprintf($fromYear . "-" . $fromMonth . "-" . $fromDate . " " . $fromHour . ":" . $fromMinute . ":" . $fromSecond);
                $TO_DATE = sprintf($toYear . "-" . $toMonth . "-" . $toDate . " " . $toHour . ":" . $toMinute . ":" . $toSecond);

                $SECONDS_DATA = abs(strtotime($FROM_DATE) - strtotime($TO_DATE));

                // CALCULATE DAYS AND REMOVE THE DAYS FROM SECONDS_DATA
                $DAYS_DATA = floor($SECONDS_DATA / 86400); // 24 * 60 * 60
                $SECONDS_DATA = $SECONDS_DATA - $DAYS_DATA * 86400;

                // CALCULATE HOURS AND REMOVE HOURS FROM SECONDS_DATA
                $hours = floor($SECONDS_DATA / 3600); // 60 * 60
                $SECONDS_DATA = $SECONDS_DATA - $hours * 3600;

                // CALCULATE MINUTES AND REMOVE SECONDS FROM SECONDS_DATA
                $minutes = floor($SECONDS_DATA / 60) % 60; // HOW MANY MINUTES 140 - 2mins
                $SECONDS_DATA = $SECONDS_DATA - $minutes * 60;

                // LEFTED SECONDS
                $seconds = $SECONDS_DATA % 60;

                // CONVERT DAYS TO YEAR:MONTH:DAYS
                $years = 0;
                $months = 0;
                $days = 0;
                while ($DAYS_DATA) {
                    if ($DAYS_DATA >= 365) {
                        $years += 1;
                        $DAYS_DATA = $DAYS_DATA - 365;
                    } else if ($DAYS_DATA >= 30) {
                        $months += 1;
                        $DAYS_DATA = $DAYS_DATA - 30;
                    } else {
                        $days += 1;
                        $DAYS_DATA = $DAYS_DATA - 1;
                    }
                }

                $response = new \stdClass();

                $response->dateDiff = sprintf($years . " Years " . $months . " Months " . $days . " Days " . $hours . " Hours " . $minutes . " Minutes " . $seconds . " Seconds ");
                $JSON = json_encode($response);
                echo $JSON;

                break;

            case '/setTheory':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $SET_A_LIST = $input["data"]["setAList"];
                $SET_B_LIST = $input["data"]["setBList"];

                $union = $SET_A_LIST;
                $unionAll = $SET_A_LIST;
                for ($index = 0; $index < count($SET_B_LIST); $index++) {
                    $element = $SET_B_LIST[$index];
                    if (!in_array($element, $union, true))
                        array_push($union, $element); // UNION
                    array_push($unionAll, $element); // UNION ALL
                }

                $intersection = [];
                $AminusB = [];

                for ($index = 0; $index < count($SET_A_LIST); $index++) {
                    $element = $SET_A_LIST[$index];
                    if (in_array($element, $SET_B_LIST, true))
                        array_push($intersection, $element); // INTERSECTION
                    if (!in_array($element, $SET_B_LIST, true))
                        array_push($AminusB, $element); // A-B
                }

                $BminusA = [];
                for ($index = 0; $index < count($SET_B_LIST); $index++) {
                    $element = $SET_B_LIST[$index];
                    if (!in_array($element, $SET_A_LIST, true))
                        array_push($BminusA, $element);
                }

                // $AminusB = array_filter(
                //     $SET_A_LIST,
                //     function ($key) use ($SET_B_LIST) {
                //         if (!in_array($key, $SET_B_LIST))
                //             return $key;
                //     }
                // );

                $response = new \stdClass();
                $response->union = $union;
                $response->unionAll = $unionAll;
                $response->intersection = $intersection;
                $response->AminusB = $AminusB;
                $response->BminusA = $BminusA;
                $JSON = json_encode($response);
                echo $JSON;

                break;

            case '/matrixOperation':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $matrix = $input["data"]["matrix"];

                // TRANSPORSE OF MATRIX
                $transporse = [];
                for ($row = 0; $row < count($matrix[0]); $row++) {
                    for ($col = 0; $col < count($matrix); $col++) {
                        $transporse[$col][$row] = $matrix[$row][$col];
                    }
                }

                // LOWER LEFT TRIANGULAR
                $lowerLeft = [];
                for ($row = 0; $row < count($matrix); $row++) {
                    for ($col = 0; $col < count($matrix[0]); $col++) {
                        if ($row >= count($matrix[0]))
                            $lowerLeft[$row][$col] = null;
                        else if ($row >= $col)
                            $lowerLeft[$row][$col] = $matrix[$row][$col];
                        else
                            $lowerLeft[$row][$col] = null;
                    }
                }

                // LOWER RIGHT TRIANGULAR
                $lowerRight = [];
                for ($row = 0; $row < count($matrix); $row++) {
                    $condition = count($matrix[0]) - $row - 1;
                    for ($col = 0; $col < count($matrix[0]); $col++) {
                        if ($row >= count($matrix[0]))
                            $lowerRight[$row][$col] = null;
                        else if ($col >= $condition)
                            $lowerRight[$row][$col] = $matrix[$row][$col];
                        else
                            $lowerRight[$row][$col] = null;
                    }
                }

                // UPPER LEFT TRIANGULAR
                $upperLeft = [];
                for ($row = 0; $row < count($matrix); $row++) {
                    for ($col = 0; $col < count($matrix[0]); $col++) {
                        if ($col >= count($matrix))
                            $upperLeft[$row][$col] = null;
                        else if ($row <= $col)
                            $upperLeft[$row][$col] = $matrix[$row][$col];
                        else
                            $upperLeft[$row][$col] = null;
                    }
                }

                // UPPER RIGHT TRIANGULAR
                $upperRight = [];
                $jStart = count($matrix[0]) > count($matrix) ? count($matrix[0]) - count($matrix) : 0;
                for ($row = 0; $row < count($matrix); $row++) {
                    $condition = count($matrix[0]) - $row - 1;
                    for ($col = 0; $col < count($matrix[0]); $col++) {
                        // if ($col >= count($matrix)) return null
                        if ($col >= $jStart && $col <= $condition)
                            $upperRight[$row][$col] = $matrix[$row][$col];
                        else
                            $upperRight[$row][$col] = null;
                    }
                }

                $response = new \stdClass();

                $response->transporse = $transporse;
                $response->lowerLeft = $lowerLeft;
                $response->lowerRight = $lowerRight;
                $response->upperLeft = $upperLeft;
                $response->upperRight = $upperRight;
                $JSON = json_encode($response);
                echo $JSON;

                break;

            case '/rsaEncDec':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $type = $input["data"]["type"];
                $response = new \stdClass();

                // GENERATE PUBLIC AND PRIVAT KEY VALUE PAIR RANDOMISED

                if ($type === "Encryption") {
                    $inputString = $input["data"]["inputString"];

                    $PUBLIC_PRIVATE = GENERATE_KEY_PAIR_RSA();
                    $public = $PUBLIC_PRIVATE[0];
                    $private = $PUBLIC_PRIVATE[1];

                    // ENCRYPT THE MESSAGE USING PUBLIC KEY
                    $ENCRYPTED_ARRAY = ENCRYPT_RSA($public, $inputString);

                    $response->PUBLIC_KEY = $public;
                    $response->PRIVATE_KEY = $private;
                    $response->ORIGINAL_TEXT = $inputString;
                    $response->ENCRYPTED_MESSAGE = $ENCRYPTED_ARRAY;
                } else {
                    $encryptedArray = $input['data']['encryptedArray'];
                    $privateKeyArray = $input['data']['privateKeyArray'];

                    # DECRYPT THE MESSAGE USING PUBLIC KEY
                    $DECRYPTED_TEXT = DECRYPT_RSA($privateKeyArray, $encryptedArray);

                    $response->ORIGINAL_TEXT = $DECRYPTED_TEXT;
                }


                $JSON = json_encode($response);
                echo $JSON;

                break;

            case '/barCode':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $barCodeString = $input['data']['barCodeString'];
                $barCodeHeight = $input['data']['barCodeHeight'];
                $barCodeThickness = $input['data']['barCodeThickness'];
                $barCodeQuietZone = $input['data']['barCodeQuietZone'];

                if ($barCodeQuietZone == "true")
                    $barCodeQuietZone = true;
                else
                    $barCodeQuietZone = false;

                generateBarCode(
                    $barCodeString,
                    $barCodeHeight,
                    $barCodeThickness,
                    $barCodeQuietZone
                );

                $response = new \stdClass();
                $response->fileName = "Barcode.png";

                $JSON = json_encode($response);
                echo $JSON;

                break;

            case '/qrCode':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $qrCodeString = $input['data']['qrCodeString'];

                QRcode::png($qrCodeString, "QRcode.png", "L", "6");
                $response = new \stdClass();
                $response->response_message = "QR-Code generation Success";

                $JSON = json_encode($response);
                echo $JSON;

                break;

            case '/electricalCalculator':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $value = $input["data"]["value"];
                $currentTypeIndex = intval($input["data"]["currentTypeIndex"]);

                $response = new \stdClass();
                if ($currentTypeIndex === 1) {
                    $current = floatval($value["current"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $currentUnit = $value["current"][1];
                    $voltageUnit = $value["voltage"][1];

                    if ($currentUnit === "mA") $current = $current / 1000;
                    elseif ($currentUnit === "kA") $current = $current * 1000;
                    else $current = $current;

                    if ($voltageUnit === "mV") $voltage = $voltage / 1000;
                    elseif ($voltageUnit === "kV") $voltage = $voltage * 1000;
                    else $voltage = $voltage;

                    $power = $current * $voltage / 1000;
                    $response->result->POWER_IN_KILOWATTS = sprintf("%g kW", $power);
                    $response->result->POWER_IN_WATTS = sprintf("%g W", $power * 1000);
                    $response->result->POWER_IN_MILLIWATTS = sprintf("%g mW", $power * 1000 * 1000);
                } elseif ($currentTypeIndex === 2) {
                    $current = floatval($value["current"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $response->result->POWER_IN_KILOVOLT_AMPS = sprintf("%g kVA", $current * $voltage / 1000);
                } elseif ($currentTypeIndex === 3) {
                    $current = floatval($value["current"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $response->result->POWER_IN_VOLT_AMPS = sprintf("%g VA", $current * $voltage);
                } elseif ($currentTypeIndex === 4) {
                    $current = floatval($value["current"][0]);
                    $ohms = floatval($value["ohms"][0]);
                    $response->result->VOLTAGE_IN_VOLTS = sprintf("%g V", $current * $ohms);
                } elseif ($currentTypeIndex === 5) {
                    $current = floatval($value["current"][0]);
                    $power = floatval($value["power"][0]);
                    $response->result->VOLTAGE_IN_VOLTS = sprintf("%g V", $power / $current);
                } elseif ($currentTypeIndex === 6) {
                    $current = floatval($value["current"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->MILLI_AMPERE_HOURS = sprintf("%g mAh", $current * $duration * 1000);
                } elseif ($currentTypeIndex === 7) {
                    $power = floatval($value["power"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $voltageUnit = $value["voltage"][1];
                    if ($voltageUnit === "mV") $voltage = $voltage / 1000;
                    elseif ($voltageUnit === "kV") $voltage = $voltage * 1000;
                    else $voltage = $voltage;
                    $amps = (1000 * $power) / $voltage;

                    $response->result->CURRENT_IN_KILO_AMPS = sprintf("%g kA", $amps / 1000);
                    $response->result->CURRENT_IN_AMPS = sprintf("%g A", $amps);
                    $response->result->CURRENT_IN_MILLI_AMPS = sprintf("%g mA", $amps * 1000);
                } elseif ($currentTypeIndex === 8) {
                    $power = floatval($value["power"][0]);
                    $powerFactor = floatval($value["powerFactor"][0]);
                    if ($powerFactor < 0 || $powerFactor > 1)
                        $response->result->OUT_OF_RANGE = "Enter Power Factor Between 0 to 1 (inclusive)";
                    $response->result->APPARENT_POWER_IN_KILOVOLT_AMPS = sprintf("%g kVA", $power / $powerFactor);
                } elseif ($currentTypeIndex === 9) {
                    $power = floatval($value["power"][0]);
                    $powerFactor = floatval($value["powerFactor"][0]);
                    if ($powerFactor < 0 || $powerFactor > 1)
                        $response->result->OUT_OF_RANGE = "Enter Power Factor Between 0 to 1 (inclusive)";
                    $response->result->APPARENT_POWER_IN_VOLT_AMPS = sprintf("%g VA", (1000 * $power) / $powerFactor);
                } elseif ($currentTypeIndex === 10) {
                    $power = floatval($value["power"][0]);
                    $current = floatval($value["current"][0]);
                    $response->result->VOLTAGE_IN_VOLTS = sprintf("%g V", (1000 * $power) / $current);
                } elseif ($currentTypeIndex === 11) {
                    $power = floatval($value["power"][0]);
                    $response->result->POWER_IN_WATTS = sprintf("%g W", 1000 * $power);
                } elseif ($currentTypeIndex === 12) {
                    $power = floatval($value["power"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->ENERGY_IN_JOULES = sprintf("%g J", 1000 * $power * $duration);
                } elseif ($currentTypeIndex === 13) {
                    $power = floatval($value["power"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->ENERGY_IN_WATT_HOUR = sprintf("%g Wh", 1000 * $power * $duration);
                } elseif ($currentTypeIndex === 14) {
                    $power = floatval($value["power"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $response->result->CURRENT_IN_AMPS = sprintf("%g A", (1000 * $power) / $voltage);
                } elseif ($currentTypeIndex === 15) {
                    $power = floatval($value["power"][0]);
                    $powerFactor = floatval($value["powerFactor"][0]);
                    if ($powerFactor < 0 || $powerFactor > 1)
                        $response->result->OUT_OF_RANGE = "Enter Power Factor Between 0 to 1 (inclusive)";
                    $response->result->REAL_POWER_IN_KILO_WATTS = sprintf("%g kW", $power * $powerFactor);
                } elseif ($currentTypeIndex === 16) {
                    $power = floatval($value["power"][0]);
                    $response->result->APPARENT_POWER_IN_VOLT_AMPERE = sprintf("%g VA", 1000 * $power);
                } elseif ($currentTypeIndex === 17) {
                    $power = floatval($value["power"][0]);
                    $current = floatval($value["current"][0]);
                    $phaseNumber = intval($value["selections"]["PhaseNumber"]);
                    if ($phaseNumber === 1) $response->result->VOLTAGE_LINE_TO_NEUTRAL = sprintf("%g V", ($power * 1000) / $current);
                    elseif ($phaseNumber === 2) $response->result->VOLTAGE_LINE_TO_NEUTRAL = sprintf("%g V", ($power * 1000) / ($current * 2));
                    else $response->result->VOLTAGE_LINE_TO_LINE = sprintf("%g V", ($power * 1000) / ($current * sqrt(3)));
                } elseif ($currentTypeIndex === 18) {
                    $power = floatval($value["power"][0]);
                    $powerFactor = floatval($value["powerFactor"][0]);
                    if ($powerFactor < 0 || $powerFactor > 1)
                        $response->result->OUT_OF_RANGE = "Enter Power Factor Between 0 to 1 (inclusive)";
                    $response->result->REAL_POWER_IN_WATTS = sprintf("%g W", 1000 * $power * $powerFactor);
                } elseif ($currentTypeIndex === 19) {
                    $power = floatval($value["power"][0]);
                    $response->result->JOULES_PER_SECOND = sprintf("%g J/s", 1000 * $power);
                } elseif ($currentTypeIndex === 20) {
                    $power = floatval($value["power"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $response->result->CURRENT_IN_AMPS = sprintf("%g A", $power / $voltage);
                } elseif ($currentTypeIndex === 21) {
                    $power = floatval($value["power"][0]);
                    $powerFactor = floatval($value["powerFactor"][0]);
                    if ($powerFactor < 0 || $powerFactor > 1)
                        $response->result->OUT_OF_RANGE = "Enter Power Factor Between 0 to 1 (inclusive)";
                    $response->result->REAL_POWER_IN_KILO_WATTS = sprintf("%g kW", ($power * $powerFactor) / 1000);
                } elseif ($currentTypeIndex === 22) {
                    $power = floatval($value["power"][0]);
                    $response->result->APPARENT_POWER_IN_KILO_VOLT_AMPERE = sprintf("%g kVA", $power / 1000);
                } elseif ($currentTypeIndex === 23) {
                    $power = floatval($value["power"][0]);
                    $current = floatval($value["current"][0]);
                    $phaseNumber = intval($value["selections"]["PhaseNumber"]);
                    if ($phaseNumber === 1) $response->result->VOLTAGE_LINE_TO_NEUTRAL = sprintf("%g V", $power / $current);
                    elseif ($phaseNumber === 2) $response->result->VOLTAGE_LINE_TO_NEUTRAL = sprintf("%g V", $power / ($current * 2));
                    else $response->result->VOLTAGE_LINE_TO_LINE = sprintf("%g V", $power / ($current * sqrt(3)));
                } elseif ($currentTypeIndex === 24) {
                    $power = floatval($value["power"][0]);
                    $powerFactor = floatval($value["powerFactor"][0]);

                    if ($powerFactor < 0 || $powerFactor > 1)
                        $response->result->OUT_OF_RANGE = "Enter Power Factor Between 0 to 1 (inclusive)";
                    $response->result->REAL_POWER_IN_WATTS = sprintf("%g W", $power * $powerFactor);
                } elseif ($currentTypeIndex === 25) {
                    $power = floatval($value["power"][0]);
                    $response->result->JOULES_PER_HOUR = sprintf("%g J/h", $power * 3600);
                    $response->result->JOULES_PER_SECOND = sprintf("%g J/s", $power);
                } elseif ($currentTypeIndex === 26) {
                    $voltage = floatval($value["voltage"][0]);
                    $ohms = floatval($value["ohms"][0]);
                    $response->result->CURRENT_IN_AMPS = sprintf("%g A", $voltage / $ohms);
                } elseif ($currentTypeIndex === 27) {
                    $voltage = floatval($value["voltage"][0]);
                    $power = floatval($value["power"][0]);
                    $response->result->CURRENT_IN_AMPS = sprintf("%g A", $power / $voltage);
                } elseif ($currentTypeIndex === 28) {
                    $voltage = floatval($value["voltage"][0]);
                    $current = floatval($value["current"][0]);
                    $response->result->POWER_IN_KILOWATTS = sprintf("%g kW", ($voltage * $current) / 1000);
                } elseif ($currentTypeIndex === 29) {
                    $voltage = floatval($value["voltage"][0]);
                    $current = floatval($value["current"][0]);
                    $phaseNumber = intval($value["selections"]["PhaseNumber"]);
                    if ($phaseNumber === 1) $response->result->POWER_IN_KILO_VOLT_AMPERE_SINGLE_PHASE = sprintf("%g kVA", ($voltage * $current) / 1000);
                    elseif ($phaseNumber === 2) $response->result->POWER_IN_KILO_VOLT_AMPERE_BI_PHASE = sprintf("%g kVA", (2 * $voltage * $current) / 1000);
                    else $response->result->POWER_IN_KILO_VOLT_AMPERE_THREE_PHASE = sprintf("%g kVA", (sqrt(3) * $voltage * $current) / 1000);
                } elseif ($currentTypeIndex === 30) {
                    $voltage = floatval($value["voltage"][0]);
                    $current = floatval($value["current"][0]);
                    $phaseNumber = intval($value["selections"]["PhaseNumber"]);

                    if ($phaseNumber === 1) $response->result->POWER_IN_VOLT_AMPERE_SINGLE_PHASE = sprintf("%g VA", $voltage * $current);
                    elseif ($phaseNumber === 2) $response->result->POWER_IN_VOLT_AMPERE_BI_PHASE = sprintf("%g VA", 2 * $voltage * $current);
                    else $response->result->POWER_IN_VOLT_AMPERE_THREE_PHASE = sprintf("%g VA", sqrt(3) * $voltage * $current);
                } elseif ($currentTypeIndex === 31) {
                    $voltage = floatval($value["voltage"][0]);
                    $current = floatval($value["current"][0]);
                    $response->result->POWER_IN_WATTS = sprintf("%g W", $voltage * $current);
                } elseif ($currentTypeIndex === 32) {
                    $voltage = floatval($value["voltage"][0]);
                    $coulombs = floatval($value["coulombs"][0]);
                    $response->result->ENERGY_IN_JOULES = sprintf("%g J", $voltage * $coulombs);
                } elseif ($currentTypeIndex === 33) {
                    $power = floatval($value["power"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $voltageUnit = $value["voltage"][1];

                    if ($voltageUnit === "mV") $voltage = $voltage / 1000;
                    elseif ($voltageUnit === "kV") $voltage = $voltage * 1000;
                    else $voltage = $voltage;

                    $amps = $power / $voltage;
                    $response->result->CURRENT_IN_KILO_AMPS =  sprintf("%g kA", $amps / 1000);
                    $response->result->CURRENT_IN_AMPS =  sprintf("%g A", $amps);
                    $response->result->CURRENT_IN_MILLI_AMPS =  sprintf("%g mA", $amps * 1000);
                } elseif ($currentTypeIndex === 34) {
                    $power = floatval($value["power"][0]);
                    $response->result->POWER_IN_KILO_WATT = sprintf("%g kW", $power / 1000);
                } elseif ($currentTypeIndex === 35) {
                    $power = floatval($value["power"][0]);
                    $powerFactor = floatval($value["powerFactor"][0]);
                    if ($powerFactor < 0 || $powerFactor > 1)
                        $response->result->OUT_OF_RANGE = "Enter Power Factor Between 0 to 1 (inclusive)";
                    $response->result->APPARENT_POWER_IN_KILO_VOLT_AMPERE = sprintf("%g kVA", $power / (1000 * $powerFactor));
                } elseif ($currentTypeIndex === 36) {
                    $power = floatval($value["power"][0]);
                    $powerFactor = floatval($value["powerFactor"][0]);
                    if ($powerFactor < 0 || $powerFactor > 1)
                        $response->result->OUT_OF_RANGE = "Enter Power Factor Between 0 to 1 (inclusive)";
                    $response->result->APPARENT_POWER_IN_VOLT_AMPERE = sprintf("%g VA", $power / $powerFactor);
                } elseif ($currentTypeIndex === 37) {
                    $power = floatval($value["power"][0]);
                    $current = floatval($value["current"][0]);
                    $response->result->VOLTAGE_IN_VOLTS = sprintf("%g V", $power / $current);
                } elseif ($currentTypeIndex === 38) {
                    $power = floatval($value["power"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->ENERGY_IN_JOULES = sprintf("%g J", $power * $duration);
                } elseif ($currentTypeIndex === 39) {
                    $power = floatval($value["power"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->ENERGY_IN_WATT_HOUR = sprintf("%g Wh", $power * $duration);
                } elseif ($currentTypeIndex === 40) {
                    $joules = floatval($value["joules"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $response->result->CURRENT_IN_AMPS = sprintf("%g A", $joules / $voltage);
                } elseif ($currentTypeIndex === 41) {
                    $joules = floatval($value["joules"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->POWER_IN_KILO_WATT = sprintf("%g kW", $joules / (1000 * $duration));
                } elseif ($currentTypeIndex === 42) {
                    $joules = floatval($value["joules"][0]);
                    $response->result->POWER_IN_KILO_VOLT_AMPERE = sprintf("%g kVA", $joules * 0.001);
                } elseif ($currentTypeIndex === 43) {
                    $joules = floatval($value["joules"][0]);
                    $response->result->POWER_IN_VOLT_AMPS = sprintf("%g VA", $joules);
                } elseif ($currentTypeIndex === 44) {
                    $joules = floatval($value["joules"][0]);
                    $coulombs = floatval($value["coulombs"][0]);
                    $response->result->VOLTAGE_IN_VOLTS = sprintf("%g V", $joules / $coulombs);
                } elseif ($currentTypeIndex === 45) {
                    $joules = floatval($value["joules"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->POWER_IN_WATTS = sprintf("%g W", $joules / $duration);
                } elseif ($currentTypeIndex === 46) {
                    $joules = floatval($value["joules"][0]);
                    $response->result->ENERGY_IN_WATT_HOUR = sprintf("%g Wh", $joules / 3600);
                } elseif ($currentTypeIndex === 47) {
                    $mAh = floatval($value["mAh"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->CURRENT_IN_AMPS = sprintf("%g A", $mAh / ($duration * 1000));
                } elseif ($currentTypeIndex === 48) {
                    $mAh = floatval($value["mAh"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $response->result->ENERGY_IN_WATT_HOUR = sprintf("%g Wh", ($mAh * $voltage) / 1000);
                } elseif ($currentTypeIndex === 49) {
                    $energy = floatval($value["energy"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->POWER_IN_KILO_WATT = sprintf("%g kW", $energy / (1000 * $duration));
                } elseif ($currentTypeIndex === 50) {
                    $energy = floatval($value["energy"][0]);
                    $duration = floatval($value["duration"][0]);
                    $response->result->POWER_IN_WATT = sprintf("%g W", $energy / $duration);
                } elseif ($currentTypeIndex === 51) {
                    $energy = floatval($value["energy"][0]);
                    $response->result->JOULE = sprintf("%g J", $energy * 3600);
                } elseif ($currentTypeIndex === 52) {
                    $energy = floatval($value["energy"][0]);
                    $voltage = floatval($value["voltage"][0]);
                    $response->result->ELECTRICAL_CHARGE_IN_MILLIAMP_HOURS = sprintf("%g mAh", (1000 * $energy) / $voltage);
                }

                $JSON = json_encode($response);
                echo $JSON;
                break;

            case '/mathLog1':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $number = $input["data"]["number"];
                $base = $input["data"]["base"];
                $method = $input["data"]["method"];

                $response = new \stdClass();

                if ($method == "Logarithm") {

                    $COMMON_LOG = COMMON_LOG_FUNC($number);
                    $NATURAL_LOG = $COMMON_LOG / 0.4342944819032518; // MATH.LOG10E or Math.log10(2.71828) or COMMON_LOG_FUNC(2.71828, 10)
                    $BINARY_LOG = $COMMON_LOG / COMMON_LOG_FUNC(2); // CALCULATE NATURAL LOG FOR NUMBER / NATURAL LOG FOR 2 
                    $CUSTOM_BASE_LOG = $COMMON_LOG / COMMON_LOG_FUNC($base); // FOR CUSTOM log 29 base 8 --> NATURAL_LOG 29 / NATURAL_LOG 8

                    $COMMON_LOG = checkInfinityAndConvertToString($COMMON_LOG);
                    $NATURAL_LOG = checkInfinityAndConvertToString($NATURAL_LOG);
                    $BINARY_LOG = checkInfinityAndConvertToString($BINARY_LOG);
                    $CUSTOM_BASE_LOG = checkInfinityAndConvertToString($CUSTOM_BASE_LOG);

                    $response->result->COMMON_LOG = $COMMON_LOG;
                    $response->result->NATURAL_LOG = $NATURAL_LOG;
                    $response->result->BINARY_LOG = $BINARY_LOG;
                    $response->result->CUSTOM_BASE_LOG = $CUSTOM_BASE_LOG;

                    $JSON = json_encode($response);
                    echo $JSON;
                } else {
                    // FOR ANTI LOG
                    $COMMON_ANTI_LOG = 10 ** $number;
                    $NATURAL_ANTI_LOG = $COMMON_ANTI_LOG / 0.4342944819032518;
                    $BINARY_ANTI_LOG = 2 ** $number;
                    $CUSTOM_BASE_ANTI_LOG = $base ** $number;

                    $COMMON_ANTI_LOG = checkInfinityAndConvertToString($COMMON_ANTI_LOG);
                    $NATURAL_ANTI_LOG = checkInfinityAndConvertToString($NATURAL_ANTI_LOG);
                    $BINARY_ANTI_LOG = checkInfinityAndConvertToString($BINARY_ANTI_LOG);
                    $CUSTOM_BASE_ANTI_LOG = checkInfinityAndConvertToString($CUSTOM_BASE_ANTI_LOG);

                    $response->result->COMMON_ANTI_LOG = $COMMON_ANTI_LOG;
                    $response->result->NATURAL_ANTI_LOG = $NATURAL_ANTI_LOG;
                    $response->result->BINARY_ANTI_LOG = $BINARY_ANTI_LOG;
                    $response->result->CUSTOM_BASE_ANTI_LOG = $CUSTOM_BASE_ANTI_LOG;
                    $JSON = json_encode($response);
                    echo $JSON;
                }
                break;
            case '/mathLog2':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $inputNumber = $input["data"]["inputNumber"];
                $nthRoot = $input["data"]["nthRoot"];
                $method = $input["data"]["method"];

                $response = new \stdClass();

                // GCF AND LCM
                if ($method === "Method-1") {
                    // TYPECASE ALL VALUES TO INT
                    $inputNumber = array_map('intval', $inputNumber);
                    $LCM = $inputNumber[0];
                    for ($i = 1; $i < count($inputNumber); $i++) {
                        $LCM = LCM_FUNC($inputNumber[$i], $LCM);
                    }
                    $GCF = $inputNumber[0];
                    for ($i = 1; $i < count($inputNumber); $i++) {
                        $GCF = GCF_FUNC($inputNumber[$i], $GCF);
                        if ($GCF === 1) break; // IF GCF OF ANY IS 1 - IT WILL BE THE GCF
                    }
                    $response->result = sprintf("LCM = " . $LCM . "  GCF = " . $GCF);
                    $JSON = json_encode($response);
                    echo $JSON;
                } else if ($method === "Method-2") {
                    // TYPECASE TO INT
                    $inputNumber = floatval($inputNumber);
                    $negativeFlag = false;

                    if ($inputNumber < 0) {
                        $negativeFlag = true;
                        $inputNumber = $inputNumber * -1;
                    }

                    $SQRT = NTH_ROOT_FUNC($inputNumber, 2);
                    $CBRT = CBRT_FUNC($inputNumber);

                    if ($negativeFlag) $SQRT = `${SQRT}i`;
                    if ($negativeFlag) $CBRT = `-${CBRT}`;

                    $response->result = sprintf("SQRT = " . $SQRT . "  CBRT = " . $CBRT);
                    $JSON = json_encode($response);
                    echo $JSON;
                } else {
                    $NTHROOT = NTH_ROOT_FUNC($inputNumber, $nthRoot);

                    $response->result = sprintf("NTHROOT = " . $NTHROOT);
                    $JSON = json_encode($response);
                    echo $JSON;
                }
                break;
            case '/mathLog3':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $number = $input["data"]["number"];
                $method = $input["data"]["method"];

                $number = floatval($number);

                $PI = 3.14159265358979323846;
                $response = new \stdClass();
                if ($method == "Radian") {
                    $SIN = sinRadianFunc($number);
                    $COS = sinRadianFunc(($PI / 2) - $number);
                    $TAN = $SIN / $COS;
                    $COSEC = 1 / $SIN;
                    $SEC = 1 / $COS;
                    $COT = 1 / $TAN;
                    $response->result = sprintf("SIN = " . $SIN . "  COS = " . $COS . "  TAN = " . $TAN . "  COSEC = " . $COSEC . "  SEC = " . $SEC . "  COT = " . $COT);
                    $JSON = json_encode($response);
                    echo $JSON;
                } else if ($method == "Degree") {
                    $number2 = $number;
                    $number2 *= pi() / 180;

                    $SIN_DEGREE = sinRadianFunc($number2);
                    $COS_DEGREE = sinRadianFunc($PI / 2 - $number2);
                    $TAN_DEGREE = $SIN_DEGREE / $COS_DEGREE;
                    $COSEC_DEGREE = 1 / $SIN_DEGREE;
                    $SEC_DEGREE = 1 / $COS_DEGREE;
                    $COT_DEGREE = 1 / $TAN_DEGREE;

                    $response->result = sprintf("SIN_DEGREE = " . $SIN_DEGREE . "  COS_DEGREE = " . $COS_DEGREE . "  TAN_DEGREE = " . $TAN_DEGREE . "  COSEC_DEGREE = " . $COSEC_DEGREE . "  SEC_DEGREE = " . $SEC_DEGREE . "  COT_DEGREE = " . $COT_DEGREE);
                    $JSON = json_encode($response);
                    echo $JSON;
                } else {
                    $ARC_SIN_RADIAN = asin($number);
                    $ARC_COS_RADIAN = acos($number);
                    $ARC_TAN_RADIAN = atan($number);

                    $number2 = $number;
                    $number2 *= pi() / 180;

                    $ARC_SIN_DEGREE = asin($number2);
                    $ARC_COS_DEGREE = acos($number2);
                    $ARC_TAN_DEGREE = atan($number2);
                    $response->result = sprintf("ARC_SIN_RADIAN = " . $ARC_SIN_RADIAN . "  ARC_COS_RADIAN = " . $ARC_COS_RADIAN . "  ARC_TAN_RADIAN = " . $ARC_TAN_RADIAN . "  ARC_SIN_DEGREE = " . $ARC_SIN_DEGREE . "  ARC_COS_DEGREE = " . $ARC_COS_DEGREE . "  ARC_TAN_DEGREE = " . $ARC_TAN_DEGREE);
                    $JSON = json_encode($response);
                    echo $JSON;
                }
                break;
            case '/statisticsCalculator':
                $request_body = file_get_contents('php://input');
                $input = json_decode($request_body, TRUE); //convert JSON into array

                $inputNumber = $input["data"]["inputNumber"];
                $method = $input["data"]["method"];

                $response = new \stdClass();
                if ($method === "Method-1") {
                    // TYPECASE ALL VALUES TO INT
                    $inputNumber = array_map('intval', $inputNumber);
                    $response->result = STANDARD_DEVIATION_AND_VARIANCE($inputNumber);
                    $JSON = json_encode($response);
                    echo $JSON;
                } else {
                    // FIRST ARRAY VALUE IS FIRST ARRAY INPUT AND TYPECAST TO INT
                    $inputArray1 = $inputNumber[0];
                    $inputArray1 = array_map('intval', $inputArray1);

                    // SECOND ARRAY VALUE IS SECOND ARRAY INPUT AND TYPECAST TO INT
                    $inputArray2 = $inputNumber[1];
                    $inputArray2 = array_map('intval', $inputArray2);

                    $response->result = LINEAR_REGRESSION($inputArray1, $inputArray2);
                    $JSON = json_encode($response);
                    echo $JSON;
                }
                break;

            default:
                http_response_code(404);
                echo "None";
                break;
        }
        break;
    default:
        echo "None";
        break;
}

function numberToWords($number): string
{
    $number = intval($number);
    $words = "";

    $LESS_THAN_TWENTY = [
        "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    $TENTHS_LESS_THAN_HUNDRED = [
        'Zero', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty',
        'Sixty', 'Seventy', 'Eighty', 'Ninety'
    ];

    // IN CASE OF NEGATIVE ADD TO THE WORD AND CONVERT TO POSITIVE
    if ($number < 0) {
        $words .= "Minus ";
        $number = $number * -1;
    }
    $remainder = 0;
    if ($number < 20) {
        $words .= $LESS_THAN_TWENTY[$number];
    } else if ($number < 100) {
        $words .= $TENTHS_LESS_THAN_HUNDRED[intval($number / 10)];
        $remainder = $number % 10;
    } else if ($number < 1000) {
        // RANGING FROM 100 - 999 -- One Hunderd to Nine Hundred and Ninety Nine
        $words .= numberToWords(intval($number / 100)) . " Hundred";
        $remainder = $number % 100;
    } else if ($number < 100000) {
        // RANGING FROM 1,000 - 99,999 -- One Thousand to Ninety Nine Thousand Nine Hundred Ninety Nine
        $words .= numberToWords(intval($number / 1000)) . " Thousand";
        $remainder = $number % 1000;
    } else if ($number < 10000000) {
        // RANGING FROM 1,00,000 - 99,99,999 -- One Lakh to Ninety Nine Lakhs Ninety Nine Thousand Nine Hundred Ninety Nine
        $words .= numberToWords(intval($number / 100000)) . " Lakh";
        $remainder = $number % 100000;
        // } else if ($number < 1000000000) {
    } else if ($number >= 10000000) {
        // RANGING FROM 1,00,00,000 - 99,99,99,999 -- One Crore to Ninety Nine Crores Ninety Nine Lakhs Ninety Nine Thousand Nine Hundred and Ninety Nine
        $words .= numberToWords(intval($number / 10000000)) . " Crore";
        $remainder = $number % 10000000;
    }

    if ($remainder > 0) {
        $words .= " " . numberToWords($remainder);
    }

    return $words;
}

function GENERATE_KEY_PAIR_RSA()
{
    // INITIALISING PRIME RANGE
    $minPrime = 0;
    $maxPrime = 10;

    // GET CATCHED PRIMES
    $j = 0;
    $cached_primes = [];
    for ($i = $minPrime; $i < $maxPrime; $i += 1)
        if (IS_PRIME_RSA($i)) {
            $cached_primes[$j] = $i;
            $j += 1;
        }

    // RANDOM PRIME
    $p = $cached_primes[floor(rand(0, count($cached_primes) - 1))];
    $q = $cached_primes[floor(rand(0, count($cached_primes) - 1))];

    $n = $p * $q;
    $phi = ($p - 1) * ($q - 1);

    $e = floor(rand(1, $phi)); // RANGE FROM 1 to PHI
    $g = GCF_FUNC($e, $phi);

    while ($g != 1) {
        $e = floor(rand() * $phi) + 1;
        $g = GCF_FUNC($e, $phi);
    }

    $d = MULTIPLICATIVE_INVERSE_RSA($e, $phi);
    return [[$e, $n], [$d, $n]];
}

// RSA ENCRYPTION DECRYPTION HELPER FUNCTION
function MULTIPLICATIVE_INVERSE_RSA($e, $phi)
{
    $d = 0;
    $x1 = 0;
    $x2 = 1;
    $y1 = 1;
    $temp_phi = $phi;

    while ($e > 0) {
        $temp1 = intval($temp_phi / $e);
        $temp2 = $temp_phi - $temp1 * $e;
        $temp_phi = $e;
        $e = $temp2;

        $x = $x2 - $temp1 * $x1;
        $y = $d - $temp1 * $y1;

        $x2 = $x1;
        $x1 = $x;
        $d = $y1;
        $y1 = $y;
    }

    if ($temp_phi == 1)
        return $d + $phi;
}

// RSA ENCRYPTION DECRYPTION HELPER FUNCTION
function IS_PRIME_RSA($num)
{
    if ($num == 2) return true;
    if ($num < 2 || $num % 2 == 0) return false;
    for ($n = 3; $n < intval($num ** 0.5) + 2; $n += 2) {
        if ($num % $n == 0) return false;
    }
    return true;
}

// RSA ENCRYPTION DECRYPTION HELPER FUNCTION
function ENCRYPT_RSA($pk, $plaintext)
{
    $key = $pk[0];
    $n = $pk[1];
    $cipher = [];
    for ($char = 0; $char < strlen($plaintext); $char += 1) {
        array_push($cipher, ((ord($plaintext[$char]) ** $key) % $n));
    }
    return $cipher;
}

// RSA ENCRYPTION DECRYPTION HELPER FUNCTION
function DECRYPT_RSA($pk, $ciphertext)
{
    $key = $pk[0];
    $n = $pk[1];
    $aux = [];
    for ($char = 0; $char < count($ciphertext); $char += 1) {
        array_push($aux, strval(($ciphertext[$char] ** $key) % $n));
    }

    $plain = "";
    for ($char2 = 0; $char2 < count($aux); $char2++) {
        $plain .= chr(intval($aux[$char2]));
    }

    return $plain;
}

function md5Algo($string)
{
    class MD5
    {

        private $A = "67452301";
        private $B = "efcdab89";
        private $C = "98badcfe";
        private $D = "10325476";

        private $buffer = "";
        private $length = 0;

        public function pump(string $string)
        {
            return $this->calculate($this->convertToArray($string));
        }

        // Calculate words
        private function calculate(array $words)
        {
            $A = $this->A;
            $B = $this->B;
            $C = $this->C;
            $D = $this->D;

            for ($i = 0; $i <= count($words) / 16 - 1; $i++) {
                $this->A  = $A;
                $this->B  = $B;
                $this->C  = $C;
                $this->D  = $D;

                /* ROUND 1 */
                $this->FF($A, $B, $C, $D, $words[0 + ($i * 16)], 7, "d76aa478");
                $this->FF($D, $A, $B, $C, $words[1 + ($i * 16)], 12, "e8c7b756");
                $this->FF($C, $D, $A, $B, $words[2 + ($i * 16)], 17, "242070db");
                $this->FF($B, $C, $D, $A, $words[3 + ($i * 16)], 22, "c1bdceee");
                $this->FF($A, $B, $C, $D, $words[4 + ($i * 16)], 7, "f57c0faf");
                $this->FF($D, $A, $B, $C, $words[5 + ($i * 16)], 12, "4787c62a");
                $this->FF($C, $D, $A, $B, $words[6 + ($i * 16)], 17, "a8304613");
                $this->FF($B, $C, $D, $A, $words[7 + ($i * 16)], 22, "fd469501");
                $this->FF($A, $B, $C, $D, $words[8 + ($i * 16)], 7, "698098d8");
                $this->FF($D, $A, $B, $C, $words[9 + ($i * 16)], 12, "8b44f7af");
                $this->FF($C, $D, $A, $B, $words[10 + ($i * 16)], 17, "ffff5bb1");
                $this->FF($B, $C, $D, $A, $words[11 + ($i * 16)], 22, "895cd7be");
                $this->FF($A, $B, $C, $D, $words[12 + ($i * 16)], 7, "6b901122");
                $this->FF($D, $A, $B, $C, $words[13 + ($i * 16)], 12, "fd987193");
                $this->FF($C, $D, $A, $B, $words[14 + ($i * 16)], 17, "a679438e");
                $this->FF($B, $C, $D, $A, $words[15 + ($i * 16)], 22, "49b40821");

                /* ROUND 2 */
                $this->GG($A, $B, $C, $D, $words[1 + ($i * 16)], 5, "f61e2562");
                $this->GG($D, $A, $B, $C, $words[6 + ($i * 16)], 9, "c040b340");
                $this->GG($C, $D, $A, $B, $words[11 + ($i * 16)], 14, "265e5a51");
                $this->GG($B, $C, $D, $A, $words[0 + ($i * 16)], 20, "e9b6c7aa");
                $this->GG($A, $B, $C, $D, $words[5 + ($i * 16)], 5, "d62f105d");
                $this->GG($D, $A, $B, $C, $words[10 + ($i * 16)], 9, "2441453");
                $this->GG($C, $D, $A, $B, $words[15 + ($i * 16)], 14, "d8a1e681");
                $this->GG($B, $C, $D, $A, $words[4 + ($i * 16)], 20, "e7d3fbc8");
                $this->GG($A, $B, $C, $D, $words[9 + ($i * 16)], 5, "21e1cde6");
                $this->GG($D, $A, $B, $C, $words[14 + ($i * 16)], 9, "c33707d6");
                $this->GG($C, $D, $A, $B, $words[3 + ($i * 16)], 14, "f4d50d87");
                $this->GG($B, $C, $D, $A, $words[8 + ($i * 16)], 20, "455a14ed");
                $this->GG($A, $B, $C, $D, $words[13 + ($i * 16)], 5, "a9e3e905");
                $this->GG($D, $A, $B, $C, $words[2 + ($i * 16)], 9, "fcefa3f8");
                $this->GG($C, $D, $A, $B, $words[7 + ($i * 16)], 14, "676f02d9");
                $this->GG($B, $C, $D, $A, $words[12 + ($i * 16)], 20, "8d2a4c8a");

                /* ROUND 3 */
                $this->HH($A, $B, $C, $D, $words[5 + ($i * 16)], 4, "fffa3942");
                $this->HH($D, $A, $B, $C, $words[8 + ($i * 16)], 11, "8771f681");
                $this->HH($C, $D, $A, $B, $words[11 + ($i * 16)], 16, "6d9d6122");
                $this->HH($B, $C, $D, $A, $words[14 + ($i * 16)], 23, "fde5380c");
                $this->HH($A, $B, $C, $D, $words[1 + ($i * 16)], 4, "a4beea44");
                $this->HH($D, $A, $B, $C, $words[4 + ($i * 16)], 11, "4bdecfa9");
                $this->HH($C, $D, $A, $B, $words[7 + ($i * 16)], 16, "f6bb4b60");
                $this->HH($B, $C, $D, $A, $words[10 + ($i * 16)], 23, "bebfbc70");
                $this->HH($A, $B, $C, $D, $words[13 + ($i * 16)], 4, "289b7ec6");
                $this->HH($D, $A, $B, $C, $words[0 + ($i * 16)], 11, "eaa127fa");
                $this->HH($C, $D, $A, $B, $words[3 + ($i * 16)], 16, "d4ef3085");
                $this->HH($B, $C, $D, $A, $words[6 + ($i * 16)], 23, "4881d05");
                $this->HH($A, $B, $C, $D, $words[9 + ($i * 16)], 4, "d9d4d039");
                $this->HH($D, $A, $B, $C, $words[12 + ($i * 16)], 11, "e6db99e5");
                $this->HH($C, $D, $A, $B, $words[15 + ($i * 16)], 16, "1fa27cf8");
                $this->HH($B, $C, $D, $A, $words[2 + ($i * 16)], 23, "c4ac5665");

                /* ROUND 4 */
                $this->II($A, $B, $C, $D, $words[0 + ($i * 16)], 6, "f4292244");
                $this->II($D, $A, $B, $C, $words[7 + ($i * 16)], 10, "432aff97");
                $this->II($C, $D, $A, $B, $words[14 + ($i * 16)], 15, "ab9423a7");
                $this->II($B, $C, $D, $A, $words[5 + ($i * 16)], 21, "fc93a039");
                $this->II($A, $B, $C, $D, $words[12 + ($i * 16)], 6, "655b59c3");
                $this->II($D, $A, $B, $C, $words[3 + ($i * 16)], 10, "8f0ccc92");
                $this->II($C, $D, $A, $B, $words[10 + ($i * 16)], 15, "ffeff47d");
                $this->II($B, $C, $D, $A, $words[1 + ($i * 16)], 21, "85845dd1");
                $this->II($A, $B, $C, $D, $words[8 + ($i * 16)], 6, "6fa87e4f");
                $this->II($D, $A, $B, $C, $words[15 + ($i * 16)], 10, "fe2ce6e0");
                $this->II($C, $D, $A, $B, $words[6 + ($i * 16)], 15, "a3014314");
                $this->II($B, $C, $D, $A, $words[13 + ($i * 16)], 21, "4e0811a1");
                $this->II($A, $B, $C, $D, $words[4 + ($i * 16)], 6, "f7537e82");
                $this->II($D, $A, $B, $C, $words[11 + ($i * 16)], 10, "bd3af235");
                $this->II($C, $D, $A, $B, $words[2 + ($i * 16)], 15, "2ad7d2bb");
                $this->II($B, $C, $D, $A, $words[9 + ($i * 16)], 21, "eb86d391");

                $A = $this->addUnsigned($this->hexdec2($A), $this->hexdec2($this->A));
                $B = $this->addUnsigned($this->hexdec2($B), $this->hexdec2($this->B));
                $C = $this->addUnsigned($this->hexdec2($C), $this->hexdec2($this->C));
                $D = $this->addUnsigned($this->hexdec2($D), $this->hexdec2($this->D));
            }

            $this->A = $A;
            $this->B = $B;
            $this->C = $C;
            $this->D = $D;
        }

        // Finalize context
        public function finalize(): string
        {
            $this->calculate($this->convertToArray('', true));
            $md5 = $this->WordToHex($this->A) . $this->WordToHex($this->B) . $this->WordToHex($this->C) . $this->WordToHex($this->D);
            return $md5;
        }

        // Convert word to HEX
        private function WordToHex(string $lValue): string
        {
            $WordToHexValue = "";
            for ($lCount = 0; $lCount <= 3; $lCount++) {
                $lByte = ($this->hexdec2($lValue) >> ($lCount * 8)) & 255;
                $C = dechex($lByte);
                $WordToHexValue .= (strlen($C) == '1') ? "0" . dechex($lByte) : dechex($lByte);
            }
            return $WordToHexValue;
        }

        // F(X,Y,Z) = XY v not(X) Z (X AND Y OR NOT X AND Z)
        private function F($X, $Y, $Z): string
        {
            $X = $this->hexdec2($X);
            $Y = $this->hexdec2($Y);
            $Z = $this->hexdec2($Z);
            $calc = (($X & $Y) | ((~$X) & $Z));
            return  $calc;
        }

        // G(X,Y,Z) = XZ v Y not(Z) (X AND Z OR Y AND NOT Z)
        private function G($X, $Y, $Z)
        {
            $X = $this->hexdec2($X);
            $Y = $this->hexdec2($Y);
            $Z = $this->hexdec2($Z);
            $calc = (($X & $Z) | ($Y & (~$Z)));
            return  $calc;
        }

        // H(X,Y,Z) = X xor Y xor Z (X XOR Y XOR Z)
        private function H($X, $Y, $Z)
        {
            $X = $this->hexdec2($X);
            $Y = $this->hexdec2($Y);
            $Z = $this->hexdec2($Z);
            $calc = ($X ^ $Y ^ $Z);
            return  $calc;
        }

        // I(X,Y,Z) = Y xor (X v not(Z))
        private function I($X, $Y, $Z)
        {
            $X = $this->hexdec2($X);
            $Y = $this->hexdec2($Y);
            $Z = $this->hexdec2($Z);
            $calc = ($Y ^ ($X | (~$Z)));
            return  $calc;
        }

        // Add unsigned
        private function addUnsigned($lX, $lY)
        {
            $lX8 = ($lX & 0x80000000);
            $lY8 = ($lY & 0x80000000);
            $lX4 = ($lX & 0x40000000);
            $lY4 = ($lY & 0x40000000);
            $lResult = ($lX & 0x3FFFFFFF) + ($lY & 0x3FFFFFFF);

            if ($lX4 & $lY4) {
                $res = ($lResult ^ 0x80000000 ^ $lX8 ^ $lY8);
                if ($res < 0)
                    return '-' . dechex(abs($res));
                else
                    return dechex($res);
            }
            if ($lX4 | $lY4) {
                if ($lResult & 0x40000000) {
                    $res = ($lResult ^ 0xC0000000 ^ $lX8 ^ $lY8);
                    if ($res < 0)
                        return '-' . dechex(abs($res));
                    else
                        return dechex($res);
                } else {
                    $res = ($lResult ^ 0x40000000 ^ $lX8 ^ $lY8);
                    if ($res < 0)
                        return '-' . dechex(abs($res));
                    else
                        return dechex($res);
                }
            } else {
                $res = ($lResult ^ $lX8 ^ $lY8);
                if ($res < 0)
                    return '-' . dechex(abs($res));
                else
                    return dechex($res);
            }
        }

        // Convert hex to decimal
        protected function hexdec2($hex)
        {
            if (substr($hex, 0, 1) == "-") {
                return doubleval('-' . hexdec("0x" . str_replace("-", "", $hex)));
            }

            return hexdec("0x" . $hex);
        }

        private function FF(&$A, $B, $C, $D, $M, $s, $t)
        {
            $Level1 = $this->hexdec2($this->addUnsigned($this->F($B, $C, $D), bindec($M)));
            $level2 = $this->hexdec2($this->addUnsigned($Level1, $this->hexdec2($t)));
            $A = $this->hexdec2($this->addUnsigned($this->hexdec2($A), $level2));
            $A = $this->rotate($A, $s);
            $A =  $this->addUnsigned($A, $this->hexdec2($B));
        }

        private function GG(&$A, $B, $C, $D, $M, $s, $t)
        {
            $Level1 = $this->hexdec2($this->addUnsigned($this->G($B, $C, $D), bindec($M)));
            $level2 = $this->hexdec2($this->addUnsigned($Level1, $this->hexdec2($t)));
            $A = $this->hexdec2($this->addUnsigned($this->hexdec2($A), $level2));
            $A = $this->rotate($A, $s);
            $A =  $this->addUnsigned($A, $this->hexdec2($B));
        }

        function HH(&$A, $B, $C, $D, $M, $s, $t)
        {
            $Level1 = $this->hexdec2($this->addUnsigned($this->H($B, $C, $D), bindec($M)));
            $level2 = $this->hexdec2($this->addUnsigned($Level1, $this->hexdec2($t)));
            $A = $this->hexdec2($this->addUnsigned($this->hexdec2($A), $level2));
            $A = $this->rotate($A, $s);
            $A =  $this->addUnsigned($A, $this->hexdec2($B));
        }

        function II(&$A, $B, $C, $D, $M, $s, $t)
        {
            $Level1 = $this->hexdec2($this->addUnsigned($this->I($B, $C, $D), bindec($M)));
            $level2 = $this->hexdec2($this->addUnsigned($Level1, $this->hexdec2($t)));
            $A = $this->hexdec2($this->addUnsigned($this->hexdec2($A), $level2));
            $A = $this->rotate($A, $s);
            $A =  $this->addUnsigned($A, $this->hexdec2($B));
        }

        function rotate($decimal, $bits)
        {
            return (($decimal << $bits) |  $this->shiftright($decimal, (32 - $bits))  & 0xffffffff);
        }

        // Right shift
        private function shiftright($decimal, $right)
        {
            if ($decimal < 0) {
                $res = decbin($decimal >> $right);

                for ($i = 0; $i < $right; $i++) {
                    $res[$i] = "";
                }

                return bindec($res);
            }

            return ($decimal >> $right);
        }

        // Convert to array
        private function convertToArray(string $string, bool $final = false)
        {
            $lWordCount = 0;

            if ($this->buffer) {
                $string = $this->buffer . $string;
                $this->buffer = '';
            }

            $lMessageLength = strlen($string);

            if ($final === false) {
                $cut = $lMessageLength % 32;
                $this->buffer = substr($string, $lMessageLength - $cut);
                $string = substr($string, 0, $lMessageLength - $cut);
                $lMessageLength -= $cut;
            }

            $lNumberOfWords_temp1 = $lMessageLength + 8;
            $lNumberOfWords_temp2 = ($lNumberOfWords_temp1 - ($lNumberOfWords_temp1 % 64)) / 64;
            $lNumberOfWords = ($lNumberOfWords_temp2 + 1) * 16;

            $lWordArray = [""];
            $lBytePosition = 0;
            $lByteCount = 0;

            while ($lByteCount < $lMessageLength) {
                $lWordCount = ($lByteCount - ($lByteCount % 4)) / 4;
                $lBytePosition = ($lByteCount % 4) * 8;

                if (!isset($lWordArray[$lWordCount])) {
                    $lWordArray[$lWordCount] = 0;
                }

                $lWordArray[$lWordCount] = ($lWordArray[$lWordCount] | (ord($string[$lByteCount]) << $lBytePosition));
                $lByteCount++;
            }

            $lWordCount = ($lByteCount - ($lByteCount % 4)) / 4;
            $lBytePosition = ($lByteCount % 4) * 8;
            $this->length += $lMessageLength;

            if ($final === true) {
                if (!isset($lWordArray[$lWordCount])) {
                    $lWordArray[$lWordCount] = 0;
                }

                $lWordArray[$lWordCount] = $lWordArray[$lWordCount] | (0x80 << $lBytePosition);
                $lWordArray[$lNumberOfWords - 2] = $this->length << 3;
                $lWordArray[$lNumberOfWords - 1] = $this->length >> 29;
            }

            for ($i = 0; $i < $lNumberOfWords; $i++) {
                if (isset($lWordArray[$i])) {
                    $lWordArray[$i] = decbin($lWordArray[$i]);
                } else if ($final === false) {
                    return $lWordArray;
                } else {
                    $lWordArray[$i] = '0';
                }
            }

            return $lWordArray;
        }
    }
    $object = new MD5();
    $object->pump($string);
    return $object->finalize();
}

function generateBarCode($stringData, $height, $width, $barCodeQuietZone)
{
    $xScale = $width;

    // 			QUIET ZONE		START CHAR				ENCODED DATA				CHECK DIGIT		STOP CHAR		QUIET ZONE
    $width = ($width * 10) + ($width * 11) + ($width * 11 * strlen($stringData)) + ($width * 11) + ($width * 13) + ($width * 10);

    if (!$barCodeQuietZone) {
        $width -= $xScale * 20;
    }

    if ($height < 25) {                                                        // MAKE SURE THE HEIGHT IS A MINIMUM OF 0.25" (1PX ~ 0.010")
        $height = 25;
    }
    $showText = true;

    $fontPath = "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf";

    $code = array(                                                            // CODE 128 VALUE TABLE
        0 => "212222",    // " "
        1 => "222122",    // "!"
        2 => "222221",    // "{QUOTE}"
        3 => "121223",    // "#"
        4 => "121322",    // "$"
        5 => "131222",    // "%"
        6 => "122213",    // "&"
        7 => "122312",    // "'"
        8 => "132212",    // "("
        9 => "221213",    // ")"
        10 => "221312",    // "*"
        11 => "231212",    // "+"
        12 => "112232",    // ","
        13 => "122132",    // "-"
        14 => "122231",    // "."
        15 => "113222",    // "/"
        16 => "123122",    // "0"
        17 => "123221",    // "1"
        18 => "223211",    // "2"
        19 => "221132",    // "3"
        20 => "221231",    // "4"
        21 => "213212",    // "5"
        22 => "223112",    // "6"
        23 => "312131",    // "7"
        24 => "311222",    // "8"
        25 => "321122",    // "9"
        26 => "321221",    // ":"
        27 => "312212",    // ";"
        28 => "322112",    // "<"
        29 => "322211",    // "="
        30 => "212123",    // ">"
        31 => "212321",    // "?"
        32 => "232121",    // "@"
        33 => "111323",    // "A"
        34 => "131123",    // "B"
        35 => "131321",    // "C"
        36 => "112313",    // "D"
        37 => "132113",    // "E"
        38 => "132311",    // "F"
        39 => "211313",    // "G"
        40 => "231113",    // "H"
        41 => "231311",    // "I"
        42 => "112133",    // "J"
        43 => "112331",    // "K"
        44 => "132131",    // "L"
        45 => "113123",    // "M"
        46 => "113321",    // "N"
        47 => "133121",    // "O"
        48 => "313121",    // "P"
        49 => "211331",    // "Q"
        50 => "231131",    // "R"
        51 => "213113",    // "S"
        52 => "213311",    // "T"
        53 => "213131",    // "U"
        54 => "311123",    // "V"
        55 => "311321",    // "W"
        56 => "331121",    // "X"
        57 => "312113",    // "Y"
        58 => "312311",    // "Z"
        59 => "332111",    // "["
        60 => "314111",    // "\"
        61 => "221411",    // "]"
        62 => "431111",    // "^"
        63 => "111224",    // "_"
        64 => "111422",    // "`"
        65 => "121124",    // "a"
        66 => "121421",    // "b"
        67 => "141122",    // "c"
        68 => "141221",    // "d"
        69 => "112214",    // "e"
        70 => "112412",    // "f"
        71 => "122114",    // "g"
        72 => "122411",    // "h"
        73 => "142112",    // "i"
        74 => "142211",    // "j"
        75 => "241211",    // "k"
        76 => "221114",    // "l"
        77 => "413111",    // "m"
        78 => "241112",    // "n"
        79 => "134111",    // "o"
        80 => "111242",    // "p"
        81 => "121142",    // "q"
        82 => "121241",    // "r"
        83 => "114212",    // "s"
        84 => "124112",    // "t"
        85 => "124211",    // "u"
        86 => "411212",    // "v"
        87 => "421112",    // "w"
        88 => "421211",    // "x"
        89 => "212141",    // "y"
        90 => "214121",    // "z"
        91 => "412121",    // "{"
        92 => "111143",    // "|"
        93 => "111341",    // "}"
        94 => "131141"
    ); // "~"

    $stringArr = str_split($stringData);                                // SPLIT THE DATA INTO AN ARRAY OF CHARACTERS
    $barcodeData = "";                                                    // CREATE A NEW STRING FOR BAR AND SPACE WIDTHS
    $checksum = 104;                                                    // START KEEPING TRACK OF THE CHECKSUM VALUES

    $barcodeData .= "211214";                                            // ADD THE START CODE TO THE BARCODE

    foreach ($stringArr as $i => $c) {                                    // PARSE EACH CHAR AND UPDATE THE CHECKSUM
        $barcodeData .= $code[ord($c) - 32];
        $checksum += ($i + 1) * (ord($c) - 32);
    }

    $barcodeData .= $code[$checksum % 103];                                // CALCULATE THE CHECKSUM AND ADD IT TO THE BARCODE
    $barcodeData .= "2331112";                                            // ADD STOP CODE TO THE BARCODE

    $barcodeData = str_split($barcodeData);                                // SPLIT BARCODE INTO ARRAY OF ALTERNATING BAR AND SPACE WIDTHS: 0 = BAR, 1 = SPACE, 2= BAR, ETC.

    $stringWidth = 0;                                                    // DETERMINE MARGINS IF TEXT WILL BE DISPLAYED
    $stringHeight = 0;
    $lineHeight = 0;
    if ($showText && file_exists($fontPath)) {
        $stringLoc = imagettfbbox(10 * $xScale, 0, $fontPath, $stringData);
        $stringWidth = abs($stringLoc[4] - $stringLoc[0]);                // FIND TOTAL TEXT WIDTH AND HEIGHT
        $stringHeight = abs($stringLoc[5] - $stringLoc[1]);

        $stringLoc = imagettfbbox(10 * $xScale, 0, $fontPath, "A");        // FIND BASEPOINT FOR FONT
        $lineHeight = abs($stringLoc[5] - $stringLoc[1]);
    }

    $img = imagecreate($width, $height + 20 + $stringHeight)            // CREATE NEW IMAGE (WITH 10PX PADDING ON TOP AND BOTTOM) 
        or die("Error: Cannot create barcode image.");

    $black = imagecolorallocate($img, 0, 0, 0);                            // ALLOCATE COLORS FOR IMAGE
    $white = imagecolorallocate($img, 255, 255, 255);

    imagefill($img, 0, 0, $white);                                        // MAKE BACKGROUND WHITE (FOR NOW)

    $x = 10 * $xScale;                                                    // KEEP TRACK OF THE X POSITION
    if (!$barCodeQuietZone) $x = $xScale;

    $bar = true;                                                        // KEEP TRACK OF WHETHER IT'S A BAR OR SPACE

    foreach ($barcodeData as $barWidth) {                                    // ITERATE THROUGH BARS
        $barWidth = intval($barWidth) * $xScale;
        if ($bar) {                                                        // IF IT'S A BAR...
            while ($barWidth > 0) {                                            // DRAW A LINE FOR EACH WIDTH POINT
                imageline($img, $x, 10, $x, $height, $black);
                $x++;                                                        // PUSH X POINTER FORWARD
                $barWidth--;
            }
            $bar = !$bar;
        } else {                                                            // IF IT'S A SPACE... JUST PUSH X POINTER FORWARD
            $x += $barWidth;
            $bar = !$bar;
        }
    }

    imagecolortransparent($img, $white);                                // MAKE WHITE TRANSPARENT

    if ($showText && file_exists($fontPath)) {                            // GENERATE TEXT IF NECESSARY (WITH APPROPRIATE GAP BETWEEN BARCODE AND TEXT)
        imagefttext($img, 16, 0, (($width - $stringWidth) / 2), ($height + $lineHeight), $black, $fontPath, $stringData);
    }

    imagepng($img, "Barcode.png");
    imagedestroy($img);

    return "Success";
}

// GENERATE RANDOM OTP
function randomOTP($OTP_TYPE, $OTP_LENGTH)
{
    $OTP_VALUE_ARRAY = [];

    // ALLOCATE WHAT TYPE OF INPUT VALUES
    if ($OTP_TYPE === "number") $OTP_VALUE_ARRAY = "0123456789";
    else if ($OTP_TYPE === "alphabet") $OTP_VALUE_ARRAY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    else $OTP_VALUE_ARRAY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    $a = 65539;  # RANDOM VALUE
    $max = pow(2, 32);  # RANDOM VALUE

    $alphabetRandom = "";

    for ($i = 0; $i < $OTP_LENGTH; $i += 1) {
        $seed = round(microtime(false) * $max);
        $seed = ($seed * $a) + log($max);
        $x = abs(sin($seed += 1) * 10000);
        $random = $x - floor($x);

        $alphabetRandom .= $OTP_VALUE_ARRAY[intval($random * strlen($OTP_VALUE_ARRAY))];
    }
    return $alphabetRandom;
}

function generateCaptcha($string)
{
    session_start();

    $_SESSION["string"] = $string;

    $image = imagecreatetruecolor(200, 50);

    imageantialias($image, true);

    $colors = [];

    $red = rand(125, 175);
    $green = rand(125, 175);
    $blue = rand(125, 175);

    for ($i = 0; $i < 5; $i++) {
        $colors[] = imagecolorallocate($image, $red - 20 * $i, $green - 20 * $i, $blue - 20 * $i);
    }

    imagefill($image, 0, 0, $colors[0]);

    for ($i = 0; $i < 10; $i++) {
        imagesetthickness($image, rand(2, 5));
        $rect_color = $colors[rand(1, 4)];
        imagerectangle($image, rand(-10, 190), rand(-10, 10), rand(-10, 190), rand(40, 60), $rect_color);
    }


    $black = imagecolorallocate($image, 0, 0, 0);
    $white = imagecolorallocate($image, 255, 255, 255);
    $textcolors = [$black, $white];

    $fonts = ["/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf", "/usr/share/fonts/truetype/Sahadeva/sahadeva.ttf", "/usr/share/fonts/truetype/pagul/Pagul.ttf", "/usr/share/fonts/truetype/Nakula/nakula.ttf"];

    $captcha_string = $string;
    $string_length = strlen($string);

    for ($i = 0; $i < $string_length; $i++) {
        $letter_space = 170 / $string_length;
        $initial = 15;

        imagettftext($image, rand(24, 28), rand(-15, 15), $initial + $i * $letter_space, rand(20, 40), $textcolors[rand(0, 1)], $fonts[array_rand($fonts)], $captcha_string[$i]);
    }

    imagepng($image, "Captcha.png");

    imagedestroy($image);

    // GENERATE A 50X24 STANDARD CAPTCHA IMAGE 
    // $im = imagecreatetruecolor(50, 24);

    // // BLUE COLOR 
    // $bg = imagecolorallocate($im, 22, 86, 165);

    // // WHITE COLOR 
    // $fg = imagecolorallocate($im, 255, 255, 255);

    // // GIVE THE IMAGE A BLUE BACKGROUND 
    // imagefill($im, 0, 0, $bg);

    // // PRINT THE CAPTCHA TEXT IN THE IMAGE WITH RANDOM POSITION & SIZE 
    // imagestring(
    //     $im,
    //     rand(1, 7),
    //     rand(1, 7),
    //     rand(1, 7),
    //     $string,
    //     $fg
    // );

    // // VERY IMPORTANT: Prevent any Browser Cache!! 
    // header("Cache-Control: no-store, 
    //         no-cache, must-revalidate");

    // // The PHP-file will be rendered as image 
    // header('Content-type: image/png');

    // imagepng($im, "Captcha.png");

    // // Free memory 
    // imagedestroy($im);
}

function sinRadianFunc($sinRadian)
{
    $PI = 3.14159265358979323846;
    $sinRadian %= 2 * $PI;
    $sign = 1;

    if ($sinRadian > $PI) {
        $sinRadian -= $PI;
        $sign = -1;
    }

    $temp = 0;
    for ($i = 0; $i <= 50; $i = $i + 1) {
        $temp += (pow(-1, $i) * (pow($sinRadian, 2 * $i + 1)) / fact(2 * $i + 1));
    }

    return floatval($sign * $temp);
}

function fact($num)
{
    if ($num == 0 || $num == 1)
        return 1;
    else
        return $num * fact($num - 1);
}

// COMMON LOG CALCULATOR
function COMMON_LOG_FUNC($number)
{
    $answer = 0;
    $iterator = 0;
    $base = 10;
    while ($iterator < 50) {
        $power = 1;
        $incrementPower = 0;
        while ($power * $base <= $number) {
            $incrementPower++;
            $power = $power * $base;
        }

        // TO BREAK WHEN GETTING SAME AS PREVIOUS
        $answer = $answer + $incrementPower * (10 ** -$iterator);

        $number = $number / $power;

        $number = $number ** $base;

        $iterator++;
    }
    return $answer;
}

function checkInfinityAndConvertToString($value)
{
    if (is_infinite($value)) return strval($value);
    else return $value;
}

// LCM CALCULATION HELPER FUNCTION
function LCM_FUNC($num1, $num2)
{
    $maximum = $num1 > $num2 ? $num1 : $num2;
    while (true) {
        if ($maximum % $num1 === 0 && $maximum % $num2 === 0)
            return $maximum;
        $maximum++;
    }
}

// GCF OR HCF OR GCD CALCULATION HELPER FUNCTION
function GCF_FUNC($num1, $num2)
{
    if ($num2 === 0)
        return $num1;
    return GCF_FUNC($num2, $num1 % $num2);
}

function CBRT_FUNC($number)
{
    $iterator = 1;
    $precision = 0.000001;

    for ($iterator = 1; ($iterator * $iterator * $iterator) <= $number; ++$iterator);
    for (--$iterator; ($iterator * $iterator * $iterator) < $number; $iterator += $precision);

    return $iterator;
}

function NTH_ROOT_FUNC($number, $nthRoot)
{
    return $number ** (1 / $nthRoot);
}

function STANDARD_DEVIATION_AND_VARIANCE($inputNumberArray)
{
    # CALCULATE MEAN OF ARRAY
    $mean = array_sum($inputNumberArray) / count($inputNumberArray);

    # CALCULATE VARIANCE
    $VARIANCE = [];
    for ($i = 0; $i < count($inputNumberArray); $i++) {
        array_push($VARIANCE, ($inputNumberArray[$i] - $mean) ** 2);
    }

    # POPULATION VARIANCE WITHOUT - 1
    $POPULATION_VARIANCE = array_sum($VARIANCE) / count($VARIANCE);

    # POPULATION STANDARAD DEVIATION
    $POPULATION_STANDARD_DEVIATION = NTH_ROOT_FUNC($POPULATION_VARIANCE, 2);

    # SAMPLE VARIANCE WITH - 1
    $SAMPLE_VARIANCE = array_sum($VARIANCE) / (count($VARIANCE) - 1);

    # SAMPLE STANDARAD DEVIATION
    $SAMPLE_STANDARD_DEVIATION = NTH_ROOT_FUNC($SAMPLE_VARIANCE, 2);

    return sprintf("POPULATION_VARIANCE = " . $POPULATION_VARIANCE . "  POPULATION_STANDARD_DEVIATION = " . $POPULATION_STANDARD_DEVIATION . "  SAMPLE_VARIANCE = " . $SAMPLE_VARIANCE . "  SAMPLE_STANDARD_DEVIATION = " . $SAMPLE_STANDARD_DEVIATION);
    // return {
    //     "POPULATION_VARIANCE": POPULATION_VARIANCE,
    //     "POPULATION_STANDARD_DEVIATION": POPULATION_STANDARD_DEVIATION,
    //     "SAMPLE_VARIANCE": SAMPLE_VARIANCE,
    //     "SAMPLE_STANDARD_DEVIATION": SAMPLE_STANDARD_DEVIATION
    // }
}

function LINEAR_REGRESSION($X, $Y)
{
    $sumX = array_sum($X);
    $sumY = array_sum($Y);
    $sumXX = 0;
    $sumXY = 0;
    for ($i = 0; $i < count($X); $i++) {
        $sumXX += $X[$i] * $X[$i];
        $sumXY += $X[$i] * $Y[$i];
    }

    # ANY ONE ARRAY LENGTH
    $n = count($X);

    $a = (($sumY * $sumXX) - ($sumX * $sumXY)) / (($n * $sumXX) - ($sumX * $sumX));
    $b = (($n * $sumXY) - ($sumX * $sumY)) / (($n * $sumXX) - ($sumX * $sumX));

    # REGRESSION EQUATION = > Y = a + bx
    return sprintf("Liner Regression Equation => " . $a . " + " . $b . " (x) ");
}

// $allowedOrigins = array(
//     '(http(s)://)?(www\.)?my\-domain\.com'
// );

// if (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] != '') {
//     foreach ($allowedOrigins as $allowedOrigin) {
//         if (preg_match('#' . $allowedOrigin . '#', $_SERVER['HTTP_ORIGIN'])) {
//             header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
//             header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
//             header('Access-Control-Max-Age: 1000');
//             header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
//             break;
//         }
//     }
// }
// function cors()
// {
//     // Allow from any origin
//     if (isset($_SERVER['HTTP_ORIGIN'])) {
//         // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
//         // you want to allow, and if so:
//         header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
//         header('Access-Control-Allow-Credentials: true');
//         header('Access-Control-Max-Age: 86400');    // cache for 1 day
//     }

//     // Access-Control headers are received during OPTIONS requests
//     if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

//         if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
//             // may also be using PUT, PATCH, HEAD etc
//             header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

//         if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
//             header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

//         exit(0);
//     }

//     echo "You have CORS!";
// }

// cors();