import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectCurrentProgramName, selectProgramNames } from '../../redux/app/app.selectors';
import { setCurrentProgramName } from '../../redux/app/app.action';

import RadioButton from '../RadioButton/RadioButton.component';

import shortid from 'shortid';

import './ProgramSelection.styles.scss';

class ProgramSelection extends React.Component {
    // UPDATE CURRENT PROGRAM NAME IN REDUCER STATE
    updateCurrentProgram = (PROGRAM_NAME) => {
        this.props.setCurrentProgramName(PROGRAM_NAME)
    }

    render() {
        const { CURRENT_PROGRAM_NAME, PROGRAM_NAMES } = this.props
        console.log(PROGRAM_NAMES)
        return (
            <div className="program-selection-container">
                {
                    PROGRAM_NAMES.map(name => {
                        return (
                            <RadioButton key={shortid.generate()} defaultChecked={CURRENT_PROGRAM_NAME === name ? true : false}
                                onChange={(event) => this.updateCurrentProgram(event.target.value)} className="radio-button-contents"
                                id={name} value={name} name="radio-button-group-program-selection">
                                {name}
                            </RadioButton>
                        )
                    })
                }
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    CURRENT_PROGRAM_NAME: selectCurrentProgramName,
    PROGRAM_NAMES: selectProgramNames
})

const mapDispatchToProps = (dispatch) => ({
    setCurrentProgramName: (PROGRAM_NAME) => dispatch(setCurrentProgramName(PROGRAM_NAME))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProgramSelection);