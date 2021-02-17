import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import './RLECompression.styles.scss';

class RLECompression extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textNormal: "",
            textInstant: "",
            compressedText: ""
        }
    }

    normalTextUpdation = (event) => {
        const { value } = event.target
        if ((value === "" || value === " ") && this.state.textNormal.length >= 1);
        else if (!/^[a-zA-Z]+$/g.test(value)) return
        this.setState({
            textNormal: value,
            textInstant: "",
            resultantChecksum: ""
        })
    }

    getInstantCompressionResult = (event) => {
        const { value } = event.target
        if ((value === "" || value === " ") && this.state.textInstant.length >= 1);
        else if (!/^[a-zA-Z]+$/g.test(value)) return
        this.setState({
            textInstant: value,
            textNormal: "",
            resultantChecksum: ""
        }, () => this.compressText(this.state.textInstant))
    }

    compressText = (text) => {
        if (text === "") return
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/rleCompression`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    text
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    compressedText: responseJSON.compressedText
                })
            })
    }

    render() {
        const { textNormal, textInstant, compressedText } = this.state;
        return (
            <div className="rle-text-compression-container">
                <div className="header">RLA Text Compression</div>
                <div className="flex-wrapper">
                    <InputTextBox type="text" className="custom-input-text" name="text-normal" id="text-normal" value={textNormal}
                        onChange={(event) => this.normalTextUpdation(event)} placeholder="Enter Input Text" />
                    <CustomButton className="custom-button"
                        onClick={() => this.compressText(textNormal)}>Compress Input</CustomButton>
                </div>
                {
                    textNormal && compressedText
                        ?
                        <div className="result">
                            {compressedText}
                        </div>
                        : null
                }
                <div className="input-type-2">
                    <div className="header">Instant Compression Calculator</div>
                    <InputTextBox type="text" className="custom-input-text" name="text-instant" id="text-instant" value={textInstant}
                        onChange={(event) => this.getInstantCompressionResult(event)} placeholder="Enter Input Text" />
                    {
                        textInstant && compressedText
                            ?
                            <div className="result">
                                {compressedText}
                            </div>
                            : null
                    }
                </div>
                {
                    compressedText
                        ? <div className="result">
                            {compressedText}
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

export default connect(mapStateToProps)(RLECompression);