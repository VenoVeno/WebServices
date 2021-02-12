import { createSelector } from 'reselect';

const selectApp = (state) => state.app;

// PORT INFO SELCTOR
export const selectAPIServerPORT = createSelector(
    [selectApp],
    (app) => app.API_SERVER_PORT
)

export const selectAPIServerLanguages = createSelector(
    [selectApp],
    (app) => app.API_SERVER_LANGUAGES
)

// PROGRAM NAME INFO SELECTOR
export const selectProgramNames = createSelector(
    [selectApp],
    (app) => app.PROGRAMS_AVAILABLE
)

export const selectCurrentProgramName = createSelector(
    [selectApp],
    (app) => app.CURRENT_PROGRAM_NAME
)

// EXERCISE NAME INFO SELECTOR
export const selectAvailableExercises = createSelector(
    [selectApp],
    (app) => app.EXERCISE_AVAILABLE
)

export const selectCurrentExercise = createSelector(
    [selectApp],
    (app) => app.CURRENT_EXERCISE
)