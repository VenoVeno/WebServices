import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';
import RadioButton from '../../components/RadioButton/RadioButton.component';

import { Properties } from '../../global.properties';

import shortid from 'shortid';

import './BarCode128.styles.scss';

class BarCode128 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            barCodeString: "",
            barCodeHeight: 100,
            barCodeThickness: 3,
            barCodeQuietZone: "true",
            responseBarCode: ""
        }
    }

    updateBarcodeString = (barCodeString) => {
        this.setState({
            barCodeString,
            responseBarCode: ""
        })
    }

    updateBarcodeCustomisedNumber = (event) => {
        const { name, value } = event.target
        this.setState({
            [name]: value,
            responseBarCode: ""
        })
    }

    updateQuietZone = (barCodeQuietZoneValue) => {
        this.setState({
            barCodeQuietZone: barCodeQuietZoneValue,
            responseBarCode: ""
        })
    }

    generateBarCode = () => {
        const { barCodeString, barCodeHeight, barCodeThickness, barCodeQuietZone } = this.state
        if (barCodeString === "" || barCodeHeight === "" || barCodeThickness === "") return

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/barCode`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    barCodeString,
                    barCodeHeight: parseInt(barCodeHeight),
                    barCodeThickness: parseInt(barCodeThickness),
                    barCodeQuietZone: barCodeQuietZone
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    responseBarCode: responseJSON.return_message
                })
            })
    }
    render() {
        const { barCodeString, barCodeHeight, barCodeThickness, responseBarCode, barCodeQuietZone } = this.state
        return (
            <div className="barcode-128-container">
                <div className="header">128 Bit Bar-Code</div>
                <div className="info">Default Height : 100, Default Thickness : 4 and Quiet Zone : False</div>
                <div className="row-flex-wrapper">
                    <InputTextBox type="text" className="custom-input-text" name="barCodeString" id="barCodeString" value={barCodeString}
                        onChange={(event) => this.updateBarcodeString(event.target.value)} placeholder="Enter String For Barcode" autoFocus />
                    <InputTextBox className="custom-input-text" name="barCodeHeight" id="barCodeHeight" value={barCodeHeight}
                        onChange={(event) => this.updateBarcodeCustomisedNumber(event)} placeholder="Enter Barcode Height" />
                    <InputTextBox className="custom-input-text" name="barCodeThickness" id="barCodeThickness" value={barCodeThickness}
                        onChange={(event) => this.updateBarcodeCustomisedNumber(event)} placeholder="Enter Barcode Thickness" />
                </div>
                <div className="radio-button-container row-flex-wrapper">
                    <RadioButton key={shortid.generate()} checked={barCodeQuietZone === "true"}
                        onChange={(event) => this.updateQuietZone(event.target.value)} className="radio-button-contents"
                        id="quiet-zone-true" value="true" name="radio-button-group-quiet-zone-selection">
                        Quiet Zone True
                    </RadioButton>
                    <RadioButton key={shortid.generate()} checked={barCodeQuietZone === "false"}
                        onChange={(event) => this.updateQuietZone(event.target.value)} className="radio-button-contents"
                        id="quiet-zone-false" value="false" name="radio-button-group-quiet-zone-selection">
                        Quiet Zone False
                    </RadioButton>
                </div>
                <div className="row-flex-wrapper">
                    <CustomButton className="custom-button"
                        onClick={() => this.generateBarCode()}>Generate 128-Bit BarCode</CustomButton>
                </div>
                {
                    responseBarCode
                        ? <img key={shortid.generate()} src={`${Properties.URL}:3000/Barcode.png?random=${new Date().getMilliseconds()}`} alt="" />
                        : null
                }
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(BarCode128);