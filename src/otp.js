function generateOTP(OTP_TYPE, OTP_LENGTH) {
    if (OTP_TYPE === "numbers") {
        const OTP_NUMBERS_LENGTH = OTP_LENGTH;

        var createRandom = (function () {
            var max = Math.pow(2, 32),
                seed;
            return {
                setSeed: function () {
                    seed = Math.round(new Date().getMilliseconds() * max);
                },
                rand: function () {
                    seed += (seed * seed) | 5;
                    return seed
                }
            };
        }());
        createRandom.setSeed()
        const random1 = createRandom.rand().toString()

        // ADD CHAR CODE OF EACH VALUE TO THE RANDOM
        let charCodeSum = 0
        for (let i = 0; i < random1.length; i++) {
            charCodeSum += random1.charCodeAt(i)
        }
        let random2 = parseInt(random1) + charCodeSum
        console.log(random2)

        let random2SecondPart = ""
        while (random2.toString().length !== OTP_NUMBERS_LENGTH) {
            random2SecondPart = random2 % 10 + random2SecondPart
            random2 = parseInt(random2 / 10)
        }

        random2SecondPart = parseInt(random2SecondPart)
        const random2FirstPart = parseInt(random2.toString().slice(0, OTP_NUMBERS_LENGTH))
        console.log(random2FirstPart, random2SecondPart)

        let random3 = random2FirstPart + random2SecondPart
        console.log(random3)

        let finalRandom = parseInt(random3.toString().slice(0, OTP_NUMBERS_LENGTH))
        while (random3.toString().length !== OTP_NUMBERS_LENGTH) {
            finalRandom = finalRandom + random3 % 10
            random3 = parseInt(random3 / 10)
        }
        // ADDITIONAL CONVERTION
        finalRandom = parseInt(finalRandom.toString().slice(0, OTP_NUMBERS_LENGTH))
        console.log(finalRandom)
        return finalRandom
    } else if (OTP_TYPE === "alphabets") {
        const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        var createRandom = (function () {
            var a = 65539;
            var max = Math.pow(2, 32),
                seed;
            return {
                setSeed: function () {
                    seed = Math.round(process.hrtime()[1] * max);
                },
                rand: function () {
                    seed += (seed * a) + Math.log(max);
                    return seed;
                }
            };
        }());

        let alphabetRandom = ""
        for (i = 0; i < OTP_LENGTH; i++) {
            createRandom.setSeed()
            var seed = createRandom.rand()
            var x = Math.abs(Math.sin(seed++) * 10000);
            let random = x - Math.floor(x);

            alphabetRandom += alphabets[parseInt(random * alphabets.length)]
        }
        return alphabetRandom
    }
}
for (let i = 1; i <= 10; i++) {
    // console.log("Numbers of length 6", generateOTP("numbers", 6))
    // let safeArray = generateOTP("alphabets", 6)
    console.log("Numbers of length ", i, generateOTP("alphabets", i))
}

// module.exports = {
//     generateOTP
// }