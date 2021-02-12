import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import './MD5.styles.scss';

class MD5 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sentenceNormal: "",
            sentenceInstant: "",
            resultantChecksum: ""
        }
    }

    normalSentenceUpdation = (sentenceNormal) => {
        this.setState({
            sentenceNormal,
            sentenceInstant: "",
            resultantChecksum: ""
        })
    }

    getInstantAmountToWord = (sentenceInstant) => {
        this.setState({
            sentenceInstant,
            sentenceNormal: ""
        }, () => this.calculateChecksum(this.state.sentenceInstant))
    }

    calculateChecksum = (sentence) => {
        if (sentence === "") return
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/md5sum?string=${sentence}`, { method: "GET" })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    resultantChecksum: responseJSON.checksum
                })
            })
    }

    render() {
        const { sentenceNormal, sentenceInstant, resultantChecksum } = this.state;
        return (
            <div className="md5-algorithm-container">
                <div className="header">MD5 (Message Digest Algorithm)</div>
                <div className="input-type-1">
                    <div className="header">MD5 Checksum Calculator</div>
                    <div className="flex-wrapper">
                        <InputTextBox type="text" className="custom-input-text" name="sentence-normal" id="sentence-normal" value={sentenceNormal}
                            onChange={(event) => this.normalSentenceUpdation(event.target.value)} placeholder="Enter Some String" />
                        <CustomButton className="custom-button"
                            onClick={() => this.calculateChecksum(sentenceNormal)}>Calculate Checksum</CustomButton>
                    </div>
                    {
                        sentenceNormal && resultantChecksum
                            ?
                            <div className="result">
                                {resultantChecksum}
                            </div>
                            : null
                    }
                </div>
                <div className="input-type-2">
                    <div className="header">Instant Checksum Calculator</div>
                    <InputTextBox type="text" className="custom-input-text" name="sentence-instant" id="sentence-instant" value={sentenceInstant}
                        onChange={(event) => this.getInstantAmountToWord(event.target.value)} placeholder="Enter Some String" />
                    {
                        sentenceInstant && resultantChecksum
                            ?
                            <div className="result">
                                {resultantChecksum}
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

export default connect(mapStateToProps)(MD5);