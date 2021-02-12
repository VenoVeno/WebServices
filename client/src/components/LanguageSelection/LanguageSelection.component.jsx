import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT, selectAPIServerLanguages } from '../../redux/app/app.selectors';
import { setAPIServerPORT } from '../../redux/app/app.action';

import RadioButton from '../RadioButton/RadioButton.component';

import shortid from 'shortid';

import './LanguageSelection.styles.scss';

class LanguageSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            languageName: this.findObjectKeyBasedOnValue()
        }
    }

    findObjectKeyBasedOnValue = () => {
        return Object
            .keys(this.props.API_SERVER_LANGUAGES)
            .find(key => this.props.API_SERVER_LANGUAGES[key] === this.props.API_SERVER_PORT)
    }

    updateTypeOfLanguage = (Language) => {
        const { setAPIServerPORT, API_SERVER_LANGUAGES } = this.props;
        setAPIServerPORT(API_SERVER_LANGUAGES[Language])

        // UPDATE LOCAL STATE FOR RADIO BUTTON
        this.setState({
            languageName: Language
        })
    }

    render() {
        const { languageName } = this.state
        const { API_SERVER_PORT, API_SERVER_LANGUAGES } = this.props
        return (
            <div className="language-selection-container">
                <div className="flex-wrapper">
                    <div className="info">API PORT : <span>{API_SERVER_PORT}</span></div>
                    <div className="radio-button-container">
                        {
                            Object.keys(API_SERVER_LANGUAGES).map(name => {
                                return (
                                    <RadioButton key={shortid.generate()} defaultChecked={name === languageName ? true : false}
                                        onChange={(event) => this.updateTypeOfLanguage(event.target.value)} className="radio-button-contents"
                                        id={name} value={name} name="radio-button-group-language-selection">
                                        {name.toUpperCase()}
                                    </RadioButton>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT,
    API_SERVER_LANGUAGES: selectAPIServerLanguages
});

const mapDispatchToProps = (dispatch) => ({
    setAPIServerPORT: PORT => dispatch(setAPIServerPORT(PORT))
})

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSelection);