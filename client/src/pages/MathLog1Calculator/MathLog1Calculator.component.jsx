import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import RadioButton from '../../components/RadioButton/RadioButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import shortid from 'shortid';
import _isEmpty from 'lodash/isEmpty';

import './MathLog1Calculator.styles.scss';

class MathLog1Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calculationType: ["Logarithm", "Anti-Logarithm"],
            currentCalculation: "",
            inputNumber: "",
            inputBase: "",
            resultantJSON: ""
        }
    }
    componentDidMount() {
        this.updateCurrentCalculation(this.state.calculationType[0])
    }

    updateCurrentCalculation(calculationName) {
        this.setState({
            currentCalculation: calculationName,
            inputNumber: "",
            inputBase: "",
            resultantJSON: ""
        })
    }

    updateInputNumberAndBase = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            resultantJSON: ""
        }, () => {
            console.log(this.state.inputNumber)
            if (this.state.inputNumber.toString() !== "-" && !_isEmpty(this.state.inputNumber) &&
                this.state.inputBase.toString() !== "-" && !_isEmpty(this.state.inputBase))
                this.getValueForInput()
            else console.log("API Will Not be Invoked")
        })
    }

    getValueForInput = () => {
        const { inputNumber, currentCalculation, inputBase } = this.state

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/mathLog1`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    number: inputNumber,
                    base: inputBase,
                    method: currentCalculation
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
        const { calculationType, currentCalculation, inputNumber, inputBase, resultantJSON } = this.state
        return (
            <div className="math-log-1-calculator-container">
                <div className="header">Math Log 1 Calculator</div>
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
                <div className="input-wrapper">
                    <InputTextBox className="custom-input-text" name="inputNumber" id="inputNumber" value={inputNumber}
                        onChange={(event) => this.updateInputNumberAndBase(event)} placeholder="Enter Input Number" />
                    <InputTextBox className="custom-input-text" name="inputBase" id="inputBase" value={inputBase}
                        onChange={(event) => this.updateInputNumberAndBase(event)} placeholder="Enter Base" />
                </div>
                {
                    resultantJSON
                        ?
                        <div className="result">
                            {
                                Object.keys(resultantJSON).map((key, index) => {
                                    return (
                                        <div className="row-span" key={index}>
                                            <div className="key">{key}</div>
                                            <div key={index} className="resultant-value">{resultantJSON[key]}</div>
                                        </div>
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

export default connect(mapStateToProps)(MathLog1Calculator);