import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import _isEmpty from 'lodash/isEmpty';
import { Properties } from '../../global.properties';

import './RSA.styles.scss';
import shortid from 'shortid';

class RSA extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            normalText: "",
            encResult: {},
            encryptedMessage: "",
            privateKey: "",
            decResult: {}
        }
    }

    updateNormalText = (fieldValue) => {
        this.setState({
            normalText: fieldValue,
            encResult: {},
            encryptedMessage: "",
            privateKey: "",
            decResult: {}
        })
    }

    updateDecryptInputField = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            decResult: {}
        })
    }

    encrypt(inputString) {
        if (inputString === "") return

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/rsaEncDec`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    type: "Encryption",
                    inputString: inputString
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    encResult: responseJSON,
                    encryptedMessage: this.getAccumulatedString(responseJSON["ENCRYPTED_MESSAGE"]),
                    privateKey: this.getAccumulatedString(responseJSON["PRIVATE_KEY"])
                })
            })
    }

    decrypt = () => {
        const { encryptedMessage, privateKey } = this.state
        if (encryptedMessage === "" || privateKey === "") return

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/rsaEncDec`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    type: "Decryption",
                    encryptedArray: encryptedMessage.split(",").map(x => +x),
                    privateKeyArray: privateKey.split(",").map(x => +x)
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    decResult: responseJSON
                })
            })
    }

    getAccumulatedString = (array) => {
        console.log(array)
        const len = array.length
        let accString = ""
        array.forEach((value, index) => {
            if (len - 1 === index) accString += value
            else accString += value + ","
        })
        return accString
    }

    render() {
        const { normalText, encResult, encryptedMessage, privateKey, decResult } = this.state
        return (
            <div className="rsa-algorithm-container">
                <div className="header">RSA (Rivest–Shamir–Adleman)</div>
                <div className="row-flex-wrapper space-around">
                    <div className="encryption main-type-container">
                        <div className="header">Encryption</div>
                        <div className="col-flex-wrapper inner-margin">
                            <InputTextBox type="text" className="custom-input-text" name="normal-text" id="normal-text" value={normalText}
                                onChange={(event) => this.updateNormalText(event.target.value)} placeholder="Enter Message to Encrypt" />
                            <CustomButton className="custom-button" id="encrypt-button"
                                onClick={() => this.encrypt(normalText)}>Encrypt Text</CustomButton>
                        </div>
                        {
                            !_isEmpty(encResult)
                                ? <div className="result">
                                    {
                                        Object.keys(encResult).map(key => {
                                            console.log(encResult[key])
                                            return (
                                                <div className="resultant-wrapper col-flex-wrapper" key={shortid.generate()}>
                                                    <div className="name" >{key}</div>
                                                    {
                                                        Array.isArray(encResult[key])
                                                            ? <div className="value">{this.getAccumulatedString(encResult[key])}</div>
                                                            : <div className="value">{encResult[key]}</div>
                                                    }
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                : null
                        }
                    </div>
                    <div className="decryption main-type-container">
                        <div className="header">Decryption</div>
                        <div className="col-flex-wrapper inner-margin">
                            <InputTextBox type="text" className="custom-input-text" name="encryptedMessage" id="encryptedMessage" value={encryptedMessage}
                                onChange={(event) => this.updateDecryptInputField(event)} placeholder="Enter the Encrypted Message" />
                            <InputTextBox type="text" className="custom-input-text" name="privateKey" id="privateKey" value={privateKey}
                                onChange={(event) => this.updateDecryptInputField(event)} placeholder="EnterPrivate Key" />
                            <CustomButton className="custom-button" id="decrypt-button"
                                onClick={() => this.decrypt()}>Decrypt Text</CustomButton>
                        </div>
                        {
                            !_isEmpty(decResult)
                                ? <div className="result">
                                    {
                                        Object.keys(decResult).map(key => {
                                            return (
                                                <div className="resultant-wrapper col-flex-wrapper" key={shortid.generate()}>
                                                    <div className="name" >{key}</div>
                                                    <div className="value">{decResult[key]}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                : null
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(RSA);