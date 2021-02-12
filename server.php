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
                $response->return_message = "Barcode Creation Success";

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
    function rhex($num)
    {
        $hex_char_array = "0123456789abcdef";
        $str = "";
        for ($j = 0; $j <= 3; $j += 1) {
            $str .= $hex_char_array[($num >> ($j * 8 + 4)) & 0x0F] . $hex_char_array[($num >> ($j * 8)) & 0x0F];
        }
        return $str;
    }

    /*
     * Convert a string to a sequence of 16-word blocks, stored as an array.
     * Append padding bits and the length, as described in the MD5 standard.
     */
    function str2blks_MD5($str)
    {
        $nblk = ((strlen($str) + 8) >> 6) + 1;
        // blks = new Array($nblk * 16);
        $blks = [];
        for ($i = 0; $i < $nblk * 16; $i += 1)
            $blks[$i] = 0;
        for ($i = 0; $i < strlen($str); $i += 1)
            $blks[$i >> 2] |= ord($str[$i]) << (($i % 4) * 8);
        $blks[$i >> 2] |= 0x80 << (($i % 4) * 8);
        $blks[$nblk * 16 - 2] = strlen($str) * 8;
        return $blks;
    }

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally 
     * to work around bugs in some JS interpreters.
     */
    function add($x, $y)
    {
        $lsw = ($x & 0xFFFF) + ($y & 0xFFFF);
        $msw = ($x >> 16) + ($y >> 16) + ($lsw >> 16);
        return ($msw << 16) | ($lsw & 0xFFFF);
    }

    /*
     * Bitwise rotate a 32-bit number to the left
     */
    function rol($num, $cnt)
    {
        return ($num << $cnt) | ($num >> (32 - $cnt));
    }

    /*
     * These functions implement the basic operation for each round of the
     * algorithm.
     */
    function cmn($q, $a, $b, $x, $s, $t)
    {
        return add(rol(add(add($a, $q), add($x, $t)), $s), $b);
    }
    function ff($a, $b, $c, $d, $x, $s, $t)
    {
        return cmn(($b & $c) | ((~$b) & $d), $a, $b, $x, $s, $t);
    }
    function gg($a, $b, $c, $d, $x, $s, $t)
    {
        return cmn(($b & $d) | ($c & (~$d)), $a, $b, $x, $s, $t);
    }
    function hh($a, $b, $c, $d, $x, $s, $t)
    {
        return cmn($b ^ $c ^ $d, $a, $b, $x, $s, $t);
    }
    function ii($a, $b, $c, $d, $x, $s, $t)
    {
        return cmn($c ^ ($b | (~$d)), $a, $b, $x, $s, $t);
    }

    /*
     * Take a string and return the hex representation of its MD5.
     */
    $x = str2blks_MD5($string);
    $a = 1732584193;
    $b = -271733879;
    $c = -1732584194;
    $d = 271733878;

    for ($i = 0; $i < count($x); $i += 16) {
        $olda = $a;
        $oldb = $b;
        $oldc = $c;
        $oldd = $d;

        $a = ff($a, $b, $c, $d, $x[$i + 0], 7, -680876936);
        $d = ff($d, $a, $b, $c, $x[$i + 1], 12, -389564586);
        $c = ff($c, $d, $a, $b, $x[$i + 2], 17, 606105819);
        $b = ff($b, $c, $d, $a, $x[$i + 3], 22, -1044525330);
        $a = ff($a, $b, $c, $d, $x[$i + 4], 7, -176418897);
        $d = ff($d, $a, $b, $c, $x[$i + 5], 12, 1200080426);
        $c = ff($c, $d, $a, $b, $x[$i + 6], 17, -1473231341);
        $b = ff($b, $c, $d, $a, $x[$i + 7], 22, -45705983);
        $a = ff($a, $b, $c, $d, $x[$i + 8], 7, 1770035416);
        $d = ff($d, $a, $b, $c, $x[$i + 9], 12, -1958414417);
        $c = ff($c, $d, $a, $b, $x[$i + 10], 17, -42063);
        $b = ff($b, $c, $d, $a, $x[$i + 11], 22, -1990404162);
        $a = ff($a, $b, $c, $d, $x[$i + 12], 7, 1804603682);
        $d = ff($d, $a, $b, $c, $x[$i + 13], 12, -40341101);
        $c = ff($c, $d, $a, $b, $x[$i + 14], 17, -1502002290);
        $b = ff($b, $c, $d, $a, $x[$i + 15], 22, 1236535329);

        $a = gg($a, $b, $c, $d, $x[$i + 1], 5, -165796510);
        $d = gg($d, $a, $b, $c, $x[$i + 6], 9, -1069501632);
        $c = gg($c, $d, $a, $b, $x[$i + 11], 14, 643717713);
        $b = gg($b, $c, $d, $a, $x[$i + 0], 20, -373897302);
        $a = gg($a, $b, $c, $d, $x[$i + 5], 5, -701558691);
        $d = gg($d, $a, $b, $c, $x[$i + 10], 9, 38016083);
        $c = gg($c, $d, $a, $b, $x[$i + 15], 14, -660478335);
        $b = gg($b, $c, $d, $a, $x[$i + 4], 20, -405537848);
        $a = gg($a, $b, $c, $d, $x[$i + 9], 5, 568446438);
        $d = gg($d, $a, $b, $c, $x[$i + 14], 9, -1019803690);
        $c = gg($c, $d, $a, $b, $x[$i + 3], 14, -187363961);
        $b = gg($b, $c, $d, $a, $x[$i + 8], 20, 1163531501);
        $a = gg($a, $b, $c, $d, $x[$i + 13], 5, -1444681467);
        $d = gg($d, $a, $b, $c, $x[$i + 2], 9, -51403784);
        $c = gg($c, $d, $a, $b, $x[$i + 7], 14, 1735328473);
        $b = gg($b, $c, $d, $a, $x[$i + 12], 20, -1926607734);

        $a = hh($a, $b, $c, $d, $x[$i + 5], 4, -378558);
        $d = hh($d, $a, $b, $c, $x[$i + 8], 11, -2022574463);
        $c = hh($c, $d, $a, $b, $x[$i + 11], 16, 1839030562);
        $b = hh($b, $c, $d, $a, $x[$i + 14], 23, -35309556);
        $a = hh($a, $b, $c, $d, $x[$i + 1], 4, -1530992060);
        $d = hh($d, $a, $b, $c, $x[$i + 4], 11, 1272893353);
        $c = hh($c, $d, $a, $b, $x[$i + 7], 16, -155497632);
        $b = hh($b, $c, $d, $a, $x[$i + 10], 23, -1094730640);
        $a = hh($a, $b, $c, $d, $x[$i + 13], 4, 681279174);
        $d = hh($d, $a, $b, $c, $x[$i + 0], 11, -358537222);
        $c = hh($c, $d, $a, $b, $x[$i + 3], 16, -722521979);
        $b = hh($b, $c, $d, $a, $x[$i + 6], 23, 76029189);
        $a = hh($a, $b, $c, $d, $x[$i + 9], 4, -640364487);
        $d = hh($d, $a, $b, $c, $x[$i + 12], 11, -421815835);
        $c = hh($c, $d, $a, $b, $x[$i + 15], 16, 530742520);
        $b = hh($b, $c, $d, $a, $x[$i + 2], 23, -995338651);

        $a = ii($a, $b, $c, $d, $x[$i + 0], 6, -198630844);
        $d = ii($d, $a, $b, $c, $x[$i + 7], 10, 1126891415);
        $c = ii($c, $d, $a, $b, $x[$i + 14], 15, -1416354905);
        $b = ii($b, $c, $d, $a, $x[$i + 5], 21, -57434055);
        $a = ii($a, $b, $c, $d, $x[$i + 12], 6, 1700485571);
        $d = ii($d, $a, $b, $c, $x[$i + 3], 10, -1894986606);
        $c = ii($c, $d, $a, $b, $x[$i + 10], 15, -1051523);
        $b = ii($b, $c, $d, $a, $x[$i + 1], 21, -2054922799);
        $a = ii($a, $b, $c, $d, $x[$i + 8], 6, 1873313359);
        $d = ii($d, $a, $b, $c, $x[$i + 15], 10, -30611744);
        $c = ii($c, $d, $a, $b, $x[$i + 6], 15, -1560198380);
        $b = ii($b, $c, $d, $a, $x[$i + 13], 21, 1309151649);
        $a = ii($a, $b, $c, $d, $x[$i + 4], 6, -145523070);
        $d = ii($d, $a, $b, $c, $x[$i + 11], 10, -1120210379);
        $c = ii($c, $d, $a, $b, $x[$i + 2], 15, 718787259);
        $b = ii($b, $c, $d, $a, $x[$i + 9], 21, -343485551);

        $a = add($a, $olda);
        $b = add($b, $oldb);
        $c = add($c, $oldc);
        $d = add($d, $oldd);
    }

    return rhex($a) . rhex($b) . rhex($c) . rhex($d);
}

function generateBarCode($stringData, $height, $width, $barCodeQuietZone)
{
    $xScale = $width;

    // 			QUIET ZONE		START CHAR				ENCODED DATA				CHECK DIGIT		STOP CHAR		QUIET ZONE
    $width = ($width * 10) + ($width * 11) + ($width * 11 * strlen($stringData)) + ($width * 11) + ($width * 13) + ($width * 10);

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
    $bar = true;                                                        // KEEP TRACK OF WHETHER IT'S A BAR OR SPACE

    foreach ($barcodeData as $barWidth) {                                    // ITERATE THROUGH BARS
        $barWidth = (int)$barWidth * $xScale;
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