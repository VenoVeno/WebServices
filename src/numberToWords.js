function numberToWords(number) {
    let words = ""

    const LESS_THAN_TWENTY = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
        "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

    const TENTHS_LESS_THAN_HUNDRED = ['Zero', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty',
        'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    // IN CASE OF NEGATIVE ADD TO THE WORD AND CONVERT TO POSITIVE
    if (number < 0) {
        words += "Minus "
        number = number * -1
    }
    let remainder = 0
    if (number < 20) {
        words += LESS_THAN_TWENTY[number]
    } else if (number < 100) {
        words += TENTHS_LESS_THAN_HUNDRED[parseInt(number / 10)]
        remainder = number % 10
    } else if (number < 1000) {
        // RANGING FROM 100 - 999 -- One Hunderd to Nine Hundred and Ninety Nine
        words += numberToWords(parseInt(number / 100)) + " Hundred"
        remainder = number % 100
    } else if (number < 100000) {
        // RANGING FROM 1,000 - 99,999 -- One Thousand to Ninety Nine Thousand Nine Hundred Ninety Nine
        words += numberToWords(parseInt(number / 1000)) + " Thousand"
        remainder = number % 1000
    } else if (number < 10000000) {
        // RANGING FROM 1,00,000 - 99,99,999 -- One Lakh to Ninety Nine Lakhs Ninety Nine Thousand Nine Hundred Ninety Nine
        words += numberToWords(parseInt(number / 100000)) + " Lakh"
        remainder = number % 100000
        // } else if (number < 1000000000) {
    } else if (number >= 10000000) {
        // RANGING FROM 1,00,00,000 - 99,99,99,999 -- One Crore to Ninety Nine Crores Ninety Nine Lakhs Ninety Nine Thousand Nine Hundred and Ninety Nine
        words += numberToWords(parseInt(number / 10000000)) + " Crore"
        remainder = number % 10000000
    }
    if (remainder) words += " " + numberToWords(remainder)

    return words;
}

module.exports = {
    numberToWords
}
// for (let i = 999999990; i <= 1000000000; i++) {
//     console.log(i, numberToWords(i))
// }
// console.log(-17, numberToWords(-17))
// console.log(0, numberToWords(0))
// console.log(19, numberToWords(19))
// console.log(29, numberToWords(29))
// console.log(38, numberToWords(38))
// console.log(40, numberToWords(40))
// console.log(90, numberToWords(90))
// console.log(99, numberToWords(99))
// console.log(100, numberToWords(100))
// console.log(108, numberToWords(108))
// console.log(109, numberToWords(109))
// console.log(119, numberToWords(119))
// console.log(120, numberToWords(120))
// console.log(141, numberToWords(141))
// console.log(187, numberToWords(187))
// console.log(199, numberToWords(199))