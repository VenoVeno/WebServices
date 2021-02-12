import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import RadioButton from '../../components/RadioButton/RadioButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import shortid from 'shortid';

import './StatisticsCalculator.styles.scss';

class StatisticsCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            calculationType: ["Standard Deviation and Variance", "Linear Regresssion"],
            currentCalculation: "",
            inputNumberArray: "",

            // FOR LINEAR REGRESSION
            inputNumberArray1: "",
            inputNumberArray2: "",

            // RESULT
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
            inputNumberArray1: "",
            inputNumberArray2: "",
            resultantJSON: ""
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

    // LINEAR REGRESSION
    updateInputNumberArrayLR = (event) => {
        const { name, value } = event.target
        console.log(name, value)
        // CHECK FOR ONLY NUMBER
        if (isNaN(value.slice(-1))) return
        this.setState({
            [name]: value.trimStart().replace(/\s+/g, " "), // TO REMOVE LEADING WHITE SPACES AND DOUBLE ENDING WHITE SPACES
            resultantJSON: ""
        }, () => {
            if (this.state.inputNumberArray1.split(" ").filter(Boolean).length
                === this.state.inputNumberArray2.split(" ").filter(Boolean).length) {
                console.log("Sufficient Data")
                this.getValueForInput("Method-2")
            }
        })
    }

    getValueForInput = (methodType) => {
        // WHAT DATA TO SEND
        const inputNumber = methodType === "Method-1"
            ? this.state.inputNumberArray.split(" ").filter(Boolean)
            : [this.state.inputNumberArray1.split(" ").filter(Boolean),
            this.state.inputNumberArray2.split(" ").filter(Boolean)]

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/statisticsCalculator`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    inputNumber,
                    method: methodType
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
        const { calculationType, currentCalculation, inputNumberArray, inputNumberArray1, inputNumberArray2, resultantJSON } = this.state
        return (
            <div className="statistics-calculator-container">
                <div className="header">Statistics Calculator</div>
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
                        : <div className="input-wrapper">
                            <InputTextBox type="text" className="custom-input-text" name="inputNumberArray1" id="inputNumberArray1" value={inputNumberArray1}
                                onChange={(event) => this.updateInputNumberArrayLR(event)} placeholder="Enter Array-1 Number Seperated By Space" />
                            <InputTextBox type="text" className="custom-input-text" name="inputNumberArray2" id="inputNumberArray2" value={inputNumberArray2}
                                onChange={(event) => this.updateInputNumberArrayLR(event)} placeholder="Enter Array-2 Number Seperated By Space" />
                        </div>
                }
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

export default connect(mapStateToProps)(StatisticsCalculator);