import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import RadioButton from '../../components/RadioButton/RadioButton.component';
import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import shortid from 'shortid';

import './OTP.styles.scss';

class OTP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            radioButtonTypes: ["number", "alphabet", "alphanumeric"],
            otpLength: "",
            otpLengthInstant: "",
            resultantOTP: "",
            otpType: ""
        }
    }

    componentDidMount() {
        this.setState({ otpType: this.state.radioButtonTypes[0] })
    }

    updateTypeOfOTP = (otpType) => {
        this.setState({ otpType })
    }

    updateOTPLength = (otpLength) => {
        this.setState({
            otpLength,
            otpLengthInstant: "",
            resultantOTP: ""
        })
    }

    getInstantResultantOTP = (otpLength) => {
        this.setState({
            otpLengthInstant: otpLength,
            otpLength: ""
        }, () => this.generateOTPFromAPI(otpLength))
    }

    generateOTPFromAPI = (length) => {
        if (length === "") return
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/otpGeneration?type=${this.state.otpType}&length=${parseInt(length)}`, { method: "GET" })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    resultantOTP: responseJSON.randomOTP
                })
            })
    }

    render() {
        const { radioButtonTypes, otpLength, otpLengthInstant, resultantOTP, otpType } = this.state
        console.log(otpType)
        return (
            <div className="otp-generation-container">
                <div className="header">OTP Generation</div>
                <div className="radio-button-container">
                    {
                        radioButtonTypes.map((inputType, index) => {
                            return (
                                <RadioButton key={shortid.generate()} defaultChecked={otpType === inputType ? true : false} onChange={(event) => this.updateTypeOfOTP(event.target.value)}
                                    className="radio-button-contents" id={inputType} value={inputType} name="radio-button-group-otp-generation">
                                    {inputType.toUpperCase()}
                                </RadioButton>
                            )
                        })
                    }
                </div>
                <div className="input-type-1">
                    <div className="header">OTP Generation Based On Count</div>
                    <div className="flex-wrapper">
                        <InputTextBox className="custom-input-text" name="otpLength" id="otp-length" value={otpLength}
                            onChange={(event) => this.updateOTPLength(event.target.value)} placeholder="Enter OTP Length" />
                        <CustomButton className="custom-button"
                            onClick={() => this.generateOTPFromAPI(otpLength)}>Generate OTP</CustomButton>
                    </div>
                    {
                        otpLength && resultantOTP
                            ?
                            <div className="result">
                                <div className="length">Length Of OTP: {resultantOTP.length}</div>
                                {resultantOTP}
                            </div>
                            : null
                    }
                </div>
                <div className="input-type-2">
                    <div className="header">Instant OTP Generation</div>
                    <InputTextBox className="custom-input-text" name="otpLengthInstant" id="amount-in-number" value={otpLengthInstant}
                        onChange={(event) => this.getInstantResultantOTP(event.target.value)} placeholder="Enter OTP Length" />
                    {
                        otpLengthInstant && resultantOTP
                            ?
                            <div className="result">
                                <div className="length">Length Of OTP: {resultantOTP.length}</div>
                                {resultantOTP}
                            </div>
                            : null
                    }
                </div>
            </div >
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(OTP);