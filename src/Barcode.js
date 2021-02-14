const { createCanvas } = require('canvas')
const fs = require('fs')

function BarCodeCreation(barCodeString, barCodeHeight, barCodeThickness, barCodeQuietZone) {
    CODE128_CHART = `
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
    32      232121  @       @       32
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
    60      314111  \\       \\       60
    61      221411  ]       ]       61
    62      431111  ^       ^       62
    63      111224  _       _       63
    64      111422  NUL     \`       64
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
    106     2331112 Stop    Stop    Stop`

    const UPDATED_CODE128_CHART = CODE128_CHART.replace(/\s+/g, " ").trimStart().trimEnd().split(" ")

    let VALUES = []
    for (let value = 0; value < UPDATED_CODE128_CHART.length; value += 5) {
        VALUES.push(UPDATED_CODE128_CHART[value])
    }

    // ITERATOR FOR KEY
    let iterator = 0

    let WEIGHTS = {}
    for (let value = 1; value < UPDATED_CODE128_CHART.length; value += 5) {
        WEIGHTS[iterator++] = UPDATED_CODE128_CHART[value]
    }

    iterator = 0

    let CODE128A = {}
    for (let value = 2; value < UPDATED_CODE128_CHART.length; value += 5) {
        CODE128A[UPDATED_CODE128_CHART[value]] = iterator++
    }

    iterator = 0

    let CODE128B = {}
    for (let value = 3; value < UPDATED_CODE128_CHART.length; value += 5) {
        CODE128B[UPDATED_CODE128_CHART[value]] = iterator++
    }

    iterator = 0

    let CODE128C = {}
    for (let value = 4; value < UPDATED_CODE128_CHART.length; value += 5) {
        CODE128C[UPDATED_CODE128_CHART[value]] = iterator++
    }

    // FOR ADDING SPACE CHAR
    delete CODE128A["space"]
    CODE128A[" "] = 0

    delete CODE128B["space"]
    CODE128B[" "] = 0

    function code128_format(data) {
        const text = data.toString(), length = text.length
        let pos = 0

        let charset, codes
        // START CODE
        if (Number.isInteger(parseInt(text.slice(-2))) && length > 1) {
            charset = CODE128C
            codes = [charset['StartC']]
        }
        else {
            charset = CODE128B
            codes = [charset['StartB']]
        }
        console.log("Position and Length", pos, length)
        // DATA
        while (pos < length) {
            console.log("Iteration", pos)
            console.log("Codes", codes)
            if (JSON.stringify(charset) === JSON.stringify(CODE128C)) {
                console.log("If Loop 1")
                if (Number.isInteger(parseInt(text.slice(pos, pos + 2))) && length - pos > 1) {
                    // ENCODE CODE C TWO CHARACTERS AT A TIME
                    console.log("If Loop 1 Code Before Push", codes)
                    codes.push(parseInt(text.slice(pos, pos + 2)))
                    pos += 2
                    console.log("If Loop 1 Code After Push", codes)
                }
                else {
                    // SWITCH TO CODE B
                    console.log("If Loop 1 Else Code Before Push", codes)
                    codes.push(charset['CodeB'])
                    charset = CODE128B
                    console.log("If Loop 1 Else Code After Push", codes)
                }
            } else if (Number.isInteger(parseInt(text.slice(pos, pos + 4))) && length - pos >= 4) {
                // SWITCH TO CODE C
                console.log("Else If Loop 2 Code Before Push", codes)
                codes.push(charset['CodeC'])
                charset = CODE128C
                console.log("Else If Loop 2 Code After Push", codes)
            } else {
                // ENCODE CODE B ONE CHARACTER AT A TIME
                console.log("Else Loop 3 Code Before Push", codes)
                codes.push(charset[text[pos]])
                pos += 1
                console.log("Else Loop 3 Code After Push", codes)
            }
        }


        // CHECKSUM
        let checksum = 0
        for (let weight = 0; weight < codes.length; weight++) {
            checksum += Math.max(weight, 1) * codes[weight]
        }
        codes.push(checksum % 103)

        // STOP CODE
        codes.push(charset['Stop'])
        return codes
    }

    function code128_image(data, height = 100, thickness = 3, quiet_zone = true) {
        inputData = data
        if (!(data.slice(-1) == CODE128B['Stop'])) {
            data = code128_format(data)
        }

        let barcode_widths = []

        console.log(data)

        for (const code of data) {
            for (const weight of WEIGHTS[code]) {
                barcode_widths.push(parseInt(weight) * thickness)
            }
        }
        let width = barcode_widths.reduce((a, b) => a + b, 0)

        const widthBkp = width
        let x = 0

        if (quiet_zone) {
            width += 20 * thickness
            x = 10 * thickness
        }

        // MONOCHROME IMAGE
        const canvas = createCanvas(width + 97, height + 20)
        const context = canvas.getContext('2d')

        // FILL CANVAS WITH WHITE
        context.fillStyle = "white";
        context.rect(0, 0, canvas.width, canvas.height);

        let draw_bar = true

        for (let width = 0; width < barcode_widths.length; width++) {
            if (draw_bar) {
                // DRAW RECTANGLE
                context.beginPath();
                context.lineWidth = 4;
                context.strokeRect(x, 10, x + barcode_widths[width] - 1, height);
                context.fillStyle = "black";
                context.closePath()
                context.fill();
            }
            draw_bar = !draw_bar
            x += barcode_widths[width]
        }
        context.fillText(inputData, (widthBkp / 2), height + 20)
        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync('./Barcode.png', buffer)
        return
    }

    code128_image(barCodeString, barCodeHeight, barCodeThickness, barCodeQuietZone)
}

const Barcode128Svg = (function () {
    class Barcode128Svg {
        constructor(barCodeString, barCodeHeight, barCodeThickness, barCodeQuietZone) {
            this.barCodeString = barCodeString
            this.factor = barCodeThickness
            this.height = barCodeHeight
            this.barCodeQuietZone = barCodeQuietZone
        }
        toString() {
            var h = this.height, f = this.factor
            var svg = "\n", x = 10 * f, sum = 104
            var backupwidth

            if (!this.barCodeQuietZone)
                x = f
            function draw(d) {
                d.split("").forEach(function (n, i) {
                    svg += (i % 2) ? "\n" :
                        "<rect x=\"" + x + "\" y=\"0\" width=\"" + (+n * f) +
                        "\" height=\"" + h + "\" />"
                    backupwidth = x;
                    x += +n * f
                })
            }
            draw("211214")
            this.barCodeString.split("").forEach(function (c, i) {
                var l = lookup[c] || [0, ""]
                sum += l[0] * (i + 1)
                draw(l[1])
            })
            draw(data[sum % 103])
            draw("23311129")

            svg += "<text x=\"" + (backupwidth / 2) + "\" y=\"" + (this.height + 24) + "\" fill=\"black\" font-size=\"1.4em\" font-family=\"Ubuntu\">" + this.barCodeString + "</text>";

            console.log(svg)
            let end = x + f
            if (!this.barCodeQuietZone)
                end = x - 10 * f
            return "<svg xmlns=\"http://www.w3.org/2000/svg\" " +
                "xmlns:xlink=\"http://www.w3.org/1999/xlink\" version=\"1.1\" " +
                "height=\"" + h + "px\" viewBox=\"0,0," + end + "," + (h + 30) +
                "\">" + svg + "</svg>"
        }
        toDataUri() {
            return "data:image/svg+xml;base64," + Buffer.from(this.toString()).toString('base64')
        }
    }

    var lookup = {}, data = "212222222122222221121223121322131222122213122312132212221213221312231212112232122132122231113222123122123221223211221132221231213212223112312131311222321122321221312212322112322211212123212321232121111323131123131321112313132113132311211313231113231311112133112331132131113123113321133121313121211331231131213113213311213131311123311321331121312113312311332111314111221411431111111224111422121124121421141122141221112214112412122114122411142112142211241211221114413111241112134111111242121142121241114212124112124211411212421112421211212141214121412121111143111341131141114113114311411113411311113141114131311141411131".split(/(\d{6})/).filter(function (s) { return !!s });
    for (var i = 32; i < 127; i++)
        lookup[String.fromCharCode(i)] = [i - 32, data[i - 32]];

    return Barcode128Svg;
})();

module.exports = {
    BarCodeCreation,
    Barcode128Svg
}