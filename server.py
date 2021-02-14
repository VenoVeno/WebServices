from flask import Flask, request
from flask_cors import CORS
import datetime as dt
from PIL import ImageFont, ImageDraw, Image

import math as Math
import numpy as np
import time
import cv2
import os
import random
import qrcode


app = Flask(__name__)
CORS(app, support_credentials=True)

PORT = 3002


@app.route('/dateDiff', methods=["POST"])
def dateDiff():
    requestJSON = request.get_json(force=True)
    INPUT_DATA = requestJSON["data"]["inputData"]
    print(INPUT_DATA)
    fromDate = int(INPUT_DATA["fromDate"])
    fromMonth = int(INPUT_DATA["fromMonth"])
    fromYear = int(INPUT_DATA["fromYear"])
    fromHour = int(INPUT_DATA["fromHour"])
    fromMinute = int(INPUT_DATA["fromMinute"])
    fromSecond = int(INPUT_DATA["fromSecond"])
    toDate = int(INPUT_DATA["toDate"])
    toMonth = int(INPUT_DATA["toMonth"])
    toYear = int(INPUT_DATA["toYear"])
    toHour = int(INPUT_DATA["toHour"])
    toMinute = int(INPUT_DATA["toMinute"])
    toSecond = int(INPUT_DATA["toSecond"])
    isValidDate = True

    # CHECK FOR VALID DATE
    try:
        FROM_DATE = dt.datetime(
            fromYear, fromMonth, fromDate, fromHour, fromMinute, fromSecond)
    except ValueError:
        isValidDate = False
    try:
        TO_DATE = dt.datetime(
            toYear, toMonth, toDate, toHour, toMinute, toSecond)
    except ValueError:
        isValidDate = False

    print(isValidDate)
    if(isValidDate == False):
        return {"dateDiff": "Invalid Date"}
    print(FROM_DATE)
    print(TO_DATE)
    # DIFFERENCE BETWEEN TO DATES IN SECONDS
    SECONDS_DATA = int(abs((FROM_DATE - TO_DATE).total_seconds()))
    print(SECONDS_DATA)

    # CALCULATE DAYS AND REMOVE THE DAYS FROM SECONDS_DATA
    DAYS_DATA = Math.floor(SECONDS_DATA / 86400)  # 24 * 60 * 60
    SECONDS_DATA = SECONDS_DATA - DAYS_DATA * 86400

    # CALCULATE HOURS AND REMOVE HOURS FROM SECONDS_DATA
    hours = Math.floor(SECONDS_DATA / 3600)  # 60 * 60
    SECONDS_DATA = SECONDS_DATA - hours * 3600

    # CALCULATE MINUTES AND REMOVE SECONDS FROM SECONDS_DATA
    # HOW MANY MINUTES 140 - 2mins
    minutes = Math.floor(SECONDS_DATA / 60) % 60
    SECONDS_DATA = SECONDS_DATA - minutes * 60

    # LEFTED SECONDS
    seconds = SECONDS_DATA % 60

    # CONVERT DAYS TO YEAR:MONTH:DAYS
    years = 0
    months = 0
    days = 0
    while (DAYS_DATA):
        if DAYS_DATA >= 365:
            years = years + 1
            DAYS_DATA = DAYS_DATA - 365
        elif DAYS_DATA >= 30:
            months = months + 1
            DAYS_DATA = DAYS_DATA - 30
        else:
            days = days + 1
            DAYS_DATA = DAYS_DATA - 1

    print(f"{years} Years {months} Months {days} Days {hours} Hours {minutes} Minutes {seconds} Seconds")
    return{
        "dateDiff": f"{years} Years {months} Months {days} Days {hours} Hours {minutes} Minutes {seconds} Seconds"
    }


@app.route('/setTheory', methods=["POST"])
def setTheory():
    requestJSON = request.get_json(force=True)

    setA = requestJSON['data']['setAList']
    setB = requestJSON['data']['setBList']
    print(setA, setB)

    # UNION OF TWO ARRAY
    union = setA.copy()
    unionAll = setA.copy()
    for value in setB:
        if value not in setA:
            union.append(value)
        unionAll.append(value)

    intersection = []
    AminusB = []

    for value in setA:
        # INTERSECTION OF TWO ARRAY
        if value in setB:
            intersection.append(value)
        # A - B
        if value not in setB:
            AminusB.append(value)

    # B - A
    BminusA = []
    for value in setB:
        if value not in setA:
            BminusA.append(value)

    return {"union": union, "unionAll": unionAll, "intersection": intersection, "Set A-B": AminusB, "Set B-A": BminusA}


@app.route('/matrixOperation', methods=["POST"])
def matrixOperation():
    requestJSON = request.get_json(force=True)
    matrix = requestJSON['data']['matrix']
    print(matrix)

    # TRANSPORSE OF MATRIX
    transporse = []
    for i in range(len(matrix[0])):
        transporse.append([row[i] for row in matrix])

    # LOWER LEFT TRIANGULAR
    lowerLeft = []
    for row in range(len(matrix)):
        lowerLeft.append([])
        for col in range(len(matrix[0])):
            if(row >= len(matrix[0])):
                lowerLeft[row].append("")
            elif(row >= col):
                lowerLeft[row].append(matrix[row][col])
            else:
                lowerLeft[row].append("")

    # LOWER RIGHT TRIANGULAR
    lowerRight = []
    for row in range(len(matrix)):
        lowerRight.append([])
        condition = len(matrix[0]) - row - 1
        for col in range(len(matrix[0])):
            if(row >= len(matrix[0])):
                lowerRight[row].append("")
            elif(col >= condition):
                lowerRight[row].append(matrix[row][col])
            else:
                lowerRight[row].append("")

    # UPPER LEFT TRIANGULAR
    upperLeft = []
    for row in range((len(matrix))):
        upperLeft.append([])
        for col in range(len(matrix[0])):
            if(col >= len(matrix)):
                upperLeft[row].append("")
            elif(row <= col):
                upperLeft[row].append(matrix[row][col])
            else:
                upperLeft[row].append("")

    # UPPER RIGHT TRIANGULAR
    upperRight = []
    jStart = len(matrix[0])-len(matrix) if len(matrix[0]) > len(matrix) else 0
    for row in range(len(matrix)):
        upperRight.append([])
        condition = len(matrix[0]) - row - 1
        for col in range(len(matrix[0])):
            if(col >= jStart and col <= condition):
                upperRight[row].append(matrix[row][col])
            else:
                upperRight[row].append("")

    return {
        "transporse": transporse,
        "lowerLeft": lowerLeft,
        "lowerRight": lowerRight,
        "upperLeft": upperLeft,
        "upperRight": upperRight
    }


@app.route('/numToWordRupee', methods=["GET"])
def numberToWord():
    number = request.args["amount"]
    if(len(number)) > 15:
        return {"word": "Unsupported Digit Count"}
    else:
        return {"word": numberToWords(int(number))}


# BUSINESS LOGIC FOR NUMBER TO WORDS RUPEE
def numberToWords(number):
    words = ""
    LESS_THAN_TWENTY = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
                        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"]
    TENTHS_LESS_THAN_HUNDRED = ['Zero', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty',
                                'Sixty', 'Seventy', 'Eighty', 'Ninety']

    #  IN CASE OF NEGATIVE ADD TO THE WORD AND CONVERT TO POSITIVE
    if number < 0:
        words += "Minus "
        number = number * -1
    remainder = 0
    if (number < 20):
        words += LESS_THAN_TWENTY[number]
    elif (number < 100):
        words += TENTHS_LESS_THAN_HUNDRED[int(number / 10)]
        remainder = number % 10
    elif (number < 1000):
        # RANGING FROM 100 - 999 -- One Hunderd to Nine Hundred and Ninety Nine
        words += numberToWords(int(number / 100)) + " Hundred"
        remainder = number % 100
    elif (number < 100000):
        # RANGING FROM 1,000 - 99,999 -- One Thousand to Ninety Nine Thousand Nine Hundred Ninety Nine
        words += numberToWords(int(number / 1000)) + " Thousand"
        remainder = number % 1000
    elif (number < 10000000):
        # RANGING FROM 1,00,000 - 99,99,999 -- One Lakh to Ninety Nine Lakhs Ninety Nine Thousand Nine Hundred Ninety Nine
        words += numberToWords(int(number / 100000)) + " Lakh"
        remainder = number % 100000
    # elif (number < 1000000000)
    elif (number >= 10000000):
        # RANGING FROM 1,00,00,000 - 99,99,99,999 -- One Crore to Ninety Nine Crores Ninety Nine Lakhs Ninety Nine Thousand Nine Hundred and Ninety Nine
        words += numberToWords(int(number / 10000000)) + " Crore"
        remainder = number % 10000000

    if remainder:
        words += " " + numberToWords(remainder)

    return words


@app.route('/rsaEncDec', methods=["POST"])
def rsaEncryptDecrypt():
    requestJSON = request.get_json(force=True)
    typeOfProcess = requestJSON['data']['type']

    print("RSA Encryption Decryption")
    if(typeOfProcess == "Encryption"):
        print("Encryption To be done!")
        inputString = requestJSON['data']['inputString']
        public, private = GENERATE_KEY_PAIR_RSA()

        print(public, private)
        # ENCRYPT THE MESSAGE USING PUBLIC KEY
        ENCRYPTED_ARRAY = ENCRYPT_RSA(public, inputString)

        return {
            "PUBLIC_KEY": public,
            "PRIVATE_KEY": private,
            "ORIGINAL_TEXT": inputString,
            "ENCRYPTED_MESSAGE": ENCRYPTED_ARRAY
        }
    else:
        print("Decryption To be Done!")
        encryptedArray = requestJSON['data']['encryptedArray']
        privateKeyArray = requestJSON['data']['privateKeyArray']

        # DECRYPT THE MESSAGE USING PUBLIC KEY
        DECRYPTED_TEXT = DECRYPT_RSA(privateKeyArray, encryptedArray)

        return {
            "ORIGINAL_TEXT": DECRYPTED_TEXT
        }


# GENERATE PUBLIC AND PRIVAT KEY VALUE PAIR RANDOMISED
def GENERATE_KEY_PAIR_RSA():
    # INITIALISING PRIME RANGE
    minPrime = 0
    maxPrime = 1000

    # GET CATCHED PRIMES
    cached_primes = [i for i in range(minPrime, maxPrime) if IS_PRIME_RSA(i)]

    # RANDOM PRIME
    p = cached_primes[random.randint(0, len(cached_primes))]
    q = cached_primes[random.randint(0, len(cached_primes))]

    n = p * q

    phi = (p-1) * (q-1)
    e = random.randrange(1, phi)
    g = GCD_RSA(e, phi)

    while g != 1:
        e = random.randrange(1, phi)
        g = GCD_RSA(e, phi)

    d = MULTIPLICATIVE_INVERSE_RSA(e, phi)
    return ((e, n), (d, n))


# RSA ENCRYPTION DECRYPTION HELPER FUNCTION
def GCD_RSA(a, b):
    while b != 0:
        a, b = b, a % b
    return a


# RSA ENCRYPTION DECRYPTION HELPER FUNCTION
def MULTIPLICATIVE_INVERSE_RSA(e, phi):
    d = 0
    x1 = 0
    x2 = 1
    y1 = 1
    temp_phi = phi

    while e > 0:
        temp1 = temp_phi//e
        temp2 = temp_phi - temp1 * e
        temp_phi = e
        e = temp2

        x = x2 - temp1 * x1
        y = d - temp1 * y1

        x2 = x1
        x1 = x
        d = y1
        y1 = y

    if temp_phi == 1:
        return d + phi


# RSA ENCRYPTION DECRYPTION HELPER FUNCTION
def IS_PRIME_RSA(num):
    if num == 2:
        return True
    if num < 2 or num % 2 == 0:
        return False
    for n in range(3, int(num**0.5)+2, 2):
        if num % n == 0:
            return False
    return True


# RSA ENCRYPTION DECRYPTION HELPER FUNCTION
def ENCRYPT_RSA(pk, plaintext):
    key, n = pk
    cipher = [pow(ord(char), key, n) for char in plaintext]
    return cipher


# RSA ENCRYPTION DECRYPTION HELPER FUNCTION
def DECRYPT_RSA(pk, ciphertext):
    key, n = pk
    aux = [str(pow(char, key, n)) for char in ciphertext]
    plain = [chr(int(char2)) for char2 in aux]
    return ''.join(plain)


@app.route('/md5sum', methods=["GET"])
def md5sum():
    string = request.args["string"]
    return {"checksum": md5Algo(string)}


def md5Algo(plainText):
    rotate_by = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
                 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20, 5,  9, 14, 20,
                 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
                 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]

    nts = [int(abs(Math.sin(i+1)) * 4294967296)
           & 0xFFFFFFFF for i in range(64)]

    def pad(msg):
        msg_len_in_bits = (8*len(msg)) & 0xffffffffffffffff
        msg.append(0x80)

        while len(msg) % 64 != 56:
            msg.append(0)

        msg += msg_len_in_bits.to_bytes(8, byteorder='little')

        return msg

    init_MDBuffer = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476]

    def leftRotate(x, amount):
        x &= 0xFFFFFFFF
        return (x << amount | x >> (32-amount)) & 0xFFFFFFFF

    def processMessage(msg):
        init_temp = init_MDBuffer[:]

        for offset in range(0, len(msg), 64):
            A, B, C, D = init_temp
            block = msg[offset: offset+64]

            for i in range(64):
                if i < 16:
                    def func(b, c, d): return (b & c) | (~b & d)
                    def index_func(i): return i

                elif i >= 16 and i < 32:
                    def func(b, c, d): return (d & b) | (~d & c)
                    def index_func(i): return (5*i + 1) % 16

                elif i >= 32 and i < 48:
                    def func(b, c, d): return b ^ c ^ d
                    def index_func(i): return (3*i + 5) % 16

                elif i >= 48 and i < 64:
                    def func(b, c, d): return c ^ (b | ~d)
                    def index_func(i): return (7*i) % 16

                F = func(B, C, D)
                G = index_func(i)

                to_rotate = A + F + nts[i] + \
                    int.from_bytes(block[4*G: 4*G + 4], byteorder='little')
                newB = (B + leftRotate(to_rotate, rotate_by[i])) & 0xFFFFFFFF

                A, B, C, D = D, newB, B, C

            for i, val in enumerate([A, B, C, D]):
                init_temp[i] += val
                init_temp[i] &= 0xFFFFFFFF

        return sum(buffer_content << (32*i) for i, buffer_content in enumerate(init_temp))

    def MD_to_hex(digest):
        raw = digest.to_bytes(16, byteorder='little')
        return '{:032x}'.format(int.from_bytes(raw, byteorder='big'))

    def md5(msg):
        msg = bytearray(msg, 'ascii')
        msg = pad(msg)
        processed_msg = processMessage(msg)
        return MD_to_hex(processed_msg)

    return md5(plainText)


@app.route('/barCode', methods=["POST"])
def barCode():
    requestJSON = request.get_json(force=True)
    barCodeString = requestJSON['data']['barCodeString']
    barCodeHeight = requestJSON['data']['barCodeHeight']
    barCodeThickness = requestJSON['data']['barCodeThickness']
    barCodeQuietZone = requestJSON['data']['barCodeQuietZone']

    if(barCodeQuietZone == "true"):
        barCodeQuietZone = True
    else:
        barCodeQuietZone = False

    generateBarCode(barCodeString, barCodeHeight,
                    barCodeThickness, barCodeQuietZone)
    return {
        "fileName": "Barcode.png"
    }


# BUSINESS LOGIC FOR BARCODE GENERATION
def generateBarCode(barCodeString, barCodeHeight, barCodeThickness, barCodeQuietZone):
    CODE128_CHART = """
    0       212222  space   space   00
    1       222122  !       !       01
    2       222221  "       "       02
    3       121223  #       #       03
    4       121322  $       $       04
    5       131222  %       %       05
    6       122213  &       &       06
    7       122312  '       '       07
    8       132212  (       (       08
    9       221213  )       )       09
    10      221312  *       *       10
    11      231212  +       +       11
    12      112232  ,       ,       12
    13      122132  -       -       13
    14      122231  .       .       14
    15      113222  /       /       15
    16      123122  0       0       16
    17      123221  1       1       17
    18      223211  2       2       18
    19      221132  3       3       19
    20      221231  4       4       20
    21      213212  5       5       21
    22      223112  6       6       22
    23      312131  7       7       23
    24      311222  8       8       24
    25      321122  9       9       25
    26      321221  :       :       26
    27      312212  ;       ;       27
    28      322112  <       <       28
    29      322211  =       =       29
    30      212123  >       >       30
    31      212321  ?       ?       31
    32      232121  @      @      32
    33      111323  A       A       33
    34      131123  B       B       34
    35      131321  C       C       35
    36      112313  D       D       36
    37      132113  E       E       37
    38      132311  F       F       38
    39      211313  G       G       39
    40      231113  H       H       40
    41      231311  I       I       41
    42      112133  J       J       42
    43      112331  K       K       43
    44      132131  L       L       44
    45      113123  M       M       45
    46      113321  N       N       46
    47      133121  O       O       47
    48      313121  P       P       48
    49      211331  Q       Q       49
    50      231131  R       R       50
    51      213113  S       S       51
    52      213311  T       T       52
    53      213131  U       U       53
    54      311123  V       V       54
    55      311321  W       W       55
    56      331121  X       X       56
    57      312113  Y       Y       57
    58      312311  Z       Z       58
    59      332111  [       [       59
    60      314111  \       \       60
    61      221411  ]       ]       61
    62      431111  ^       ^       62
    63      111224  _       _       63
    64      111422  NUL     `       64
    65      121124  SOH     a       65
    66      121421  STX     b       66
    67      141122  ETX     c       67
    68      141221  EOT     d       68
    69      112214  ENQ     e       69
    70      112412  ACK     f       70
    71      122114  BEL     g       71
    72      122411  BS      h       72
    73      142112  HT      i       73
    74      142211  LF      j       74
    75      241211  VT      k       75
    76      221114  FF      l       76
    77      413111  CR      m       77
    78      241112  SO      n       78
    79      134111  SI      o       79
    80      111242  DLE     p       80
    81      121142  DC1     q       81
    82      121241  DC2     r       82
    83      114212  DC3     s       83
    84      124112  DC4     t       84
    85      124211  NAK     u       85
    86      411212  SYN     v       86
    87      421112  ETB     w       87
    88      421211  CAN     x       88
    89      212141  EM      y       89
    90      214121  SUB     z       90
    91      412121  ESC     {       91
    92      111143  FS      |       92
    93      111341  GS      }       93
    94      131141  RS      ~       94
    95      114113  US      DEL     95
    96      114311  FNC3    FNC3    96
    97      411113  FNC2    FNC2    97
    98      411311  ShiftB  ShiftA  98
    99      113141  CodeC   CodeC   99
    100     114131  CodeB   FNC4    CodeB
    101     311141  FNC4    CodeA   CodeA
    102     411131  FNC1    FNC1    FNC1
    103     211412  StartA  StartA  StartA
    104     211214  StartB  StartB  StartB
    105     211232  StartC  StartC  StartC
    106     2331112 Stop    Stop    Stop
    """.split()

    VALUES = [int(value) for value in CODE128_CHART[0::5]]
    WEIGHTS = dict(zip(VALUES, CODE128_CHART[1::5]))
    CODE128A = dict(zip(CODE128_CHART[2::5], VALUES))
    CODE128B = dict(zip(CODE128_CHART[3::5], VALUES))
    CODE128C = dict(zip(CODE128_CHART[4::5], VALUES))

    for charset in (CODE128A, CODE128B):
        charset[' '] = charset.pop('space')

    def code128_format(data):
        text = str(data)
        pos = 0
        length = len(text)

        # START CODE
        if text[:2].isdigit() and length > 1:
            charset = CODE128C
            codes = [charset['StartC']]
        else:
            charset = CODE128B
            codes = [charset['StartB']]

        # DATA
        while pos < length:
            if charset is CODE128C:
                if text[pos:pos+2].isdigit() and length - pos > 1:
                    # ENCODE CODE C TWO CHARACTERS AT A TIME
                    codes.append(int(text[pos:pos+2]))
                    pos += 2
                else:
                    # SWITCH TO CODE B
                    codes.append(charset['CodeB'])
                    charset = CODE128B
            elif text[pos:pos+4].isdigit() and length - pos >= 4:
                # SWITCH TO CODE C
                codes.append(charset['CodeC'])
                charset = CODE128C
            else:
                # ENCODE CODE B ONE CHARACTER AT A TIME
                codes.append(charset[text[pos]])
                pos += 1

        # CHECKSUM
        checksum = 0
        for weight, code in enumerate(codes):
            checksum += max(weight, 1) * code
        codes.append(checksum % 103)

        # STOP CODE
        codes.append(charset['Stop'])
        return codes

    def code128_image(data, height=100, thickness=3, quiet_zone=False):

        inputData = data
        if not data[-1] == CODE128B['Stop']:
            data = code128_format(data)

        barcode_widths = []
        for code in data:
            for weight in WEIGHTS[code]:
                barcode_widths.append(int(weight) * thickness)
        width = sum(barcode_widths)

        widthBkp = width
        x = 0

        if quiet_zone:
            width += 20 * thickness
            x = 10 * thickness

        # MONOCHROME IMAGE
        img = Image.new('1', (width, height+20), 1)
        draw = ImageDraw.Draw(img)
        draw_bar = True
        for width in barcode_widths:
            if draw_bar:
                draw.rectangle(((x, 10), (x + width - 1, height)), fill=0)
            draw_bar = not draw_bar
            x += width

        # FONTS
        font = ImageFont.truetype(
            "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf", 16, encoding="unic")

        # DRAW TEXT AT BOTTOM OF BARCODE
        draw.text((widthBkp/2, height), inputData, font=font, fill=0)

        # SAVING THE IMAGE
        img.save("Barcode.png")

    # TRIGGER FUNCTION
    code128_image(barCodeString, barCodeHeight,
                  barCodeThickness, barCodeQuietZone)


@app.route('/qrCode', methods=["POST"])
def qrCodeGenarator():
    requestJSON = request.get_json(force=True)
    qrCodeString = requestJSON['data']['qrCodeString']
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.nts.ERROR_CORRECT_L,
        box_size=6,
        border=4,
    )
    qr.add_data(qrCodeString)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white").convert("RGB")
    img.save("QRcode.png")

    return {
        "response_message": "QR-Code generation Success"
    }


@app.route('/otpGeneration', methods=["GET"])
def otpGeneration():
    return {"randomOTP": randomOTP(request.args["type"], request.args["length"])}


# BUSINESS LOGIC FOR OTP GENERATION
def randomOTP(OTP_TYPE, OTP_LENGTH):
    OTP_VALUE_ARRAY = []

    # ALLOCATE WHAT TYPE OF INPUT VALUES
    if (OTP_TYPE == "number"):
        OTP_VALUE_ARRAY = "0123456789"
    elif (OTP_TYPE == "alphabet"):
        OTP_VALUE_ARRAY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    else:
        OTP_VALUE_ARRAY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    a = 65539  # RANDOM VALUE
    max = Math.pow(2, 32)  # RANDOM VALUE

    alphabetRandom = ""
    for _ in range(int(OTP_LENGTH)):
        seed = round(time.time() * max)
        seed += (seed * a) + Math.log(max)
        x = abs(Math.sin(seed) * 10000)
        random = x - Math.floor(x)

        alphabetRandom += OTP_VALUE_ARRAY[int(random * len(OTP_VALUE_ARRAY))]

    return alphabetRandom


@app.route('/captchaGeneration', methods=["GET"])
def captchaGeneration():
    string = request.args["string"]
    # SETTING UP THE CANVAS BASE ELEMENTS
    randInt = random.randint(16, 50)
    length = len(string)
    img = np.zeros(((randInt*2)+5, length*randInt, 3), np.uint8)
    img_pil = Image.fromarray(img)

    # FONTS
    font = ImageFont.truetype(
        "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf", randInt, encoding="unic")

    draw = ImageDraw.Draw(img_pil)

    # TEXT DRAWING
    draw.text((40, 2), string, font=font,
              fill=(random.randint(0, 255), random.randint(0, 255), random.randint(0, 255)), stroke_width=1, anchor="la")

    for i in range(random.randint(3, 10)):
        start = 0
        end = length*randInt
        draw.line([start, end], fill=(random.randint(0, 255),
                                      random.randint(0, 255), random.randint(0, 255)))

    # ADDING NOISE AND BLUR
    img = np.array(img_pil)
    thresh = random.randint(1, 5)/100
    for i in range(img.shape[0]):
        for j in range(img.shape[1]):
            rdn = random.random()
            if rdn < thresh:
                img[i][j] = random.randint(0, 123)
            elif rdn > 1-thresh:
                img[i][j] = random.randint(123, 255)

    img = cv2.blur(img, (int(randInt/random.randint(7, 10)),
                         int(randInt/random.randint(7, 10))))

    # TO SAVE THE IMAGE
    cv2.imwrite(f"{os.getcwd()}/Captcha.png", img)

    # read the image
    # im = Image.open("./Captcha.png")

    # # rotate image
    # angle = 45
    # out = im.rotate(angle, expand=True)
    # out.save('./Captcha.png')

    return {"return_message": "Captcha Generation Success"}


@app.route('/electricalCalculator', methods=["POST"])
def electricalCalculator():
    requestJSON = request.get_json(force=True)
    value = requestJSON["data"]["value"]
    currentTypeIndex = int(requestJSON["data"]["currentTypeIndex"])

    if (currentTypeIndex == 1):
        current = float(value["current"][0])
        voltage = float(value["voltage"][0])
        currentUnit = value["current"][1]
        voltageUnit = value["voltage"][1]

        if (currentUnit == "mA"):
            current = current / 1000
        elif (currentUnit == "kA"):
            current = current * 1000
        else:
            current = current

        if (voltageUnit == "mV"):
            voltage = voltage / 1000
        elif (voltageUnit == "kV"):
            voltage = voltage * 1000
        else:
            voltage = voltage

        power = current * voltage / 1000
        return {
            "result": {
                "POWER_IN_KILOWATTS": f"{power} kW",
                "POWER_IN_WATTS": f"{power * 1000} W",
                "POWER_IN_MILLIWATTS": f"{power * 1000 * 1000} mW",
            }
        }
    elif (currentTypeIndex == 2):
        current = float(value["current"][0])
        voltage = float(value["voltage"][0])
        return {
            "result": {
                "POWER_IN_KILOVOLT_AMPS": f"{current * voltage / 1000} kVA"
            }
        }
    elif (currentTypeIndex == 3):
        current = float(value["current"][0])
        voltage = float(value["voltage"][0])
        return {
            "result": {
                "POWER_IN_VOLT_AMPS": f"{current * voltage} VA"
            }
        }
    elif (currentTypeIndex == 4):
        current = float(value["current"][0])
        ohms = float(value["ohms"][0])
        return {
            "result": {
                "VOLTAGE_IN_VOLTS": f"{current * ohms} V"
            }
        }
    elif (currentTypeIndex == 5):
        current = float(value["current"][0])
        power = float(value["power"][0])
        return {
            "result": {
                "VOLTAGE_IN_VOLTS": f"{power / current} V"
            }
        }
    elif (currentTypeIndex == 6):
        current = float(value["current"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "MILLI_AMPERE_HOURS": f"{current * duration * 1000} mAh"
            }
        }
    elif (currentTypeIndex == 7):
        power = float(value["power"][0])
        voltage = float(value["voltage"][0])
        voltageUnit = value["voltage"][1]
        if (voltageUnit == "mV"):
            voltage = voltage / 1000
        elif (voltageUnit == "kV"):
            voltage = voltage * 1000
        else:
            voltage = voltage
        amps = (1000 * power) / voltage
        return {
            "result": {
                "CURRENT_IN_KILO_AMPS": f"{amps / 1000} kA",
                "CURRENT_IN_AMPS": f"{amps} A",
                "CURRENT_IN_MILLI_AMPS": f"{amps * 1000} mA"
            }
        }
    elif (currentTypeIndex == 8):
        power = float(value["power"][0])
        powerFactor = float(value["powerFactor"][0])
        if (powerFactor < 0 or powerFactor > 1):
            return {
                "result": {
                    "OUT_OF_RANGE": "Enter Power Factor Between 0 to 1 (inclusive)"
                }
            }
        return {
            "result": {
                "APPARENT_POWER_IN_KILOVOLT_AMPS": f"{power / powerFactor} kVA"
            }
        }
    elif (currentTypeIndex == 9):
        power = float(value["power"][0])
        powerFactor = float(value["powerFactor"][0])
        if (powerFactor < 0 or powerFactor > 1):
            return {
                "result": {
                    "OUT_OF_RANGE": "Enter Power Factor Between 0 to 1 (inclusive)"
                }
            }
        return {
            "result": {
                "APPARENT_POWER_IN_VOLT_AMPS": f"{(1000 * power) / powerFactor} VA"
            }
        }
    elif (currentTypeIndex == 10):
        power = float(value["power"][0])
        current = float(value["current"][0])
        return {
            "result": {
                "VOLTAGE_IN_VOLTS": f"{(1000 * power) / current} V"
            }
        }
    elif (currentTypeIndex == 11):
        power = float(value["power"][0])
        return {
            "result": {
                "POWER_IN_WATTS": f"{1000 * power} W"
            }
        }
    elif (currentTypeIndex == 12):
        power = float(value["power"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "ENERGY_IN_JOULES": f"{1000 * power * duration} J"
            }
        }
    elif (currentTypeIndex == 13):
        power = float(value["power"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "ENERGY_IN_WATT_HOUR": f"{1000 * power * duration} Wh"
            }
        }
    elif (currentTypeIndex == 14):
        power = float(value["power"][0])
        voltage = float(value["voltage"][0])
        return {
            "result": {
                "CURRENT_IN_AMPS": f"{(1000 * power) / voltage} A"
            }
        }
    elif (currentTypeIndex == 15):
        power = float(value["power"][0])
        powerFactor = float(value["powerFactor"][0])
        if (powerFactor < 0 or powerFactor > 1):
            return {
                "result": {
                    "OUT_OF_RANGE": "Enter Power Factor Between 0 to 1 (inclusive)"
                }
            }
        return {
            "result": {
                "REAL_POWER_IN_KILO_WATTS": f"{power * powerFactor} kW"
            }
        }
    elif (currentTypeIndex == 16):
        power = float(value["power"][0])
        return {
            "result": {
                "APPARENT_POWER_IN_VOLT_AMPERE": f"{1000 * power} VA"
            }
        }
    elif (currentTypeIndex == 17):
        power = float(value["power"][0])
        current = float(value["current"][0])
        phaseNumber = int(value["selections"]["PhaseNumber"])
        if (phaseNumber == 1):
            return {
                "result": {
                    "VOLTAGE_LINE_TO_NEUTRAL": f"{(power * 1000) / current} V"
                }
            }
        elif (phaseNumber == 2):
            return {
                "result": {
                    "VOLTAGE_LINE_TO_NEUTRAL": f"{(power * 1000) / (current * 2)} V"
                }
            }
        else:
            return {
                "result": {
                    "VOLTAGE_LINE_TO_LINE": f"{(power * 1000) / (current * Math.sqrt(3))} V"
                }
            }
    elif (currentTypeIndex == 18):
        power = float(value["power"][0])
        powerFactor = float(value["powerFactor"][0])
        if (powerFactor < 0 or powerFactor > 1):
            return {
                "result": {
                    "OUT_OF_RANGE": "Enter Power Factor Between 0 to 1 (inclusive)"
                }
            }
        return {
            "result": {
                "REAL_POWER_IN_WATTS": f"{1000 * power * powerFactor} W"
            }
        }
    elif (currentTypeIndex == 19):
        power = float(value["power"][0])
        return {
            "result": {
                "JOULES_PER_SECOND": f"{1000 * power} J/s"
            }
        }
    elif (currentTypeIndex == 20):
        power = float(value["power"][0])
        voltage = float(value["voltage"][0])
        return {
            "result": {
                "CURRENT_IN_AMPS": f"{power / voltage} A"
            }
        }
    elif (currentTypeIndex == 21):
        power = float(value["power"][0])
        powerFactor = float(value["powerFactor"][0])
        if (powerFactor < 0 or powerFactor > 1):
            return {
                "result": {
                    "OUT_OF_RANGE": "Enter Power Factor Between 0 to 1 (inclusive)"
                }
            }
        return {
            "result": {
                "REAL_POWER_IN_KILO_WATTS": f"{(power * powerFactor) / 1000} kW"
            }
        }
    elif (currentTypeIndex == 22):
        power = float(value["power"][0])
        return {
            "result": {
                "APPARENT_POWER_IN_KILO_VOLT_AMPERE": f"{power / 1000} kVA"
            }
        }
    elif (currentTypeIndex == 23):
        power = float(value["power"][0])
        current = float(value["current"][0])

        phaseNumber = int(value["selections"]["PhaseNumber"])

        if (phaseNumber == 1):
            return {
                "result": {
                    "VOLTAGE_LINE_TO_NEUTRAL": f"{power / current} V"
                }
            }
        elif (phaseNumber == 2):
            return {
                "result": {
                    "VOLTAGE_LINE_TO_NEUTRAL": f"{power / (current * 2)} V"
                }
            }
        else:
            return {
                "result": {
                    "VOLTAGE_LINE_TO_LINE": f"{power / (current * Math.sqrt(3))} V"
                }
            }
    elif (currentTypeIndex == 24):
        power = float(value["power"][0])
        powerFactor = float(value["powerFactor"][0])

        if (powerFactor < 0 or powerFactor > 1):
            return {
                "result": {
                    "OUT_OF_RANGE": "Enter Power Factor Between 0 to 1 (inclusive)"
                }
            }
        return {
            "result": {
                "REAL_POWER_IN_WATTS": f"{power * powerFactor} W"
            }
        }
    elif (currentTypeIndex == 25):
        power = float(value["power"][0])
        return {
            "result": {
                "JOULES_PER_HOUR": f"{power * 3600} J/h",
                "JOULES_PER_SECOND": f"{power} J/s"
            }
        }
    elif (currentTypeIndex == 26):
        voltage = float(value["voltage"][0])
        ohms = float(value["ohms"][0])
        return {
            "result": {
                "CURRENT_IN_AMPS": f"{voltage / ohms} A"
            }
        }
    elif (currentTypeIndex == 27):
        voltage = float(value["voltage"][0])
        power = float(value["power"][0])
        return {
            "result": {
                "CURRENT_IN_AMPS": f"{power / voltage} A"
            }
        }
    elif (currentTypeIndex == 28):
        voltage = float(value["voltage"][0])
        current = float(value["current"][0])
        return {
            "result": {
                "POWER_IN_KILOWATTS": f"{(voltage * current) / 1000} kW"
            }
        }
    elif (currentTypeIndex == 29):
        voltage = float(value["voltage"][0])
        current = float(value["current"][0])
        phaseNumber = int(value["selections"]["PhaseNumber"])
        if (phaseNumber == 1):
            return {
                "result": {
                    "POWER_IN_KILO_VOLT_AMPERE_SINGLE_PHASE": f"{(voltage * current) / 1000} kVA"
                }
            }
        elif (phaseNumber == 2):
            return {
                "result": {
                    "POWER_IN_KILO_VOLT_AMPERE_BI_PHASE": f"{(2 * voltage * current) / 1000} kVA"
                }
            }
        else:
            return {
                "result": {
                    "POWER_IN_KILO_VOLT_AMPERE_THREE_PHASE": f"{(Math.sqrt(3) * voltage * current) / 1000} kVA"
                }
            }
    elif (currentTypeIndex == 30):
        voltage = float(value["voltage"][0])
        current = float(value["current"][0])
        phaseNumber = int(value["selections"]["PhaseNumber"])

        if (phaseNumber == 1):
            return {
                "result": {
                    "POWER_IN_VOLT_AMPERE_SINGLE_PHASE": f"{voltage * current} VA"
                }
            }
        elif (phaseNumber == 2):
            return {
                "result": {
                    "POWER_IN_VOLT_AMPERE_BI_PHASE": f"{2 * voltage * current} VA"
                }
            }
        else:
            return {
                "result": {
                    "POWER_IN_VOLT_AMPERE_THREE_PHASE": f"{Math.sqrt(3) * voltage * current} VA"
                }
            }
    elif (currentTypeIndex == 31):
        voltage = float(value["voltage"][0])
        current = float(value["current"][0])
        return {
            "result": {
                "POWER_IN_WATTS": f"{voltage * current} W"
            }
        }
    elif (currentTypeIndex == 32):
        voltage = float(value["voltage"][0])
        coulombs = float(value["coulombs"][0])
        return {
            "result": {
                "ENERGY_IN_JOULES": f"{voltage * coulombs} J"
            }
        }
    elif (currentTypeIndex == 33):
        power = float(value["power"][0])
        voltage = float(value["voltage"][0])

        voltageUnit = value["voltage"][1]

        if (voltageUnit == "mV"):
            voltage = voltage / 1000
        elif (voltageUnit == "kV"):
            voltage = voltage * 1000
        else:
            voltage = voltage

        amps = power / voltage
        return {
            "result": {
                "CURRENT_IN_KILO_AMPS": f"{amps / 1000} kA",
                "CURRENT_IN_AMPS": f"{amps} A",
                "CURRENT_IN_MILLI_AMPS": f"{amps * 1000} mA"
            }
        }
    elif (currentTypeIndex == 34):
        power = float(value["power"][0])
        return {
            "result": {
                "POWER_IN_KILO_WATT": f"{power / 1000} kW"
            }
        }
    elif (currentTypeIndex == 35):
        power = float(value["power"][0])
        powerFactor = float(value["powerFactor"][0])
        if (powerFactor < 0 or powerFactor > 1):
            return {
                "result": {
                    "OUT_OF_RANGE": "Enter Power Factor Between 0 to 1 (inclusive)"
                }
            }
        return {
            "result": {
                "APPARENT_POWER_IN_KILO_VOLT_AMPERE": f"{power / (1000 * powerFactor)} kVA"
            }
        }
    elif (currentTypeIndex == 36):
        power = float(value["power"][0])
        powerFactor = float(value["powerFactor"][0])
        if (powerFactor < 0 or powerFactor > 1):
            return {
                "result": {
                    "OUT_OF_RANGE": "Enter Power Factor Between 0 to 1 (inclusive)"
                }
            }
        return {
            "result": {
                "APPARENT_POWER_IN_VOLT_AMPERE": f"{power / powerFactor} VA"
            }
        }
    elif (currentTypeIndex == 37):
        power = float(value["power"][0])
        current = float(value["current"][0])
        return {
            "result": {
                "VOLTAGE_IN_VOLTS": f"{power / current} V"
            }
        }
    elif (currentTypeIndex == 38):
        power = float(value["power"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "ENERGY_IN_JOULES": f"{power * duration} J"
            }
        }
    elif (currentTypeIndex == 39):
        power = float(value["power"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "ENERGY_IN_WATT_HOUR": f"{power * duration} Wh"
            }
        }
    elif (currentTypeIndex == 40):
        joules = float(value["joules"][0])
        voltage = float(value["voltage"][0])
        return {
            "result": {
                "CURRENT_IN_AMPS": f"{joules / voltage} A"
            }
        }
    elif (currentTypeIndex == 41):
        joules = float(value["joules"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "POWER_IN_KILO_WATT": f"{joules / (1000 * duration)} kW"
            }
        }
    elif (currentTypeIndex == 42):
        joules = float(value["joules"][0])
        return {
            "result": {
                "POWER_IN_KILO_VOLT_AMPERE": f"{joules * 0.001} kVA"
            }
        }
    elif (currentTypeIndex == 43):
        joules = float(value["joules"][0])
        return {
            "result": {
                "POWER_IN_VOLT_AMPS": f"{joules} VA"
            }
        }
    elif (currentTypeIndex == 44):
        joules = float(value["joules"][0])
        coulombs = float(value["coulombs"][0])
        return {
            "result": {
                "VOLTAGE_IN_VOLTS": f"{joules / coulombs} V"
            }
        }
    elif (currentTypeIndex == 45):
        joules = float(value["joules"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "POWER_IN_WATTS": f"{joules / duration} W"
            }
        }
    elif (currentTypeIndex == 46):
        joules = float(value["joules"][0])
        return {
            "result": {
                "ENERGY_IN_WATT_HOUR": f"{joules / 3600} Wh"
            }
        }
    elif (currentTypeIndex == 47):
        mAh = float(value["mAh"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "CURRENT_IN_AMPS": f"{mAh / (duration * 1000)} A"
            }
        }
    elif (currentTypeIndex == 48):
        mAh = float(value["mAh"][0])
        voltage = float(value["voltage"][0])
        return {
            "result": {
                "ENERGY_IN_WATT_HOUR": f"{(mAh * voltage) / 1000} Wh"
            }
        }
    elif (currentTypeIndex == 49):
        energy = float(value["energy"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "POWER_IN_KILO_WATT": f"{energy / (1000 * duration)} kW"
            }
        }
    elif (currentTypeIndex == 50):
        energy = float(value["energy"][0])
        duration = float(value["duration"][0])
        return {
            "result": {
                "POWER_IN_WATT": f"{energy / duration} W"
            }
        }
    elif (currentTypeIndex == 51):
        energy = float(value["energy"][0])
        return {
            "result": {
                "JOULE": f"{energy * 3600} J"
            }
        }
    elif (currentTypeIndex == 52):
        energy = float(value["energy"][0])
        voltage = float(value["voltage"][0])

        return {
            "result": {
                "ELECTRICAL_CHARGE_IN_MILLIAMP_HOURS": f"{(1000 * energy) / voltage} mAh"
            }
        }


@app.route('/mathLog1', methods=["POST"])
def mathLog1():
    requestJSON = request.get_json(force=True)
    number = float(requestJSON["data"]["number"])
    base = float(requestJSON["data"]["base"])
    method = requestJSON["data"]["method"]
    print(number, base, method)

    if (method == "Logarithm"):
        # log n to the base 10
        COMMON_LOG = COMMON_LOG_FUNC(number)

        # log n to the base e
        # ln(number) = log(number) / log(2.71828)
        # MATH.LOG10E or Math.log10(2.71828) or COMMON_LOG_FUNC(2.71828, 10)
        NATURAL_LOG = COMMON_LOG / 0.4342944819032518

        # log n to the base 2 = log(n) / log 2
        # COMMON_LOG FOR THE NUMBER IS ALREADY CALCULATED
        # COMMON_LOG_FUNC(number, 10) - -- NATURAL_LOG
        # CALCULATE NATURAL LOG FOR NUMBER / NATURAL LOG FOR 2
        BINARY_LOG = COMMON_LOG / COMMON_LOG_FUNC(2)

        # log number to the base = log(n) / log base
        # COMMON_LOG FOR THE NUMBER IS ALREADY CALCULATED
        # COMMON_LOG_FUNC(number, 10) - -- NATURAL_LOG
        # FOR CUSTOM log 29 base 8 - -> NATURAL_LOG 29 / NATURAL_LOG 8
        CUSTOM_BASE_LOG = COMMON_LOG / COMMON_LOG_FUNC(base)

        print("Manual => COMMON LOG ", COMMON_LOG,
              "Using Math Library => ", Math.log10(number))
        print("Manual => NATURAL LOG", NATURAL_LOG,
              "Using Math Library => ", Math.log(number))
        print("Manual => BINARY LOG ", BINARY_LOG,
              "Using Math Library => ", Math.log2(number))
        print("Manual => CUSTOM BASE LOG", CUSTOM_BASE_LOG,
              "Using Math Library => ", Math.log10(number) / Math.log10(base))

        COMMON_LOG = checkInfinityAndConvertToString(COMMON_LOG)
        NATURAL_LOG = checkInfinityAndConvertToString(NATURAL_LOG)
        BINARY_LOG = checkInfinityAndConvertToString(BINARY_LOG)
        CUSTOM_BASE_LOG = checkInfinityAndConvertToString(CUSTOM_BASE_LOG)

        return {
            "result": {
                "BINARY_LOG": BINARY_LOG,
                "COMMON_LOG": COMMON_LOG,
                "NATURAL_LOG": NATURAL_LOG,
                "CUSTOM_BASE_LOG": CUSTOM_BASE_LOG
            }
        }
    else:
        #  FOR ANTI LOG
        COMMON_ANTI_LOG = 10 ** number
        NATURAL_ANTI_LOG = COMMON_ANTI_LOG / 0.4342944819032518
        BINARY_ANTI_LOG = 2 ** number
        CUSTOM_BASE_ANTI_LOG = base ** number

        print("Manual => COMMON ANTI LOG", COMMON_ANTI_LOG)
        print("Manual => NATURAL ANTI LOG ", NATURAL_ANTI_LOG)
        print("Manual => BINARY ANTI LOG ", BINARY_ANTI_LOG)
        print("Manual => CUSTOM BASE ANTI LOG ",
              CUSTOM_BASE_ANTI_LOG)

        COMMON_ANTI_LOG = checkInfinityAndConvertToString(COMMON_ANTI_LOG)
        NATURAL_ANTI_LOG = checkInfinityAndConvertToString(
            NATURAL_ANTI_LOG)
        BINARY_ANTI_LOG = checkInfinityAndConvertToString(BINARY_ANTI_LOG)
        CUSTOM_BASE_ANTI_LOG = checkInfinityAndConvertToString(
            CUSTOM_BASE_ANTI_LOG)

        return {
            "result": {
                "BINARY_ANTI_LOG": BINARY_ANTI_LOG,
                "CUSTOM_BASE_ANTI_LOG": CUSTOM_BASE_ANTI_LOG,
                "COMMON_ANTI_LOG": COMMON_ANTI_LOG,
                "NATURAL_ANTI_LOG": NATURAL_ANTI_LOG,
            }
        }


# COMMON LOG CALCULATOR
def COMMON_LOG_FUNC(number):
    answer = 0
    iterator = 0
    base = 10
    while (iterator < 50):
        power = 1
        incrementPower = 0
        while (power * base <= number):
            incrementPower = incrementPower + 1
            power = power * base

        print("Power", power)
        print("Increment Power", incrementPower)

        # TO BREAK WHEN GETTING SAME AS PREVIOUS
        answer = answer + incrementPower * (10 ** -iterator)
        print("Answer", answer)

        number = number / power
        print("Number", number)

        number = number ** base
        print("Number", number)

        iterator = iterator + 1

    print("Answer", answer)
    return answer


# CHECK FOR INFINITY AND CONVERTO TO STRING
def checkInfinityAndConvertToString(value):
    if (Math.isinf(value)):
        return str(value)
    else:
        return value


@app.route('/mathLog2', methods=["POST"])
def mathLog2():
    requestJSON = request.get_json(force=True)
    inputNumber = requestJSON["data"]["inputNumber"]
    nthRoot = requestJSON["data"]["nthRoot"]
    method = requestJSON["data"]["method"]
    print(inputNumber, nthRoot, method)
    # GCF AND LCM
    if (method == "Method-1"):
        # TYPECAST ALL VALUES TO INT
        inputNumber = list(map(int, inputNumber))
        LCM = inputNumber[0]

        for i in range(len(inputNumber)):
            LCM = LCM_FUNC(inputNumber[i], LCM)

        GCF = inputNumber[0]
        for i in range(len(inputNumber)):
            GCF = GCF_FUNC(inputNumber[i], GCF)
            if (GCF == 1):
                break  # IF GCF OF ANY IS 1 - IT WILL BE THE GCF

        return {
            "result": f"LCM = {LCM}  GCF = {GCF}"
        }
    elif method == "Method-2":
        # TYPECASE TO INT
        inputNumber = float(inputNumber)
        negativeFlag = False
        if (inputNumber < 0):
            negativeFlag = True
            inputNumber = inputNumber * -1

        SQRT = NTH_ROOT_FUNC(inputNumber, 2)
        CBRT = CBRT_FUNC(inputNumber)

        if (negativeFlag):
            SQRT = f"{SQRT}i"
            CBRT = f"-{CBRT}"

        print("Manual => ", SQRT, "Using Math Library => ",
              Math.sqrt(inputNumber))
        print("Manual => ", CBRT, "Using Math Library => ",
              np.cbrt(inputNumber))
        return {
            "result": f"SQRT = {SQRT}  CBRT = {CBRT}"
        }
    else:
        inputNumber = float(inputNumber)
        nthRoot = float(nthRoot)
        NTHROOT = NTH_ROOT_FUNC(inputNumber, nthRoot)
        print("Manual => ", NTHROOT, "Using Math Library => ",
              Math.pow(inputNumber, 1 / nthRoot))
        return {
            "result": f"NTH-ROOT = {NTHROOT}"
        }


# LCM CALCULATION HELPER FUNCTION
def LCM_FUNC(num1, num2):
    maximum = num1 if num1 > num2 else num2
    while (True):
        if (maximum % num1 == 0 and maximum % num2 == 0):
            return maximum
        maximum = maximum + 1


# GCF OR HCF OR GCD CALCULATION HELPER FUNCTION
def GCF_FUNC(num1, num2):
    if (num2 == 0):
        return num1
    return GCF_FUNC(num2, num1 % num2)


def CBRT_FUNC(number):
    iterator = 1
    precision = 0.000001

    while iterator * iterator * iterator <= number:
        iterator += 1

    iterator -= 1
    while iterator * iterator * iterator < number:
        iterator += precision

    return iterator


def NTH_ROOT_FUNC(number, nthRoot):
    print(type(number))
    print(type(nthRoot))
    return number ** (1 / nthRoot)


@app.route('/mathLog3', methods=["POST"])
def mathLog3():
    requestJSON = request.get_json(force=True)
    number = requestJSON["data"]["number"]
    method = requestJSON["data"]["method"]
    number = float(number)

    if (method == "Radian"):
        SIN = sinRadian(number)
        COS = sinRadian(Math.pi / 2 - number)
        TAN = SIN / COS
        COSEC = 1 / SIN
        SEC = 1 / COS
        COT = 1 / TAN

        print("Manual => SIN ", SIN, "Using Math Library => ", Math.sin(number))
        print("Manual => COS", COS, "Using Math Library => ", Math.cos(number))
        print("Manual => TAN ", TAN, "Using Math Library => ", Math.tan(number))
        print("Manual => COSEC", COSEC,
              "Using Math Library => ", 1 / Math.sin(number))
        print("Manual => SEC ", SEC, "Using Math Library => ", 1 / Math.cos(number))
        print("Manual => COT ", COT, "Using Math Library => ", 1 / Math.tan(number))

        return {
            "result": f"SIN = {SIN}  COS = {COS}  TAN = {TAN}  COSEC = {COSEC}  SEC = {SEC}  COT = {COT}"
        }
    elif(method == "Degree"):
        number2 = number
        number2 *= Math.pi / 180

        SIN_DEGREE = sinRadian(number2)
        COS_DEGREE = sinRadian(Math.pi / 2 - number2)
        TAN_DEGREE = SIN_DEGREE / COS_DEGREE
        COSEC_DEGREE = 1 / SIN_DEGREE
        SEC_DEGREE = 1 / COS_DEGREE
        COT_DEGREE = 1 / TAN_DEGREE

        print("Manual => SIN_DEGREE ", SIN_DEGREE,
              "Using Math Library => ", Math.sin(number2))
        print("Manual => COS_DEGREE", COS_DEGREE,
              "Using Math Library => ", Math.cos(number2))
        print("Manual => TAN_DEGREE ", TAN_DEGREE,
              "Using Math Library => ", Math.tan(number2))
        print("Manual => COSEC_DEGREE", COSEC_DEGREE,
              "Using Math Library => ", 1 / Math.sin(number2))
        print("Manual => SEC_DEGREE ", SEC_DEGREE,
              "Using Math Library => ", 1 / Math.cos(number2))
        print("Manual => COT_DEGREE ", COT_DEGREE,
              "Using Math Library => ", 1 / Math.tan(number2))

        return {
            "result": f"SIN_DEGREE {SIN_DEGREE}  COS_DEGREE {COS_DEGREE}  TAN_DEGREE {TAN_DEGREE}  COSEC_DEGREE {COSEC_DEGREE}  SEC_DEGREE {SEC_DEGREE}  COT_DEGREE {COT_DEGREE}"
        }
    else:
        ARC_SIN_RADIAN = Math.asin(number)
        ARC_COS_RADIAN = Math.acos(number)
        ARC_TAN_RADIAN = Math.atan(number)

        number2 = number
        number2 *= Math.pi / 180

        ARC_SIN_DEGREE = Math.asin(number2)
        ARC_COS_DEGREE = Math.acos(number2)
        ARC_TAN_DEGREE = Math.atan(number2)
        return {
            "result": f"ARC_SIN_RADIAN {ARC_SIN_RADIAN}  ARC_COS_RADIAN {ARC_COS_RADIAN}  ARC_TAN_RADIAN {ARC_TAN_RADIAN}  ARC_SIN_DEGREE {ARC_SIN_DEGREE}  ARC_COS_DEGREE {ARC_COS_DEGREE}  ARC_TAN_DEGREE {ARC_TAN_DEGREE}"
        }


def sinRadian(sinRadian):
    PI = 3.14159265358979323846

    sinRadian %= 2 * PI

    # if (sinRadian < 0) {
    #     sinRadian = 2 * PI - sinRadian;
    # }

    sign = 1
    if (sinRadian > PI):
        sinRadian -= PI
        sign = -1

    PRECISION = 50
    temp = 0

    for i in range(PRECISION+1):
        temp += Math.pow(-1, i) * (Math.pow(sinRadian,
                                            2 * i + 1) / fact(2 * i + 1))
    return sign * temp


def fact(num):
    if (num == 0 or num == 1):
        return 1
    else:
        return num * fact(num - 1)


@app.route('/statisticsCalculator', methods=["POST"])
def statisticsCalculator():
    requestJSON = request.get_json(force=True)
    inputNumber = requestJSON["data"]["inputNumber"]
    method = requestJSON["data"]["method"]
    print(inputNumber, method)

    if (method == "Method-1"):
        # TYPECAST ALL VALUES TO INT
        inputNumber = list(map(int, inputNumber))
        print(inputNumber)
        return {
            "result": STANDARD_DEVIATION_AND_ANCE(inputNumber)
        }
    else:
        # FIRST ARRAY VALUE IS FIRST ARRAY INPUT AND TYPECAST TO INT
        inputArray1 = inputNumber[0]
        inputArray1 = list(map(int, inputArray1))

        # SECOND ARRAY VALUE IS SECOND ARRAY INPUT AND TYPECAST TO INT
        inputArray2 = inputNumber[1]
        inputArray2 = list(map(int, inputArray2))

        return {
            "result": LINEAR_REGRESSION(inputArray1, inputArray2)
        }


def STANDARD_DEVIATION_AND_VARIANCE(inputNumberArray):
    # CALCULATE MEAN OF ARRAY
    mean = sum(inputNumberArray) / len(inputNumberArray)
    print(mean)

    # CALCULATE VARIANCE
    VARIANCE = []
    for value in inputNumberArray:
        VARIANCE.append((value - mean) ** 2)

    # POPULATION VARIANCE WITHOUT - 1
    POPULATION_VARIANCE = sum(VARIANCE) / len(VARIANCE)

    # POPULATION STANDARAD DEVIATION
    POPULATION_STANDARD_DEVIATION = NTH_ROOT_FUNC(POPULATION_VARIANCE, 2)

    # SAMPLE VARIANCE WITH - 1
    SAMPLE_VARIANCE = sum(VARIANCE) / (len(VARIANCE)-1)

    # SAMPLE STANDARAD DEVIATION
    SAMPLE_STANDARD_DEVIATION = NTH_ROOT_FUNC(SAMPLE_VARIANCE, 2)

    print(POPULATION_VARIANCE)
    print(POPULATION_STANDARD_DEVIATION)
    print(SAMPLE_VARIANCE)
    print(SAMPLE_STANDARD_DEVIATION)

    return f"POPULATION_VARIANCE = {POPULATION_VARIANCE}  POPULATION_STANDARD_DEVIATION = {POPULATION_STANDARD_DEVIATION}  SAMPLE_VARIANCE = {SAMPLE_VARIANCE}  SAMPLE_STANDARD_DEVIATION = {SAMPLE_STANDARD_DEVIATION}"
    # return {
    #     "POPULATION_VARIANCE": POPULATION_VARIANCE,
    #     "POPULATION_STANDARD_DEVIATION": POPULATION_STANDARD_DEVIATION,
    #     "SAMPLE_VARIANCE": SAMPLE_VARIANCE,
    #     "SAMPLE_STANDARD_DEVIATION": SAMPLE_STANDARD_DEVIATION
    # }


def LINEAR_REGRESSION(X, Y):
    sumX = sum(X)
    sumY = sum(Y)
    sumXX = 0
    sumXY = 0
    for i in range(len(X)):
        sumXX += X[i] * X[i]
        sumXY += X[i] * Y[i]

    print(sumX, sumY, sumXX, sumXY)

    # REF: https://www.mathportal.org/calculators/statistics-calculator/correlation-and-regression-calculator.php
    # FORMULA = > y = a + bx
    # FORMULA = > a = sumY * sumXX - sumX * sumXY / n * sumXX - (sumX * sumX)
    # FORMULA = > b = n * sumXY - sumX * sumY / n * sumXX - sumX * sumX

    # ANY ONE ARRAY LENGTH
    n = len(X)

    a = ((sumY * sumXX) - (sumX * sumXY)) / ((n * sumXX) - (sumX * sumX))
    b = ((n * sumXY) - (sumX * sumY)) / ((n * sumXX) - (sumX * sumX))

    # REGRESSION EQUATION = > Y = a + bx
    return f"Linear Regression Equation => {a} + {b}(x)"


if __name__ == "__main__":
    app.run(port=PORT)
