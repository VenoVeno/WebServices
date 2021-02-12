const bodyParser = require('body-parser')
const cors = require('cors')

const express = require('express');
const app = express();

const PORT = 3000

const { newMD5 } = require('./src/md5');
const { numberToWords } = require('./src/numberToWords');
const { randomOTP } = require('./src/randomOTP');
const { captcha } = require('./src/captcha');
const { BarCodeCreation } = require('./src/Barcode');
const util = require('util')

const QRCode = require('qrcode')

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + ''));

app.post('/dateDiff', function (req, res) {
    try {
        const { inputData } = req.body.data
        console.log(inputData)
        const { fromDate, fromMonth, fromYear, fromHour, fromMinute, fromSecond,
            toDate, toMonth, toYear, toHour, toMinute, toSecond } = inputData

        const FROM_DATE = new Date(`${fromMonth}-${fromDate}-${fromYear} ${fromHour}:${fromMinute}:${fromSecond}`)
        const TO_DATE = new Date(`${toMonth}-${toDate}-${toYear} ${toHour}:${toMinute}:${toSecond}`)

        if (isNaN(FROM_DATE.getTime()) || isNaN(TO_DATE.getTime())) {
            res.send({
                dateDiff: "Invalid Input"
            })
        }
        console.log(FROM_DATE)
        console.log(TO_DATE)

        // DIFFERENCE BETWEEN TO DATES IN SECONDS
        let SECONDS_DATA = Math.abs(FROM_DATE - TO_DATE) / 1000
        console.log(SECONDS_DATA)

        // CALCULATE DAYS AND REMOVE THE DAYS FROM SECONDS_DATA
        let DAYS_DATA = Math.floor(SECONDS_DATA / 86400) // 24 * 60 * 60
        SECONDS_DATA = SECONDS_DATA - DAYS_DATA * 86400

        // CALCULATE HOURS AND REMOVE HOURS FROM SECONDS_DATA
        const hours = Math.floor(SECONDS_DATA / 3600) // 60 * 60
        SECONDS_DATA = SECONDS_DATA - hours * 3600

        // CALCULATE MINUTES AND REMOVE SECONDS FROM SECONDS_DATA
        const minutes = Math.floor(SECONDS_DATA / 60) % 60 // HOW MANY MINUTES 140 - 2mins
        SECONDS_DATA = SECONDS_DATA - minutes * 60

        // LEFTED SECONDS
        const seconds = SECONDS_DATA % 60

        // CONVERT DAYS TO YEAR:MONTH:DAYS
        let years = 0, months = 0, days = 0
        while (DAYS_DATA) {
            if (DAYS_DATA >= 365) {
                years++;
                DAYS_DATA = DAYS_DATA - 365;
            } else if (DAYS_DATA >= 30) {
                months++;
                DAYS_DATA = DAYS_DATA - 30
            } else {
                days++;
                DAYS_DATA = DAYS_DATA - 1
            }
        }

        console.log(`${years} Years ${months} Months ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`)
        res.send({
            dateDiff: `${years} Years ${months} Months ${days} Days ${hours} Hours ${minutes} Minutes ${seconds} Seconds`
        })
    } catch (error) {
        console.log("Some Error Occured while  getting date difference", error)
    }
})

app.post('/setTheory', function (req, res) {
    try {
        console.log(req.body.data)
        const { setAList, setBList } = req.body.data
        console.log(setAList, setBList)

        // UNION OF TWO ARRAY
        let union = [...setAList];
        for (let index = 0; index < setBList.length; index++) {
            const element = setBList[index];
            if (!union.includes(element)) {
                union = [...union, element]
            }
        }

        // UNION ALL
        const unionAll = [...setAList, ...setBList]

        // INTERSECTION OF TWO ARRAY
        const intersection = [...setAList].filter(x => setBList.includes(x))

        // A - B
        const AminusB = [...setAList].filter(x => !setBList.includes(x));

        // B - A
        const BminusA = [...setBList].filter(x => !setAList.includes(x));

        console.log("Union", union)
        console.log("Union All", unionAll)
        console.log("Intersection", intersection)
        console.log("AminusB", AminusB)
        console.log("BminusA", BminusA)

        res.send({
            setAList, setBList, union, unionAll, intersection, AminusB, BminusA
        })

    } catch (error) {
        console.log("Some Error Occured while Validating Set Theory", error)
    }
});

app.post('/matrixOperation', function (req, res) {
    try {
        console.log(req.body)
        const { matrix } = req.body.data
        console.log(util.inspect(matrix, false, null, true /* enable colors */))

        // TRANSPORSE OF MATRIX
        const transporse = Array.from({ length: matrix[0].length }, function (x, row) {
            return Array.from({ length: matrix.length }, function (x, col) {
                return matrix[col][row];
            });
        });
        console.log("Transporse", transporse)

        // LOWER LEFT TRIANGULAR
        const lowerLeft = Array.from({ length: matrix.length }, function (x, row) {
            return Array.from({ length: matrix[0].length }, function (x, col) {
                if (row >= matrix[0].length) return null
                else if (row >= col) return matrix[row][col]
                else return null
            });
        });
        console.log("Lower Left", lowerLeft)

        // LOWER RIGHT TRIANGULAR
        const lowerRight = Array.from({ length: matrix.length }, function (x, row) {
            const condition = matrix[0].length - row - 1;
            return Array.from({ length: matrix[0].length }, function (x, col) {
                if (row >= matrix[0].length) return null
                else if (col >= condition) return matrix[row][col]
                else return null
            });
        });
        console.log("Lower Right", lowerRight)

        // UPPER LEFT TRIANGULAR
        const upperLeft = Array.from({ length: matrix.length }, function (x, row) {
            return Array.from({ length: matrix[0].length }, function (x, col) {
                if (col >= matrix.length) return null
                else if (row <= col) return matrix[row][col]
                else return null
            });
        });
        console.log("Upper Left", upperLeft)

        // UPPER RIGHT TRIANGULAR
        const jStart = matrix[0].length > matrix.length ? matrix[0].length - matrix.length : 0;
        const upperRight = Array.from({ length: matrix.length }, function (x, row) {
            const condition = matrix[0].length - row - 1;
            return Array.from({ length: matrix[0].length }, function (x, col) {
                // if (col >= matrix.length) return null
                if (col >= jStart && col <= condition) return matrix[row][col]
                else return null
            });
        });
        console.log("Upper Right", upperRight)
        res.send({
            transporse,
            lowerLeft, lowerRight,
            upperLeft, upperRight
        })

    } catch (error) {
        console.log("Some Error Occured performing Matrix Operation", error)
    }
})

app.get('/numToWordRupee', function (req, res) {
    try {
        if (req.query.amount.length > 15)
            res.send({
                word: "Unsupported Digit Count"
            })
        res.send({
            word: numberToWords(parseInt(req.query.amount))
        })
    } catch (error) {
        console.log("Some Error Occured while Converting Number To Rupee", error)
    }
})

app.post('/rsaEncDec', function (req, res) {
    try {
        const { type } = req.body.data

        if (type == "Encryption") {
            console.log("Encryption To be done!")
            const { inputString } = req.body.data
            const PUBLIC_PRIVATE = GENERATE_KEY_PAIR_RSA()
            console.log(PUBLIC_PRIVATE)
            const public = PUBLIC_PRIVATE[0], private = PUBLIC_PRIVATE[1]

            // ENCRYPT THE MESSAGE USING PUBLIC KEY
            ENCRYPTED_ARRAY = ENCRYPT_RSA(public, inputString)

            res.send({
                "PUBLIC_KEY": public,
                "PRIVATE_KEY": private,
                "ORIGINAL_TEXT": inputString,
                "ENCRYPTED_MESSAGE": ENCRYPTED_ARRAY
            })
        } else {
            console.log("Decryption To be Done!")
            const { encryptedArray, privateKeyArray } = req.body.data

            // DECRYPT THE MESSAGE USING PUBLIC KEY
            DECRYPTED_TEXT = DECRYPT_RSA(privateKeyArray, encryptedArray)

            res.send({
                "ORIGINAL_TEXT": DECRYPTED_TEXT
            })
        }
    } catch (error) {
        console.log("Some Error Occured While performing RSA Encryption and Decryption ", error)
    }
})

// GENERATE PUBLIC AND PRIVAT KEY VALUE PAIR RANDOMISED
function GENERATE_KEY_PAIR_RSA() {
    // INITIALISING PRIME RANGE
    const minPrime = 0, maxPrime = 100

    // GET CATCHED PRIMES
    j = 0
    let cached_primes = []
    for (let i = minPrime; i < maxPrime; i++)
        if (IS_PRIME_RSA(i)) cached_primes[j++] = i

    // RANDOM PRIME
    const p = cached_primes[Math.floor(Math.random() * cached_primes.length)]
    const q = cached_primes[Math.floor(Math.random() * cached_primes.length)]

    const n = p * q
    const phi = (p - 1) * (q - 1)

    let e = Math.floor(Math.random() * phi) + 1; // RANGE FROM 1 to PHI
    let g = GCF_FUNC(e, phi)


    while (g != 1) {
        e = Math.floor(Math.random() * phi) + 1
        g = GCF_FUNC(e, phi)
    }

    d = MULTIPLICATIVE_INVERSE_RSA(e, phi)
    return [[e, n], [d, n]]
}

// RSA ENCRYPTION DECRYPTION HELPER FUNCTION
function MULTIPLICATIVE_INVERSE_RSA(e, phi) {
    let d = 0, x1 = 0, x2 = 1, y1 = 1, temp_phi = phi

    while (e > 0) {
        const temp1 = parseInt(temp_phi / e)
        const temp2 = temp_phi - temp1 * e
        temp_phi = e
        e = temp2

        const x = x2 - temp1 * x1
        const y = d - temp1 * y1

        x2 = x1
        x1 = x
        d = y1
        y1 = y
    }

    if (temp_phi == 1)
        return d + phi
}

// RSA ENCRYPTION DECRYPTION HELPER FUNCTION
function IS_PRIME_RSA(num) {
    if (num == 2) return true
    if (num < 2 || num % 2 == 0) return false
    for (let n = 3; n < parseInt(num ** 0.5) + 2; n += 2) {
        if (num % n == 0) return false
    }
    return true
}

// RSA ENCRYPTION DECRYPTION HELPER FUNCTION
function ENCRYPT_RSA(pk, plaintext) {
    console.log(plaintext)
    const key = pk[0], n = pk[1]
    let cipher = []
    for (let char = 0; char < plaintext.length; char++) {
        cipher.push((plaintext[char].charCodeAt(0) ** key) % n)
    }
    console.log(cipher)
    return cipher
}

// RSA ENCRYPTION DECRYPTION HELPER FUNCTION
function DECRYPT_RSA(pk, ciphertext) {
    const key = pk[0], n = pk[1]
    let aux = []
    for (let char = 0; char < ciphertext.length; char++) {
        aux.push(((ciphertext[char] ** key) % n).toString())
    }
    console.log(aux)
    let plain = ""
    for (let char2 = 0; char2 < aux.length; char2++) {
        const varia = parseInt(aux[char2])
        console.log(String.fromCharCode(varia))

        plain += String.fromCharCode(parseInt(aux[char2]))
    }

    console.log("Plain", plain)
    return plain
}

app.get("/md5sum", function (req, res) {
    try {
        const { string } = req.query;
        res.send({
            // res: MD5(string),
            checksum: newMD5(string)
        })
    } catch (error) {
        console.log("Some Error Occured while Calculating Checksum", error)
    }
})

app.post('/barCode', function (req, res) {
    try {
        let { barCodeString, barCodeHeight, barCodeThickness, barCodeQuietZone } = req.body.data

        if (barCodeQuietZone == true) barCodeQuietZone = true
        else barCodeQuietZone = false

        BarCodeCreation(barCodeString, barCodeHeight, barCodeThickness, barCodeQuietZone)

        res.send({
            "return_message": "Barcode Creation Success"
        })
    } catch (error) {
        console.log("Some Error Occurred While Generating 128-bit Bar Code ", error)
    }
})

app.post('/qrCode', function (req, res) {
    try {
        const { qrCodeString } = req.body.data
        QRCode.toFile("./QRcode.png", qrCodeString, {}, function (err) {
            if (err) console.log("Some Error While Generating QR Code")
            res.send({
                response_message: "QR-Code generation Success"
            })
        })

    } catch (error) {
        console.log("Some Error Occurred While Generating QR Code ", error)
    }
})

app.get('/otpGeneration', function (req, res) {
    try {
        res.send({
            randomOTP: randomOTP(req.query.type, req.query.length)
        })
    } catch (error) {
        console.log("Some Error Occured while generating OTP", error)
    }
})

app.get('/captchaGeneration', function (req, res) {
    try {
        res.send({
            return_message: captcha(req.query.string)
        })
    } catch (error) {
        console.log("Some Error Occured while generating Captcha", error)
    }
})

app.post('/electricalCalculator', function (req, res) {
    try {
        // (Amps, kW, kVA, VA, volts, watts, joules, mAh, Wh)

        const { value, currentTypeIndex } = req.body.data
        console.log(value, currentTypeIndex)
        if (currentTypeIndex === 1) {
            let current = parseFloat(value["current"][0])
            let voltage = parseFloat(value["voltage"][0])

            const currentUnit = value["current"][1]
            const voltageUnit = value["voltage"][1]

            // BASED ON UNIT ADJUST THE CURRENT TO A
            if (currentUnit === "mA") {
                current = current / 1000;
            } else if (currentUnit === "kA") {
                current = current * 1000;
            } else {
                current = current;
            }

            // BASED ON UNIT ADJUST THE VOLTAGE TO V
            if (voltageUnit === "mV") {
                voltage = voltage / 1000;
            } else if (voltageUnit === "kV") {
                voltage = voltage * 1000;
            } else {
                voltage = voltage;
            }

            // P(kW) = I(A) × V(V) / 1000
            const power = current * voltage / 1000
            res.send({
                result: {
                    POWER_IN_KILOWATTS: `${power} kW`,
                    POWER_IN_WATTS: `${power * 1000} W`,
                    POWER_IN_MILLIWATTS: `${power * 1000 * 1000} mW`,
                }
            })
        } else if (currentTypeIndex === 2) {
            const current = parseFloat(value["current"][0])
            const voltage = parseFloat(value["voltage"][0])

            // P(kVA) = I(A) × V(V) / 1000
            const power = current * voltage / 1000
            res.send({
                result: {
                    POWER_IN_KILOVOLT_AMPS: `${power} kVA`
                }
            })
        } else if (currentTypeIndex === 3) {
            const current = parseFloat(value["current"][0])
            const voltage = parseFloat(value["voltage"][0])

            // P(VA) = I(A) × V(V)
            const power = current * voltage
            res.send({
                result: {
                    POWER_IN_VOLT_AMPS: `${power} VA`
                }
            })
        } else if (currentTypeIndex === 4) {
            const current = parseFloat(value["current"][0])
            const ohms = parseFloat(value["ohms"][0])

            // V(V) = I(A) × R(Ω)
            const volts = current * ohms
            res.send({
                result: {
                    VOLTAGE_IN_VOLTS: `${volts} V`
                }
            })
        } else if (currentTypeIndex === 5) {
            const current = parseFloat(value["current"][0])
            const power = parseFloat(value["power"][0])

            // V(V) = P(W) / I(A)
            const volts = power / current
            res.send({
                result: {
                    VOLTAGE_IN_VOLTS: `${volts} V`
                }
            })
        } else if (currentTypeIndex === 6) {
            const current = parseFloat(value["current"][0])
            const duration = parseFloat(value["duration"][0])

            // mah = I(A) * (h) * 1000
            const milliampere_hours = current * duration * 1000
            res.send({
                result: {
                    MILLI_AMPERE_HOURS: `${milliampere_hours} mAh`
                }
            })
        } else if (currentTypeIndex === 7) {
            let power = parseFloat(value["power"][0])
            let voltage = parseFloat(value["voltage"][0])

            // const powerUnit = value["power"][1]
            const voltageUnit = value["voltage"][1]

            // // BASED ON UNIT ADJUST THE POWER TO (kW)
            // if (powerUnit === "mW") {
            //     power = power / 1000000;
            // } else if (powerUnit === "W") {
            //     power = power / 1000;
            // } else {
            //     power = power;
            // }

            // BASED ON UNIT ADJUST THE VOLTAGE TO V
            if (voltageUnit === "mV") {
                voltage = voltage / 1000;
            } else if (voltageUnit === "kV") {
                voltage = voltage * 1000;
            } else {
                voltage = voltage;
            }

            // I(A) = 1000 × P(kW) / V(V)
            const amps = (1000 * power) / voltage
            res.send({
                result: {
                    CURRENT_IN_KILO_AMPS: `${amps / 1000} kA`,
                    CURRENT_IN_AMPS: `${amps} A`,
                    CURRENT_IN_MILLI_AMPS: `${amps * 1000} mA`
                }
            })
        } else if (currentTypeIndex === 8) {
            const power = parseFloat(value["power"][0])
            const powerFactor = parseFloat(value["powerFactor"][0])

            if (powerFactor < 0 || powerFactor > 1) {
                res.send({
                    result: {
                        OUT_OF_RANGE: "Enter Power Factor Between 0 to 1 (inclusive)"
                    }
                })
            }

            // APPARENT_POWER (kVA) =  P(kW) / PF
            const kilovolt_amps = power / powerFactor
            res.send({
                result: {
                    APPARENT_POWER_IN_KILOVOLT_AMPS: `${kilovolt_amps} kVA`
                }
            })
        } else if (currentTypeIndex === 9) {
            const power = parseFloat(value["power"][0])
            const powerFactor = parseFloat(value["powerFactor"][0])

            if (powerFactor < 0 || powerFactor > 1) {
                res.send({
                    result: {
                        OUT_OF_RANGE: "Enter Power Factor Between 0 to 1 (inclusive)"
                    }
                })
            }

            // APPARENT_POWER (VA) =  1000 × P(kW) / PF
            const volt_amps = (1000 * power) / powerFactor
            res.send({
                result: {
                    APPARENT_POWER_IN_VOLT_AMPS: `${volt_amps} VA`
                }
            })
        } else if (currentTypeIndex === 10) {
            const power = parseFloat(value["power"][0])
            const current = parseFloat(value["current"][0])

            // V(V) = 1000 × P(kW) / I(A)
            const voltage = (1000 * power) / current
            res.send({
                result: {
                    VOLTAGE_IN_VOLTS: `${voltage} V`
                }
            })
        } else if (currentTypeIndex === 11) {
            const power = parseFloat(value["power"][0])

            // P(W) = 1000 * P(kW)
            const watts = 1000 * power
            res.send({
                result: {
                    POWER_IN_WATTS: `${watts} W`
                }
            })
        } else if (currentTypeIndex === 12) {
            const power = parseFloat(value["power"][0])
            const duration = parseFloat(value["duration"][0])

            // E(J) = 1000 × P(kW) × t(s)
            const energy = 1000 * power * duration
            res.send({
                result: {
                    ENERGY_IN_JOULES: `${energy} J`
                }
            })
        } else if (currentTypeIndex === 13) {
            const power = parseFloat(value["power"][0])
            const duration = parseFloat(value["duration"][0])

            // E(Wh) = 1000 × P(kW) × t(h)
            const energy = 1000 * power * duration
            res.send({
                result: {
                    ENERGY_IN_WATT_HOUR: `${energy} Wh`
                }
            })
        } else if (currentTypeIndex === 14) {
            const power = parseFloat(value["power"][0])
            const voltage = parseFloat(value["voltage"][0])

            // I(A) = 1000 × APPARENT_POWER S(kVA) / V(V)
            const current = (1000 * power) / voltage
            res.send({
                result: {
                    CURRENT_IN_AMPS: `${current} A`
                }
            })
        } else if (currentTypeIndex === 15) {
            const power = parseFloat(value["power"][0])
            const powerFactor = parseFloat(value["powerFactor"][0])

            if (powerFactor < 0 || powerFactor > 1) {
                res.send({
                    result: {
                        OUT_OF_RANGE: "Enter Power Factor Between 0 to 1 (inclusive)"
                    }
                })
            }

            // P(kW) =  APPARENT_POWER S(kVA) × PF
            const real_power = power * powerFactor
            res.send({
                result: {
                    REAL_POWER_IN_KILO_WATTS: `${real_power} kW`
                }
            })
        } else if (currentTypeIndex === 16) {
            const power = parseFloat(value["power"][0])

            // APPARENT_POWER S(VA) =  1000 × APPARENT_POWER S(kVA)
            const apparent_power_volt_ampere = 1000 * power
            res.send({
                result: {
                    APPARENT_POWER_IN_VOLT_AMPERE: `${apparent_power_volt_ampere} VA`
                }
            })
        } else if (currentTypeIndex === 17) {
            // CONVERT kVA TO VA THEN USE METHODS VA TO V
            // OR MULTIPLY BY 1000 ALL

            const power = parseFloat(value["power"][0])
            const current = parseFloat(value["current"][0])

            // APPARENT_POWER S(VA) =  1000 × APPARENT_POWER S(kVA)
            // const powerInVA = 1000 * power

            const phaseNumber = parseInt(value["selections"]["PhaseNumber"])

            // https://www.calculatorsconversion.com/en/kva-to-volts-formula-examples-table/

            if (phaseNumber === 1) {
                // V(L-N) = kVA(1Ø) / I(AC(1Ø))
                const voltage = (power * 1000) / current
                res.send({
                    result: {
                        VOLTAGE_LINE_TO_NEUTRAL: `${voltage} V`
                    }
                })
            } else if (phaseNumber === 2) {
                // V(L-N) = kVA(2Ø) / I(AC(2Ø)) * 2
                const voltage = (power * 1000) / (current * 2)
                res.send({
                    result: {
                        VOLTAGE_LINE_TO_NEUTRAL: `${voltage} V`
                    }
                })
            } else {
                // V(L-L) = kVA(3Ø) / I(AC(3Ø)) * SQRT(3)
                const voltage = (power * 1000) / (current * Math.sqrt(3))
                res.send({
                    result: {
                        VOLTAGE_LINE_TO_LINE: `${voltage} V`
                    }
                })
            }

        } else if (currentTypeIndex === 18) {
            const power = parseFloat(value["power"][0])
            const powerFactor = parseFloat(value["powerFactor"][0])

            if (powerFactor < 0 || powerFactor > 1) {
                res.send({
                    result: {
                        OUT_OF_RANGE: "Enter Power Factor Between 0 to 1 (inclusive)"
                    }
                })
            }

            // REAL_POWER P(W) =  1000 × APPARENT_POWER S(kVA) × PF
            const real_power_in_watts = 1000 * power * powerFactor

            res.send({
                result: {
                    REAL_POWER_IN_WATTS: `${real_power_in_watts} W`
                }
            })
        } else if (currentTypeIndex === 19) {
            const power = parseFloat(value["power"][0])

            // JOULES_PER_SECOND (J/s) =  1000 × KILO_VOLT_AMPERE (kVA)
            const joules_per_second = 1000 * power
            res.send({
                result: {
                    JOULES_PER_SECOND: `${joules_per_second} J/s`
                }
            })
        } else if (currentTypeIndex === 20) {
            const power = parseFloat(value["power"][0])
            const voltage = parseFloat(value["voltage"][0])

            // I(A) = APPARENT_POWER S(VA) / V(V)
            const current = power / voltage
            res.send({
                result: {
                    CURRENT_IN_AMPS: `${current} A`
                }
            })
        } else if (currentTypeIndex === 21) {
            const power = parseFloat(value["power"][0])
            const powerFactor = parseFloat(value["powerFactor"][0])

            if (powerFactor < 0 || powerFactor > 1) {
                res.send({
                    result: {
                        OUT_OF_RANGE: "Enter Power Factor Between 0 to 1 (inclusive)"
                    }
                })
            }

            // REAL_POWER P(kW) =  APPARENT_POWER S(VA) × PF / 1000
            const real_power = (power * powerFactor) / 1000
            res.send({
                result: {
                    REAL_POWER_IN_KILO_WATTS: `${real_power} kW`
                }
            })
        } else if (currentTypeIndex === 22) {
            const power = parseFloat(value["power"][0])

            // APPARENT_POWER S(kVA) =  APPARENT_POWER S(VA) / 1000
            const apparent_power_kilo_volt_ampere = power / 1000
            res.send({
                result: {
                    APPARENT_POWER_IN_KILO_VOLT_AMPERE: `${apparent_power_kilo_volt_ampere} kVA`
                }
            })
        } else if (currentTypeIndex === 23) {
            const power = parseFloat(value["power"][0])
            const current = parseFloat(value["current"][0])

            const phaseNumber = parseInt(value["selections"]["PhaseNumber"])

            // https://www.calculatorsconversion.com/en/va-to-volts-calculator-formula-example-and-table/

            if (phaseNumber === 1) {
                // V(L-N) = VA(1Ø) / I(AC(1Ø))
                const voltage = power / current
                res.send({
                    result: {
                        VOLTAGE_LINE_TO_NEUTRAL: `${voltage} V`
                    }
                })
            } else if (phaseNumber === 2) {
                // V(L-N) = VA(2Ø) / I(AC(2Ø)) * 2
                const voltage = power / (current * 2)
                res.send({
                    result: {
                        VOLTAGE_LINE_TO_NEUTRAL: `${voltage} V`
                    }
                })
            } else {
                // V(L-L) = VA(3Ø) / I(AC(3Ø)) * SQRT(3)
                const voltage = power / (current * Math.sqrt(3))
                res.send({
                    result: {
                        VOLTAGE_LINE_TO_LINE: `${voltage} V`
                    }
                })
            }
        } else if (currentTypeIndex === 24) {
            const power = parseFloat(value["power"][0])
            const powerFactor = parseFloat(value["powerFactor"][0])

            if (powerFactor < 0 || powerFactor > 1) {
                res.send({
                    result: {
                        OUT_OF_RANGE: "Enter Power Factor Between 0 to 1 (inclusive)"
                    }
                })
            }

            // REAL_POWER P(W) =  APPARENT_POWER S(VA) × PF
            const real_power_in_watts = power * powerFactor

            res.send({
                result: {
                    REAL_POWER_IN_WATTS: `${real_power_in_watts} W`
                }
            })
        } else if (currentTypeIndex === 25) {
            const power = parseFloat(value["power"][0])

            // JOULES_PER_HOUR (J/h) =  VOLT_AMPERE (VA) * 3600 J/h
            const joules_per_hour = power * 3600
            res.send({
                result: {
                    JOULES_PER_HOUR: `${joules_per_hour} J/h`,
                    JOULES_PER_SECOND: `${power} J/s`
                }
            })
        } else if (currentTypeIndex === 26) {
            const voltage = parseFloat(value["voltage"][0])
            const ohms = parseFloat(value["ohms"][0])

            // I(A) = V(V) / R(Ω)
            const current = voltage / ohms
            res.send({
                result: {
                    CURRENT_IN_AMPS: `${current} A`
                }
            })
        } else if (currentTypeIndex === 27) {
            const voltage = parseFloat(value["voltage"][0])
            const power = parseFloat(value["power"][0])

            // I(A) = P(W) / V(V)
            const current = power / voltage
            res.send({
                result: {
                    CURRENT_IN_AMPS: `${current} A`
                }
            })
        } else if (currentTypeIndex === 28) {
            const voltage = parseFloat(value["voltage"][0])
            const current = parseFloat(value["current"][0])

            // P(kW) = V(V) × I(A) / 1000
            const power = (voltage * current) / 1000
            res.send({
                result: {
                    POWER_IN_KILOWATTS: `${power} kW`
                }
            })
        } else if (currentTypeIndex === 29) {
            const voltage = parseFloat(value["voltage"][0])
            const current = parseFloat(value["current"][0])

            const phaseNumber = parseInt(value["selections"]["PhaseNumber"])

            // https://www.calculatorsconversion.com/en/calculator-volts-to-kva-formula-examples-and-chart/

            if (phaseNumber === 1) {
                // kVA(1Ø) = (V(L-N) * I(AC)) / 1000
                const power = (voltage * current) / 1000
                res.send({
                    result: {
                        POWER_IN_KILO_VOLT_AMPERE_SINGLE_PHASE: `${power} kVA`
                    }
                })
            } else if (phaseNumber === 2) {
                // kVA(2Ø) = (2 * V(L-N) * I(AC)) / 1000
                const power = (2 * voltage * current) / 1000
                res.send({
                    result: {
                        POWER_IN_KILO_VOLT_AMPERE_BI_PHASE: `${power} kVA`
                    }
                })
            } else {
                // kVA(3Ø) = (SQRT(3) * V(L-L) * I(AC)) / 1000
                const power = (Math.sqrt(3) * voltage * current) / 1000
                res.send({
                    result: {
                        POWER_IN_KILO_VOLT_AMPERE_THREE_PHASE: `${power} kVA`
                    }
                })
            }
        } else if (currentTypeIndex === 30) {
            const voltage = parseFloat(value["voltage"][0])
            const current = parseFloat(value["current"][0])

            const phaseNumber = parseInt(value["selections"]["PhaseNumber"])

            // https://www.calculatorsconversion.com/en/volts-to-va-conversion-formula-example-and-table/

            if (phaseNumber === 1) {
                // VA(1Ø) = V(L-N) * I(AC)
                const power = voltage * current
                res.send({
                    result: {
                        POWER_IN_VOLT_AMPERE_SINGLE_PHASE: `${power} VA`
                    }
                })
            } else if (phaseNumber === 2) {
                // VA(2Ø) = 2 * V(L-N) * I(AC)
                const power = 2 * voltage * current
                res.send({
                    result: {
                        POWER_IN_VOLT_AMPERE_BI_PHASE: `${power} VA`
                    }
                })
            } else {
                // VA(3Ø) = SQRT(3) * V(L-L) * I(AC)
                const power = Math.sqrt(3) * voltage * current
                res.send({
                    result: {
                        POWER_IN_VOLT_AMPERE_THREE_PHASE: `${power} VA`
                    }
                })
            }
        } else if (currentTypeIndex === 31) {
            const voltage = parseFloat(value["voltage"][0])
            const current = parseFloat(value["current"][0])

            // P(W) = V(V) × I(A)
            const power = voltage * current
            res.send({
                result: {
                    POWER_IN_WATTS: `${power} W`
                }
            })
        } else if (currentTypeIndex === 32) {
            const voltage = parseFloat(value["voltage"][0])
            const coulombs = parseFloat(value["coulombs"][0])

            // E(J) = V(V) × Q(C)
            const energy = voltage * coulombs
            res.send({
                result: {
                    ENERGY_IN_JOULES: `${energy} J`
                }
            })
        } else if (currentTypeIndex === 33) {
            let power = parseFloat(value["power"][0])
            let voltage = parseFloat(value["voltage"][0])

            // const powerUnit = value["power"][1]
            const voltageUnit = value["voltage"][1]

            // BASED ON UNIT ADJUST THE POWER TO W
            // if (powerUnit === "mA") {
            //     power = power / 1000;
            // } else if (powerUnit === "kA") {
            //     power = power * 1000;
            // } else {
            //     power = power;
            // }

            // BASED ON UNIT ADJUST THE VOLTAGE TO V
            if (voltageUnit === "mV") {
                voltage = voltage / 1000;
            } else if (voltageUnit === "kV") {
                voltage = voltage * 1000;
            } else {
                voltage = voltage;
            }

            // I(A) = P(W) / V(V)
            const amps = power / voltage
            res.send({
                result: {
                    CURRENT_IN_KILO_AMPS: `${amps / 1000} kA`,
                    CURRENT_IN_AMPS: `${amps} A`,
                    CURRENT_IN_MILLI_AMPS: `${amps * 1000} mA`
                }
            })
        } else if (currentTypeIndex === 34) {
            const power = parseFloat(value["power"][0])

            // P(kW) = P(W) / 1000
            const power_in_kilo_watt = power / 1000
            res.send({
                result: {
                    POWER_IN_KILO_WATT: `${power_in_kilo_watt} kW`
                }
            })
        } else if (currentTypeIndex === 35) {
            const power = parseFloat(value["power"][0])
            const powerFactor = parseFloat(value["powerFactor"][0])

            if (powerFactor < 0 || powerFactor > 1) {
                res.send({
                    result: {
                        OUT_OF_RANGE: "Enter Power Factor Between 0 to 1 (inclusive)"
                    }
                })
            }

            // APPARENT_POWER S(kVA) =  REAL_POWER P(W) / (1000 × PF)
            const apparent_power_in_kilo_volt_ampere = power / (1000 * powerFactor)

            res.send({
                result: {
                    APPARENT_POWER_IN_KILO_VOLT_AMPERE: `${apparent_power_in_kilo_volt_ampere} kVA`
                }
            })
        } else if (currentTypeIndex === 36) {
            const power = parseFloat(value["power"][0])
            const powerFactor = parseFloat(value["powerFactor"][0])

            if (powerFactor < 0 || powerFactor > 1) {
                res.send({
                    result: {
                        OUT_OF_RANGE: "Enter Power Factor Between 0 to 1 (inclusive)"
                    }
                })
            }

            // APPARENT_POWER S(VA) = REAL_POWER P(W) / PF
            const apparent_power_in_volt_ampere = power / powerFactor

            res.send({
                result: {
                    APPARENT_POWER_IN_VOLT_AMPERE: `${apparent_power_in_volt_ampere} VA`
                }
            })
        } else if (currentTypeIndex === 37) {
            const power = parseFloat(value["power"][0])
            const current = parseFloat(value["current"][0])

            // V(V) = P(W) / I(A)
            const volts = power / current

            res.send({
                result: {
                    VOLTAGE_IN_VOLTS: `${volts} V`
                }
            })
        } else if (currentTypeIndex === 38) {
            const power = parseFloat(value["power"][0])
            const duration = parseFloat(value["duration"][0])

            // E(J) = P(W) × t(s)
            const energy = power * duration

            res.send({
                result: {
                    ENERGY_IN_JOULES: `${energy} J`
                }
            })
        } else if (currentTypeIndex === 39) {
            const power = parseFloat(value["power"][0])
            const duration = parseFloat(value["duration"][0])

            // E(Wh) = P(W) × t(h)
            const energy = power * duration

            res.send({
                result: {
                    ENERGY_IN_WATT_HOUR: `${energy} Wh`
                }
            })
        } else if (currentTypeIndex === 40) {
            const joules = parseFloat(value["joules"][0])
            const voltage = parseFloat(value["voltage"][0])

            // 1 J/s = 1 V*A --> FIRST CONVERT JOULES PER SECOND TO VOLT AMPERE
            const voltAmps = joules

            // THEN CONVERT VOLT AMPS TO AMPS
            // I(A) = APPARENT_POWER S(VA) / V(V)
            const current = voltAmps / voltage

            res.send({
                result: {
                    CURRENT_IN_AMPS: `${current} A`
                }
            })
        } else if (currentTypeIndex === 41) {
            const joules = parseFloat(value["joules"][0])
            const duration = parseFloat(value["duration"][0])

            // P(kW) = E(J) / (1000 × t(s))
            const power = joules / (1000 * duration)

            res.send({
                result: {
                    POWER_IN_KILO_WATT: `${power} kW`
                }
            })
        } else if (currentTypeIndex === 42) {
            const joules = parseFloat(value["joules"][0])

            // 1 J/s = 0.001 kVA
            const power = joules * 0.001

            res.send({
                result: {
                    POWER_IN_KILO_VOLT_AMPERE: `${power} kVA`
                }
            })
        } else if (currentTypeIndex === 43) {
            const joules = parseFloat(value["joules"][0])

            // 1 J/s = 1 VA
            const power = joules

            res.send({
                result: {
                    POWER_IN_VOLT_AMPS: `${power} VA`
                }
            })
        } else if (currentTypeIndex === 44) {
            const joules = parseFloat(value["joules"][0])
            const coulombs = parseFloat(value["coulombs"][0])

            // V(V) = E(J) / Q(C)
            const volts = joules / coulombs

            res.send({
                result: {
                    VOLTAGE_IN_VOLTS: `${volts} V`
                }
            })
        } else if (currentTypeIndex === 45) {
            const joules = parseFloat(value["joules"][0])
            const duration = parseFloat(value["duration"][0])

            // P(W) = E(J) / t(s)
            const power = joules / duration

            res.send({
                result: {
                    POWER_IN_WATTS: `${power} W`
                }
            })
        } else if (currentTypeIndex === 46) {
            const joules = parseFloat(value["joules"][0])

            // 1 Wh = 3600 J
            // 1 J = 1 Wh / 3600 = 0.00027777777777778 Wh
            const energy = joules / 3600

            res.send({
                result: {
                    ENERGY_IN_WATT_HOUR: `${energy} Wh`
                }
            })
        } else if (currentTypeIndex === 47) {
            const mAh = parseFloat(value["mAh"][0])
            const duration = parseFloat(value["duration"][0])

            // A = mAh / (duration * 1000)
            const amps = mAh / (duration * 1000)

            res.send({
                result: {
                    CURRENT_IN_AMPS: `${amps} A`
                }
            })
        } else if (currentTypeIndex === 48) {
            const mAh = parseFloat(value["mAh"][0])
            const voltage = parseFloat(value["voltage"][0])

            // E(Wh) = Q(mAh) × V(V) / 1000
            const energy = (mAh * voltage) / 1000

            res.send({
                result: {
                    ENERGY_IN_WATT_HOUR: `${energy} Wh`
                }
            })
        } else if (currentTypeIndex === 49) {
            const energy = parseFloat(value["energy"][0])
            const duration = parseFloat(value["duration"][0])

            // P(kW) = E(Wh) / (1000 × t(h))
            const power = energy / (1000 * duration)

            res.send({
                result: {
                    POWER_IN_KILO_WATT: `${power} kW`
                }
            })
        } else if (currentTypeIndex === 50) {
            const energy = parseFloat(value["energy"][0])
            const duration = parseFloat(value["duration"][0])

            // P(W) = E(Wh) / t(h)
            const power = energy / duration

            res.send({
                result: {
                    POWER_IN_WATT: `${power} W`
                }
            })
        } else if (currentTypeIndex === 51) {
            const energy = parseFloat(value["energy"][0])

            // 1 Wh = 3600 J
            const joules = energy * 3600

            res.send({
                result: {
                    JOULE: `${joules} J`
                }
            })
        } else if (currentTypeIndex === 52) {
            const energy = parseFloat(value["energy"][0])
            const voltage = parseFloat(value["voltage"][0])

            // Q(mAh) = 1000 × E(Wh) / V(V)
            const charge = (1000 * energy) / voltage

            res.send({
                result: {
                    ELECTRICAL_CHARGE_IN_MILLIAMP_HOURS: `${charge} mAh`
                }
            })
        }
    } catch (error) {
        console.log("Some Error Occured while generating Captcha", error)
    }
})

app.post('/mathLog2', function (req, res) {
    try {
        let { inputNumber, method, nthRoot } = req.body.data
        console.log(inputNumber, method)
        // GCF AND LCM
        if (method === "Method-1") {
            // TYPECASE ALL VALUES TO INT
            inputNumber = inputNumber.map(value => +value)
            let LCM = inputNumber[0]
            for (let i = 1; i < inputNumber.length; i++) {
                LCM = LCM_FUNC(inputNumber[i], LCM)
            }
            let GCF = inputNumber[0]
            for (let i = 1; i < inputNumber.length; i++) {
                GCF = GCF_FUNC(inputNumber[i], GCF)
                if (GCF === 1) break; // IF GCF OF ANY IS 1 - IT WILL BE THE GCF
            }
            res.send({
                result: `LCM = ${LCM}  GCF = ${GCF}`
            })
        } else if (method === "Method-2") {
            // TYPECASE TO INT
            inputNumber = parseFloat(inputNumber)
            let negativeFlag
            if (inputNumber < 0) {
                negativeFlag = true
                inputNumber = inputNumber * -1
            }

            let SQRT = NTH_ROOT_FUNC(inputNumber, 2)
            let CBRT = CBRT_FUNC(inputNumber)
            if (negativeFlag) SQRT = `${SQRT}i`
            if (negativeFlag) CBRT = `-${CBRT}`
            console.log("Manual => ", SQRT, "Using Math Library => ", Math.sqrt(inputNumber))
            console.log("Manual => ", CBRT, "Using Math Library => ", Math.cbrt(inputNumber))
            res.send({
                result: `SQRT = ${SQRT}  CBRT = ${CBRT}`
            })
        } else {
            let NTHROOT = NTH_ROOT_FUNC(inputNumber, nthRoot)
            console.log("Manual => ", NTHROOT, "Using Math Library => ", Math.pow(inputNumber, 1 / nthRoot))
            res.send({
                result: `NTH-ROOT = ${NTHROOT}`
            })
        }
    } catch (error) {
        console.log("Some Error Occured While Calculating Math Log 2 ", error)
    }
})

app.post('/mathLog1', function (req, res) {
    try {
        const { number, base, method } = req.body.data

        if (method === "Logarithm") {
            // log n to the base 10
            let COMMON_LOG = COMMON_LOG_FUNC(number)

            // log n to the base e
            // ln(number) = log(number) / log(2.71828)
            let NATURAL_LOG = COMMON_LOG / 0.4342944819032518 // MATH.LOG10E or Math.log10(2.71828) or COMMON_LOG_FUNC(2.71828, 10)

            // log n to the base 2 = log (n) / log 2
            // COMMON_LOG FOR THE NUMBER IS ALREADY CALCULATED
            // COMMON_LOG_FUNC(number, 10) --- NATURAL_LOG
            let BINARY_LOG = COMMON_LOG / COMMON_LOG_FUNC(2) // CALCULATE NATURAL LOG FOR NUMBER / NATURAL LOG FOR 2 

            // log number to the base = log (n) / log base
            // COMMON_LOG FOR THE NUMBER IS ALREADY CALCULATED
            // COMMON_LOG_FUNC(number, 10) --- NATURAL_LOG
            let CUSTOM_BASE_LOG = COMMON_LOG / COMMON_LOG_FUNC(base) // FOR CUSTOM log 29 base 8 --> NATURAL_LOG 29 / NATURAL_LOG 8

            console.log("Manual => COMMON LOG ", COMMON_LOG, "Using Math Library => ", Math.log10(number))
            console.log("Manual => NATURAL LOG", NATURAL_LOG, "Using Math Library => ", Math.log(number))
            console.log("Manual => BINARY LOG ", BINARY_LOG, "Using Math Library => ", Math.log2(number))
            console.log("Manual => CUSTOM BASE LOG", CUSTOM_BASE_LOG, "Using Math Library => ", Math.log10(number) / Math.log10(base))

            COMMON_LOG = checkInfinityAndConvertToString(COMMON_LOG)
            NATURAL_LOG = checkInfinityAndConvertToString(NATURAL_LOG)
            BINARY_LOG = checkInfinityAndConvertToString(BINARY_LOG)
            CUSTOM_BASE_LOG = checkInfinityAndConvertToString(CUSTOM_BASE_LOG)
            res.send({
                result: {
                    BINARY_LOG,
                    COMMON_LOG,
                    NATURAL_LOG,
                    CUSTOM_BASE_LOG
                }
            })
        } else {
            // FOR ANTI LOG
            let COMMON_ANTI_LOG = 10 ** number
            let NATURAL_ANTI_LOG = COMMON_ANTI_LOG / 0.4342944819032518
            let BINARY_ANTI_LOG = 2 ** number
            let CUSTOM_BASE_ANTI_LOG = base ** number

            console.log("Manual => COMMON ANTI LOG", COMMON_ANTI_LOG)
            console.log("Manual => NATURAL ANTI LOG ", NATURAL_ANTI_LOG)
            console.log("Manual => BINARY ANTI LOG ", BINARY_ANTI_LOG)
            console.log("Manual => CUSTOM BASE ANTI LOG ", CUSTOM_BASE_ANTI_LOG)

            COMMON_ANTI_LOG = checkInfinityAndConvertToString(COMMON_ANTI_LOG)
            NATURAL_ANTI_LOG = checkInfinityAndConvertToString(NATURAL_ANTI_LOG)
            BINARY_ANTI_LOG = checkInfinityAndConvertToString(BINARY_ANTI_LOG)
            CUSTOM_BASE_ANTI_LOG = checkInfinityAndConvertToString(CUSTOM_BASE_ANTI_LOG)

            res.send({
                result: {
                    BINARY_ANTI_LOG,
                    CUSTOM_BASE_ANTI_LOG,
                    COMMON_ANTI_LOG,
                    NATURAL_ANTI_LOG,
                }
            })
        }
    } catch (error) {
        console.log("Some Error Occured While Calculating Log 1", error)
    }
})

app.post('/mathLog3', function (req, res) {
    try {
        let { number, method } = req.body.data
        console.log(number)
        number = parseFloat(number)

        if (method === "Radian") {
            const SIN = sinRadian(number)
            const COS = sinRadian(Math.PI / 2 - number)
            const TAN = SIN / COS
            const COSEC = 1 / SIN
            const SEC = 1 / COS
            const COT = 1 / TAN

            console.log("Manual => SIN ", SIN, "Using Math Library => ", Math.sin(number))
            console.log("Manual => COS", COS, "Using Math Library => ", Math.cos(number))
            console.log("Manual => TAN ", TAN, "Using Math Library => ", Math.tan(number))
            console.log("Manual => COSEC", COSEC, "Using Math Library => ", 1 / Math.sin(number))
            console.log("Manual => SEC ", SEC, "Using Math Library => ", 1 / Math.cos(number))
            console.log("Manual => COT ", COT, "Using Math Library => ", 1 / Math.tan(number))

            res.send({
                result: `SIN = ${SIN}  COS = ${COS}  TAN = ${TAN}  COSEC = ${COSEC}  SEC = ${SEC}  COT = ${COT}`
            })
        } else if (method == "Degree") {
            let number2 = number
            number2 *= Math.PI / 180

            const SIN_DEGREE = sinRadian(number2)
            const COS_DEGREE = sinRadian(Math.PI / 2 - number2)
            const TAN_DEGREE = SIN_DEGREE / COS_DEGREE
            const COSEC_DEGREE = 1 / SIN_DEGREE
            const SEC_DEGREE = 1 / COS_DEGREE
            const COT_DEGREE = 1 / TAN_DEGREE

            console.log("Manual => SIN_DEGREE ", SIN_DEGREE, "Using Math Library => ", Math.sin(number2))
            console.log("Manual => COS_DEGREE", COS_DEGREE, "Using Math Library => ", Math.cos(number2))
            console.log("Manual => TAN_DEGREE ", TAN_DEGREE, "Using Math Library => ", Math.tan(number2))
            console.log("Manual => COSEC_DEGREE", COSEC_DEGREE, "Using Math Library => ", 1 / Math.sin(number2))
            console.log("Manual => SEC_DEGREE ", SEC_DEGREE, "Using Math Library => ", 1 / Math.cos(number2))
            console.log("Manual => COT_DEGREE ", COT_DEGREE, "Using Math Library => ", 1 / Math.tan(number2))

            res.send({
                result: `SIN_DEGREE ${SIN_DEGREE}  COS_DEGREE ${COS_DEGREE}  TAN_DEGREE ${TAN_DEGREE}  COSEC_DEGREE ${COSEC_DEGREE}  SEC_DEGREE ${SEC_DEGREE}  COT_DEGREE ${COT_DEGREE}`
            })
        } else {
            const ARC_SIN_RADIAN = Math.asin(number)
            const ARC_COS_RADIAN = Math.acos(number)
            const ARC_TAN_RADIAN = Math.atan(number)

            let number2 = number
            number2 *= Math.PI / 180

            const ARC_SIN_DEGREE = Math.asin(number2)
            const ARC_COS_DEGREE = Math.acos(number2)
            const ARC_TAN_DEGREE = Math.atan(number2)
            res.send({
                result: `ARC_SIN_RADIAN ${ARC_SIN_RADIAN}  ARC_COS_RADIAN ${ARC_COS_RADIAN}  ARC_TAN_RADIAN ${ARC_TAN_RADIAN}  ARC_SIN_DEGREE ${ARC_SIN_DEGREE}  ARC_COS_DEGREE ${ARC_COS_DEGREE}  ARC_TAN_DEGREE ${ARC_TAN_DEGREE}  `
            })
        }

        // let result = (16 * number * (3.14 - number)) / ((5 * (3.14 ** 2)) - (4 * 3.14 * (3.14 - number)));
    } catch (error) {
        console.log("Some Error Occured While Calculatin math log 3", error)
    }
})

function sinRadian(sinRadian) {
    const PI = 3.14159265358979323846;

    sinRadian %= 2.0 * PI;

    // if (sinRadian < 0) {
    //     sinRadian = 2 * PI - sinRadian;
    // }

    let sign = 1;
    if (sinRadian > PI) {
        sinRadian -= PI;
        sign = -1;
    }

    let PRECISION = 50;
    let temp = 0;
    for (let i = 0; i <= PRECISION; i++) {
        temp += Math.pow(-1, i) * (Math.pow(sinRadian, 2 * i + 1) / fact(2 * i + 1));
    }
    console.log(temp)
    return sign * temp;
}

function fact(num) {
    if (num == 0 || num == 1)
        return 1;
    else
        return num * fact(num - 1);
}

function checkInfinityAndConvertToString(value) {
    if (value == Infinity) return value.toString()
    else return value
}

app.post('/statisticsCalculator', function (req, res) {
    try {
        let { inputNumber, method } = req.body.data
        if (method === "Method-1") {
            // TYPECASE ALL VALUES TO INT
            inputNumber = inputNumber.map(value => +value)
            console.log(inputNumber)
            res.send({
                result: STANDARD_DEVIATION_AND_VARIANCE(inputNumber)
            })
        } else {
            // FIRST ARRAY VALUE IS FIRST ARRAY INPUT AND TYPECAST TO INT
            let inputArray1 = inputNumber[0]
            inputArray1 = inputArray1.map(value => +value)

            // SECOND ARRAY VALUE IS SECOND ARRAY INPUT AND TYPECAST TO INT
            let inputArray2 = inputNumber[1]
            inputArray2 = inputArray2.map(value => +value)

            res.send({
                result: LINEAR_REGRESSION(inputArray1, inputArray2)
            })
        }
    } catch (error) {
        console.log("Some Error Occured While Calculating Statics Calculator", error)
    }
})


// LCM CALCULATION HELPER FUNCTION
function LCM_FUNC(num1, num2) {
    let maximum = num1 > num2 ? num1 : num2;
    while (true) {
        if (maximum % num1 === 0 && maximum % num2 === 0) {
            return maximum
        }
        maximum++
    }
}

// GCF OR HCF OR GCD CALCULATION HELPER FUNCTION
function GCF_FUNC(num1, num2) {
    if (num2 === 0)
        return num1
    return GCF_FUNC(num2, num1 % num2)
}

// SQUARE ROOT OF NUMBER
// function SQRT_FUNC(number) {
//     let SQRT
//     // TO FIND INTEGER PART
//     for (let i = 0; i * i <= number; i++) {
//         if (i * i <= number)
//             SQRT = i
//     }
//     let increment = 0.1
//     for (let iterator = 0; iterator < 10; iterator++) {
//         while (SQRT * SQRT <= number) {
//             SQRT += increment;
//         }
//         SQRT = SQRT - increment;
//         increment = increment / 10;
//     }
//     return SQRT
// }

// function SQRT_FUNC(number) {
//     if (number === 0 || number === 1) return number
//     var square = 1, i = 0;
//     while (true) {
//         square = (number / square + square) / 2;
//         if (++i == number + 1) { break; }
//     }
//     return square;
// }

// function CBRT_FUNC(number) {
//     if (number === 0 || number === 1) return number
//     var cube = 1, i = 0;
//     while (true) {
//         cube = (2 * number + cube + (cube * cube)) / 3;
//         console.log(cube)
//         if (++i == number + 1) { break; }
//     }
//     return cube;
// }

function CBRT_FUNC(number) {
    let iterator, precision = 0.000001;

    for (iterator = 1; (iterator * iterator * iterator) <= number; ++iterator);
    for (--iterator; (iterator * iterator * iterator) < number; iterator += precision);

    return iterator;
}

function NTH_ROOT_FUNC(number, nthRoot) {
    return number ** (1 / nthRoot)
}

function STANDARD_DEVIATION_AND_VARIANCE(inputNumberArray) {
    // CALCULATE MEAN OF ARRAY
    const mean = inputNumberArray
        .reduce((accumulator, value) => accumulator + value, 0) / inputNumberArray.length

    // CALCULATE VARIANCE
    const VARIANCE = inputNumberArray
        .reduce(function (accumulator, value) {
            accumulator.push((value - mean) ** 2)
            return accumulator
        }, [])

    // POPULATION VARIANCE WITHOUT -1
    const POPULATION_VARIANCE = VARIANCE
        .reduce((accumulator, value) => accumulator + value, 0) / inputNumberArray.length

    // POPULATION STANDARAD DEVIATION
    const POPULATION_STANDARD_DEVIATION = NTH_ROOT_FUNC(POPULATION_VARIANCE, 2)

    // SAMPLE VARIANCE WITH -1
    const SAMPLE_VARIANCE = VARIANCE
        .reduce((accumulator, value) => accumulator + value, 0) / (inputNumberArray.length - 1)

    // SAMPLE STANDARAD DEVIATION
    const SAMPLE_STANDARD_DEVIATION = NTH_ROOT_FUNC(SAMPLE_VARIANCE, 2)

    console.log(POPULATION_VARIANCE)
    console.log(POPULATION_STANDARD_DEVIATION)
    console.log(SAMPLE_VARIANCE)
    console.log(SAMPLE_STANDARD_DEVIATION)
    // return {
    //     POPULATION_VARIANCE, POPULATION_VARIANCE,
    //     SAMPLE_VARIANCE, SAMPLE_STANDARD_DEVIATION
    // }
    return `POPULATION_VARIANCE = ${POPULATION_VARIANCE}  POPULATION_STANDARD_DEVIATION = ${POPULATION_STANDARD_DEVIATION}  SAMPLE_VARIANCE = ${SAMPLE_VARIANCE}  SAMPLE_STANDARD_DEVIATION = ${SAMPLE_STANDARD_DEVIATION}`
}

function LINEAR_REGRESSION(X, Y) {
    const sumX = X.reduce((accumulator, value) => accumulator + value, 0)
    const sumY = Y.reduce((accumulator, value) => accumulator + value, 0)
    const sumXX = X.reduce((accumulator, value) => accumulator + value * value, 0)

    let sumXY = 0;
    for (let i = 0; i < X.length; i++) {
        sumXY += X[i] * Y[i];
    }
    console.log(sumX, sumY, sumXX, sumXY)

    // REF : https://www.mathportal.org/calculators/statistics-calculator/correlation-and-regression-calculator.php
    // FORMULA => y = a + bx
    // FORMULA => a = sumY * sumXX - sumX * sumXY / n * sumXX - (sumX * sumX)
    // FORMULA => b = n * sumXY - sumX * sumY / n * sumXX - sumX * sumX

    // ANY ONE ARRAY LENGTH
    const n = X.length

    const a = ((sumY * sumXX) - (sumX * sumXY)) / ((n * sumXX) - (sumX * sumX))
    const b = ((n * sumXY) - (sumX * sumY)) / ((n * sumXX) - (sumX * sumX))

    // REGRESSION EQUATION => Y = a + bx
    return `Linear Regression Equation => ${a} + ${b} (x)`
}

// COMMON LOG CALCULATOR
function COMMON_LOG_FUNC(number) {
    let answer = 0, iterator = 0
    const base = 10
    while (iterator < 50) {
        let power = 1
        let incrementPower = 0
        while (power * base <= number) {
            incrementPower++
            power = power * base
        }
        console.log("Power", power)
        console.log("Increment Power", incrementPower)

        // TO BREAK WHEN GETTING SAME AS PREVIOUS
        answer = answer + incrementPower * (10 ** -iterator)
        console.log("Answer", answer)

        number = number / power
        console.log("Number", number)

        number = number ** base
        console.log("Number", number)

        iterator++;
    }
    console.log(answer)
    return answer
}

app.listen(PORT, (error) => {
    if (error) {
        console.log("Some Error Occured While Starting Node Server ", error)
    }
    console.log('\x1b[36m%s\x1b[0m', `Server listening on ${PORT} in localhost`);
})

// https://www.inchcalculator.com/amps-to-kilowatts-calculator/
// https://www.rapidtables.com/calc/electric/Amp_to_kVA_Calculator.html