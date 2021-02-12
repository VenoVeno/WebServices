import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import RadioButton from '../../components/RadioButton/RadioButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import shortid from 'shortid';
import _isEmpty from 'lodash/isEmpty';

import './MathLog3Calculator.styles.scss';

class MathLog3Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calculationType: ["Radian", "Degree", "Arc Degree And Radian"],
            currentCalculation: "",
            inputNumber: ""
        }
    }

    componentDidMount() {
        this.updateCurrentCalculation(this.state.calculationType[0])
    }

    updateCurrentCalculation(calculationName) {
        this.setState({
            currentCalculation: calculationName,
            inputNumber: "",
            resultantJSON: ""
        })
    }

    updateInputNumber = (inputNumber) => {
        this.setState({
            inputNumber: inputNumber.toString().trim(),
            resultantJSON: ""
        }, () => {
            console.log(this.state.inputNumber)
            if (this.state.inputNumber.toString() !== "-" && !_isEmpty(this.state.inputNumber)
                && this.state.inputNumber.slice(-1) !== ".")
                this.getValueForInput()
            else console.log("API Will Not be Invoked")
        })
    }

    getValueForInput = () => {

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/mathLog3`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    number: this.state.inputNumber,
                    method: this.state.currentCalculation
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    resultantJSON: responseJSON.result
                })
            })
    }

    render() {
        const { calculationType, currentCalculation, inputNumber, resultantJSON } = this.state
        return (
            <div className="math-log-3-calculator-container">
                <div className="header">Math Log 3 Calculator</div>
                <div className="calculation-type-wrapper">
                    {
                        calculationType.map(type => {
                            return (
                                <RadioButton key={shortid.generate()} defaultChecked={type === currentCalculation ? true : false}
                                    onChange={(event) => this.updateCurrentCalculation(event.target.value)} className="radio-button-contents"
                                    id={type} value={type} name="radio-button-group-calculation-type">
                                    {type.toUpperCase()}
                                </RadioButton>
                            )
                        })
                    }
                </div>
                <InputTextBox type="text" className="custom-input-text" name={currentCalculation} id={currentCalculation} value={inputNumber}
                    onChange={(event) => this.updateInputNumber(event.target.value)} placeholder="Enter Number Seperated By Space" />
                {
                    resultantJSON
                        ? <div className="result">
                            {
                                resultantJSON.split("  ").map((value, index) => {
                                    return (
                                        <div key={index} className="resultant-value">{value}</div>
                                    )
                                })
                            }
                        </div>
                        : null
                }
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(MathLog3Calculator);