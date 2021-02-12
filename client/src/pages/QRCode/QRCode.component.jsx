import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import shortid from 'shortid';

import './QRCode.styles.scss';

class QRCode extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            qrCodeString: "",
            responseQRCode: ""
        }
    }

    updateQRCodeString = (qrCodeString) => {
        this.setState({
            qrCodeString,
            responseQRCode: ""
        })
    }

    generateQRCode = () => {
        const { qrCodeString } = this.state
        if (qrCodeString === "") return

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/qrCode`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    qrCodeString
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    responseQRCode: responseJSON.response_message
                })
            })
    }

    render() {
        const { qrCodeString, responseQRCode } = this.state
        return (
            <div className="qr-code-container">
                <div className="header">QR Code</div>
                <div className="row-flex-wrapper">
                    <InputTextBox type="text" className="custom-input-text" name="qrCodeString" id="qrCodeString" value={qrCodeString}
                        onChange={(event) => this.updateQRCodeString(event.target.value)} placeholder="Enter String For QR-Code" autoFocus />
                    <CustomButton className="custom-button"
                        onClick={() => this.generateQRCode()}>Generate QR-Code</CustomButton>
                </div>
                {
                    responseQRCode
                        ? <img key={shortid.generate()} src={`${Properties.URL}:3000/QRcode.png?random=${new Date().getMilliseconds()}`} alt="" />
                        : null
                }
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(QRCode);