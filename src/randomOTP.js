function randomOTP(OTP_TYPE, OTP_LENGTH) {
    let OTP_VALUE_ARRAY = []

    // ALLOCATE WHAT TYPE OF INPUT VALUES
    if (OTP_TYPE === "number") OTP_VALUE_ARRAY = "0123456789"
    else if (OTP_TYPE === "alphabet") OTP_VALUE_ARRAY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    else OTP_VALUE_ARRAY = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

    var createRandom = (function () {
        var a = 65539; // RANDOM VALUE
        var max = Math.pow(2, 32), // RANDOM VALUE
            seed; // SEED REQUIRED FOR PROCESSING
        return {
            setSeed: function () {
                seed = Math.round(process.hrtime()[1] * max); // TIME IN NANO-SECONDS
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

        alphabetRandom += OTP_VALUE_ARRAY[parseInt(random * OTP_VALUE_ARRAY.length)]
    }
    return alphabetRandom
}

module.exports = {
    randomOTP
}