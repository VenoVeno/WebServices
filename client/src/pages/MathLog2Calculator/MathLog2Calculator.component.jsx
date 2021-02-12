import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import RadioButton from '../../components/RadioButton/RadioButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import shortid from 'shortid';
import _isEmpty from 'lodash/isEmpty';

import './MathLog2Calculator.styles.scss';

class MathLog2Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calculationType: ["GCF and LCM", "Square Root and Cube Root", " N-th Root"],
            currentCalculation: "",
            inputNumberArray: "",
            inputNumber: "",
            nthRoot: "", nthRootInputNumber: "",
            resultantJSON: ""
        }
    }

    componentDidMount() {
        this.updateCurrentCalculation(this.state.calculationType[0])
    }

    updateCurrentCalculation(calculationName) {
        this.setState({
            currentCalculation: calculationName,
            inputNumberArray: "",
            inputNumber: "",
            nthRoot: "", nthRootInputNumber: "",
            resultantJSON: ""
        })
    }

    updateNthRoot = (nthRoot) => {
        this.setState({
            nthRoot: nthRoot
        }, () => this.callNthRootCalculation())
    }

    updateNthRootInputNumber = (nthRootInputNumber) => {
        this.setState({
            nthRootInputNumber: nthRootInputNumber
        }, () => {
            this.callNthRootCalculation()
        })
    }

    callNthRootCalculation = () => {
        if (!_isEmpty(this.state.nthRoot) && !_isEmpty(this.state.nthRootInputNumber)) {
            this.getValueForInput("Method-3")
        }
    }

    updateInputNumber = (inputNumber) => {
        this.setState({
            inputNumber,
            resultantJSON: ""
        }, () => {
            console.log(this.state.inputNumber)
            if (this.state.inputNumber.toString() !== "-" && !_isEmpty(this.state.inputNumber))
                this.getValueForInput("Method-2")
            else console.log("API Will Not be Invoked")
        })
    }

    updateInputNumberArray = (value) => {
        // CHECK FOR ONLY NUMBER
        if (isNaN(value.slice(-1))) return
        this.setState({
            inputNumberArray: value.trimStart().replace(/\s+/g, " "), // TO REMOVE LEADING WHITE SPACES AND DOUBLE ENDING WHITE SPACES
            resultantJSON: ""
        }, () => {
            if (this.state.inputNumberArray.split(" ").filter(Boolean).length >= 2) {
                console.log("Sufficient Data")
                this.getValueForInput("Method-1")
            }
        })
    }

    getValueForInput = (methodType) => {
        // WHAT DATA TO SEND
        const inputNumber = methodType === "Method-1"
            ? this.state.inputNumberArray.split(" ").filter(Boolean)
            : methodType === "Method-2"
                ? this.state.inputNumber
                : this.state.nthRootInputNumber

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/mathLog2`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    inputNumber,
                    method: methodType,
                    nthRoot: this.state.nthRoot
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
        const { calculationType, currentCalculation, inputNumber, inputNumberArray, resultantJSON, nthRoot, nthRootInputNumber } = this.state
        return (
            <div className="math-log-2-calculator-container">
                <div className="header">Math Log 2 Calculator</div>
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
                {
                    calculationType.indexOf(currentCalculation) === 0
                        ? <InputTextBox type="text" className="custom-input-text" name={currentCalculation} id={currentCalculation} value={inputNumberArray}
                            onChange={(event) => this.updateInputNumberArray(event.target.value)} placeholder="Enter Number Seperated By Space" />
                        : calculationType.indexOf(currentCalculation) === 1
                            ? <InputTextBox className="custom-input-text" name={currentCalculation} id={currentCalculation} value={inputNumber}
                                onChange={(event) => this.updateInputNumber(event.target.value)} placeholder="Enter A Number" />
                            : <div className="input-wrapper">
                                <InputTextBox className="custom-input-text" name={currentCalculation} id={currentCalculation} value={nthRoot}
                                    onChange={(event) => this.updateNthRoot(event.target.value)} placeholder="Enter N-th Root" />
                                <InputTextBox className="custom-input-text" name={currentCalculation} id={currentCalculation} value={nthRootInputNumber}
                                    onChange={(event) => this.updateNthRootInputNumber(event.target.value)} placeholder="Enter A Number" />
                            </div>

                }
                {
                    resultantJSON
                        ?
                        <div className="result">
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

export default connect(mapStateToProps)(MathLog2Calculator);