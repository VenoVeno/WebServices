import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import './Captcha.styles.scss';
import shortid from 'shortid';

class Captcha extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            captchaString: "",
            responseCaptcha: ""
        }
    }
    updateCaptchaString(captchaString) {
        this.setState({
            captchaString,
            responseCaptcha: ""
        })
    }
    generateCaptcha(captchaString) {
        if (captchaString === "") return
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/captchaGeneration?string=${captchaString}`, { method: "GET" })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    responseCaptcha: responseJSON.return_message
                })
            })
    }
    render() {
        const { captchaString, responseCaptcha } = this.state
        return (
            <div className="captcha-generator-container">
                <div className="header">Captcha Geneator</div>
                <div className="flex-wrapper">
                    <InputTextBox type="text" className="custom-input-text" name="sentence-normal" id="sentence-normal" value={captchaString}
                        onChange={(event) => this.updateCaptchaString(event.target.value)} placeholder="Enter String" />
                    <CustomButton className="custom-button"
                        onClick={() => this.generateCaptcha(captchaString)}>Generate Captcha</CustomButton>
                </div>
                {
                    responseCaptcha
                        ? <img key={shortid.generate()} src={`${Properties.URL}:3000/Captcha.png?random=${new Date().getMilliseconds()}`} alt="" />
                        : null
                }
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(Captcha);