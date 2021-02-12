import { AppActionTypes } from './app.types';

// API SERVER PORT UPDATION
export const setAPIServerPORT = (PORT) => ({
    type: AppActionTypes.SET_API_SERVER_PORT,
    payload: PORT
});

// SET PROGRAM AVAILABLE
export const setAvailablePrograms = (PROGRAM_SET) => ({
    type: AppActionTypes.SET_PROGRAM_AVAILABLE,
    payload: PROGRAM_SET
});

// SET CURRENT PROGRAM NAME
export const setCurrentProgramName = (PROGRAM_NAME) => ({
    type: AppActionTypes.SET_CURRENT_PROGRAM_NAME,
    payload: PROGRAM_NAME
});

// SET CURRENT EXERCISE NAME
export const setCurrentExerciseName = (EXERCISE_NAME) => ({
    type: AppActionTypes.SET_CURRENT_EXERCISE,
    payload: EXERCISE_NAME
});