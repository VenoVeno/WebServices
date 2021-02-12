import { AppActionTypes } from './app.types';

const DEFAULT_PORT = 3000
const DEFAULT_EXERCISE = "Exercise-1"

const DEFAULT_PROGRAM_SET_1 = "DateDifference"
const DEFAULT_PROGRAM_SET_2 = "Electrical Calculator"

const PROGRAM_SET_1 = [DEFAULT_PROGRAM_SET_1, "SetTheory", "MatrixOperation", "NumberToWordRupee", "RSA", "MD5", "128-bit Barcode", "QR-Code", "OTP", "Captcha"]
const PROGRAM_SET_2 = [DEFAULT_PROGRAM_SET_2, "Math Log1", "Math Log2", "Math Log3", "Basic Statistics Calculator"]

const INITIAL_STATE = {
    API_SERVER_LANGUAGES: { "javascript": DEFAULT_PORT, "python": 3002, "php": 3003 },
    API_SERVER_PORT: DEFAULT_PORT,
    PROGRAMS_AVAILABLE: PROGRAM_SET_1,
    CURRENT_PROGRAM_NAME: DEFAULT_PROGRAM_SET_1,
    EXERCISE_AVAILABLE: [DEFAULT_EXERCISE, "Exercise-2"],
    CURRENT_EXERCISE: DEFAULT_EXERCISE
}

const appReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case AppActionTypes.SET_API_SERVER_PORT:
            return {
                ...state,
                API_SERVER_PORT: action.payload
            }
        case AppActionTypes.SET_CURRENT_PROGRAM_NAME:
            return {
                ...state,
                CURRENT_PROGRAM_NAME: action.payload
            }
        case AppActionTypes.SET_PROGRAM_AVAILABLE:
            let CURRENT_PROGRAM_SET
            let CURRENT_PROGRAM_SET_NAME

            if (action.payload === "SET_1") {
                CURRENT_PROGRAM_SET = PROGRAM_SET_1
                CURRENT_PROGRAM_SET_NAME = DEFAULT_PROGRAM_SET_1
            }
            else {
                CURRENT_PROGRAM_SET = PROGRAM_SET_2
                CURRENT_PROGRAM_SET_NAME = DEFAULT_PROGRAM_SET_2
            }

            return {
                ...state,
                CURRENT_PROGRAM_NAME: CURRENT_PROGRAM_SET_NAME,
                PROGRAMS_AVAILABLE: CURRENT_PROGRAM_SET
            }
        case AppActionTypes.SET_CURRENT_EXERCISE:
            return {
                ...state,
                CURRENT_EXERCISE: action.payload
            }
        default:
            return state;
    }
}

export default appReducer;