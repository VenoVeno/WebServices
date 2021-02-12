import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import './DateDifference.styles.scss';

class DateDifference extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // inputData: {
            //     fromDate: "", fromMonth: "", fromYear: "",
            //     fromHour: "", fromMinute: "", fromSecond: "",
            //     toDate: "", toMonth: "", toYear: "",
            //     toHour: "", toMinute: "", toSecond: ""
            // },
            inputData: {
                fromDate: 22, fromMonth: 1, fromYear: 2021,
                fromHour: 10, fromMinute: 10, fromSecond: 28,
                toDate: 25, toMonth: 12, toYear: 2021,
                toHour: 11, toMinute: 2, toSecond: 58
            },
            resultantJSON: ""
        }
    }
    updateValue = (event) => {
        const { name, value } = event.target
        this.setState({
            inputData: {
                ...this.state.inputData,
                [name]: value
            }
        })
    }
    calculateDateDiff = () => {
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/dateDiff`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    inputData: this.state.inputData
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    resultantJSON: responseJSON.dateDiff
                })
            })
    }
    render() {
        const { inputData, resultantJSON } = this.state;
        return (
            <div className="date-difference-calculator-wrapper">
                <div className="header">Date Difference</div>
                <div className="warning-container">First Date Can be Greater than Second Date</div>
                <div className="flex-wrapper">
                    <div className="input-type-1">
                        <div className="header">Input Date 1</div>
                        <InputTextBox type="number" className="custom-input-text" name="fromDate" id="from-date" value={inputData["fromDate"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Date" />
                        <InputTextBox type="number" className="custom-input-text" name="fromMonth" id="from-date" value={inputData["fromMonth"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Month" />
                        <InputTextBox type="number" className="custom-input-text" name="fromYear" id="from-date" value={inputData["fromYear"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Year" />
                        <InputTextBox type="number" className="custom-input-text" name="fromHour" id="from-date" value={inputData["fromHour"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Hour" />
                        <InputTextBox type="number" className="custom-input-text" name="fromMinute" id="from-date" value={inputData["fromMinute"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Minute" />
                        <InputTextBox type="number" className="custom-input-text" name="fromSecond" id="from-date" value={inputData["fromSecond"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Second" />
                    </div>
                    <div className="input-type-2">
                        <div className="header">Input Date 2</div>
                        <InputTextBox type="number" className="custom-input-text" name="toDate" id="to-date" value={inputData["toDate"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Date" />
                        <InputTextBox type="number" className="custom-input-text" name="toMonth" id="to-date" value={inputData["toMonth"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Month" />
                        <InputTextBox type="number" className="custom-input-text" name="toYear" id="to-date" value={inputData["toYear"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Year" />
                        <InputTextBox type="number" className="custom-input-text" name="toHour" id="to-date" value={inputData["toHour"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Hour" />
                        <InputTextBox type="number" className="custom-input-text" name="toMinute" id="to-date" value={inputData["toMinute"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Minute" />
                        <InputTextBox type="number" className="custom-input-text" name="toSecond" id="to-date" value={inputData["toSecond"]}
                            onChange={(event) => this.updateValue(event)} placeholder="Second" />
                    </div>
                </div>
                <CustomButton className="custom-button"
                    onClick={() => this.calculateDateDiff()}>Calculate Difference</CustomButton>
                {
                    resultantJSON
                        ?
                        <div className="result">
                            Difference - {resultantJSON}
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

export default connect(mapStateToProps)(DateDifference);