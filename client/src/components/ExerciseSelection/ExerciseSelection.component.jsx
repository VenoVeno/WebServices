import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAvailableExercises, selectCurrentExercise } from '../../redux/app/app.selectors';
import { setCurrentExerciseName, setAvailablePrograms } from '../../redux/app/app.action';

import RadioButton from '../RadioButton/RadioButton.component';

import shortid from 'shortid';

import './ExerciseSelection.styles.scss';

class ExerciseSelection extends React.Component {
    // UPDATE CURRENT EXERCISE NAME IN REDUCER STATE
    updateCurrentExercise = (EXERCISE_NAME) => {
        this.props.setCurrentExerciseName(EXERCISE_NAME)
        if (this.props.AVAILABLE_EXERCISE.indexOf(EXERCISE_NAME) === 0) {
            this.props.setAvailablePrograms("SET_1")
        } else {
            this.props.setAvailablePrograms("SET_2")
        }
    }

    render() {
        const { CURRENT_EXERCISE_NAME, AVAILABLE_EXERCISE } = this.props
        console.log(AVAILABLE_EXERCISE)
        return (
            <div className="exercise-selection-container">
                <div className="flex-wrapper">
                    <div className="info">Exercise Selection </div>
                    <div className="radio-button-container">
                        {
                            AVAILABLE_EXERCISE.map(name => {
                                return (
                                    <RadioButton key={shortid.generate()} defaultChecked={CURRENT_EXERCISE_NAME === name ? true : false}
                                        onChange={(event) => this.updateCurrentExercise(event.target.value)} className="radio-button-contents"
                                        id={name} value={name} name="radio-button-group-exercise-selection">
                                        {name}
                                    </RadioButton>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    CURRENT_EXERCISE_NAME: selectCurrentExercise,
    AVAILABLE_EXERCISE: selectAvailableExercises
})

const mapDispatchToProps = (dispatch) => ({
    setCurrentExerciseName: (EXERCISE_NAME) => dispatch(setCurrentExerciseName(EXERCISE_NAME)),
    setAvailablePrograms: (PROGRAM_SET) => dispatch(setAvailablePrograms(PROGRAM_SET))
})

export default connect(mapStateToProps, mapDispatchToProps)(ExerciseSelection);