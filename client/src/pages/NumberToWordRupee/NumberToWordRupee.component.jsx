import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import './NumberToWordRupee.styles.scss';

class NumberToWordRupee extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            amountInNumber: "",
            amountInWord: "",
            amountInNumberInstant: ""
        }
    }

    updateAmountInRupee = (amountInNumber) => {
        this.setState({
            amountInNumber,
            amountInNumberInstant: "",
            amountInWord: ""
        })
    }

    getInstantAmountToWord = (amountInNumber) => {
        this.setState({
            amountInNumberInstant: amountInNumber,
            amountInNumber: ""
        }, () => this.convertAmountToWord(this.state.amountInNumberInstant))
    }

    convertAmountToWord = (amount) => {
        if (amount === "") return
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/numToWordRupee?amount=${parseInt(amount)}`, { method: "GET" })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    amountInWord: responseJSON.word
                })
            })
    }

    render() {
        const { amountInNumber, amountInWord, amountInNumberInstant } = this.state
        return (
            <div className="number-to-word-rupee-container">
                <div className="warning-container">Support Negative Number and Till 15 Digits</div>
                <div className="input-type-1">
                    <div className="header">Number to Word Rupee</div>
                    <div className="flex-wrapper">
                        <InputTextBox className="custom-input-text" name="amountInNumber" id="amount-in-number" value={amountInNumber}
                            onChange={(event) => this.updateAmountInRupee(event.target.value)} placeholder="Amount In Number" />
                        <CustomButton className="custom-button"
                            onClick={() => this.convertAmountToWord(amountInNumber)}>Convert To Word</CustomButton>
                    </div>
                    {
                        amountInNumber
                            ?
                            <div className="result">
                                {amountInWord}
                            </div>
                            : null
                    }
                </div>
                <div className="input-type-2">
                    <div className="header">Instant Conversion</div>
                    <InputTextBox className="custom-input-text" name="amountInNumberInstant" id="amount-in-number-instant" value={amountInNumberInstant}
                        onChange={(event) => this.getInstantAmountToWord(event.target.value)} placeholder="Amount In Number" />
                    {
                        amountInNumberInstant
                            ?
                            <div className="result">
                                {amountInWord}
                            </div>
                            : null
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(NumberToWordRupee);