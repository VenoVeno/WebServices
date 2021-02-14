import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import shortid from 'shortid';
import _isEmpty from 'lodash/isEmpty';
import _cloneDeep from 'lodash/cloneDeep';

import './ElectricalCalculator.styles.scss';

class ElectricalCalculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            conversions: {
                "Amps(A) to kW, mW, W(Watts)": {
                    "inputs": {
                        "current": ["mA", "A", "kA"],
                        "voltage": ["mV", "V", "kV"]
                    },
                    "TYPE": 1
                }, "Amps(A) to kilovolt-amps(kVA)": {
                    "inputs": {
                        "current": ["A"],
                        "voltage": ["V"]
                    },
                    "TYPE": 2
                }, "Amps (A) to volt-amps (VA)": {
                    "inputs": {
                        "current": ["A"],
                        "voltage": ["V"]
                    },
                    "TYPE": 3
                }, "Amps (A) to volts (V) with Ohms(Ω)": {
                    "inputs": {
                        "current": ["A"],
                        "ohms": ["Ω"]
                    },
                    "TYPE": 4
                }, "Amps (A) to volts (V) with Watts(W)": {
                    "inputs": {
                        "current": ["A"],
                        "power": ["W"]
                    },
                    "TYPE": 5
                }, "Amps (A) to mAh (milliampere-hours)": {
                    "inputs": {
                        "current": ["A"],
                        "duration": ["Hours"]
                    },
                    "TYPE": 6
                }, "Kilowatts (kW) to amps (A)": {
                    "inputs": {
                        "power": ["kW"],
                        "voltage": ["mV", "V", "kV"]
                    },
                    "TYPE": 7
                }, "Kilowatts (kW) to kilovolt-amps (kVA)": {
                    "inputs": {
                        "power": ["kW"],
                        "powerFactor": []
                    },
                    "TYPE": 8
                }, "Kilowatts (kW) to volt-amps (VA)": {
                    "inputs": {
                        "power": ["kW"],
                        "powerFactor": []
                    },
                    "TYPE": 9
                }, "Kilowatts (kW) to volts (V)": {
                    "inputs": {
                        "power": ["kW"],
                        "current": ["A"]
                    },
                    "TYPE": 10
                }, "Kilowatts (kW) to watts (W)": {
                    "inputs": {
                        "power": ["kW"]
                    },
                    "TYPE": 11
                }, "Calculate joules(J) from kilowatts(kW)": {
                    "inputs": {
                        "power": ["kW"],
                        "duration": ["Seconds"]
                    },
                    "TYPE": 12
                }, "Calculate watt-hour(Wh) from kilowatts(kW)": {
                    "inputs": {
                        "power": ["kW"],
                        "duration": ["Hours"]
                    },
                    "TYPE": 13
                }, "Kilovolt-amps (kVA) to amps (A)": {
                    "inputs": {
                        "power": ["kVA"],
                        "voltage": ["V"]
                    },
                    "TYPE": 14
                }, "Kilovolt-amps (kVA) to kilowatts (kW)": {
                    "inputs": {
                        "power": ["kVA"],
                        "powerFactor": []
                    },
                    "TYPE": 15
                }, "Kilovolt-amps (kVA) to volt-amps (VA)": {
                    "inputs": {
                        "power": ["kVA"]
                    },
                    "TYPE": 16
                }, "Kilovolt-amps (kVA) to Volts(V)": {
                    "inputs": {
                        "power": ["kVA"],
                        "current": ["A"]
                    },
                    "selections": {
                        "PhaseNumber": [1, 2, 3]
                    },
                    "TYPE": 17
                }, "Kilovolt-amps (kVA) to watts (W)": {
                    "inputs": {
                        "power": ["kVA"],
                        "powerFactor": []
                    },
                    "TYPE": 18
                }, "Kilovolt-amps (kVA) to Joule/second(J/s)": {
                    "inputs": {
                        "power": ["kVA"]
                    },
                    "TYPE": 19
                }, "Volt-amps (VA) to amps (A)": {
                    "inputs": {
                        "power": ["VA"],
                        "voltage": ["V"]
                    },
                    "TYPE": 20
                }, "Volt-amps (VA) to kilowatts (kW)": {
                    "inputs": {
                        "power": ["VA"],
                        "powerFactor": []
                    },
                    "TYPE": 21
                }, "Volt-amps (VA) to Kilovolt-amps (kVA)": {
                    "inputs": {
                        "power": ["VA"]
                    },
                    "TYPE": 22
                }, "Volt-amps (VA) to Volts(V)": {
                    "inputs": {
                        "power": ["VA"],
                        "current": ["A"]
                    },
                    "selections": {
                        "PhaseNumber": [1, 2, 3]
                    },
                    "TYPE": 23
                }, "Volt-amps (VA) to watts (W)": {
                    "inputs": {
                        "power": ["VA"],
                        "powerFactor": []
                    },
                    "TYPE": 24
                }, "Volt-amps (VA) to Joule (J/h, J/s)": {
                    "inputs": {
                        "power": ["VA"]
                    },
                    "TYPE": 25
                }, "Voltage (V) to amps (A) with Ohms(Ω)": {
                    "inputs": {
                        "voltage": ["V"],
                        "ohms": ["Ω"]
                    },
                    "TYPE": 26
                }, "Voltage (V) to amps (A) with Watts(W)": {
                    "inputs": {
                        "voltage": ["V"],
                        "power": ["W"]
                    },
                    "TYPE": 27
                }, "Volts (V) to kilowatts (kW)": {
                    "inputs": {
                        "voltage": ["V"],
                        "current": ["A"]
                    },
                    "TYPE": 28
                }, "Volts (V) to kilovolt-Ampere (kVA)": {
                    "inputs": {
                        "voltage": ["V"],
                        "current": ["A"]
                    },
                    "selections": {
                        "PhaseNumber": [1, 2, 3]
                    },
                    "TYPE": 29
                }, "Volts (V) to Volt-Ampere (VA)": {
                    "inputs": {
                        "voltage": ["V"],
                        "current": ["A"]
                    },
                    "selections": {
                        "PhaseNumber": [1, 2, 3]
                    },
                    "TYPE": 30
                }, "Volts (V) to watts (W)": {
                    "inputs": {
                        "voltage": ["V"],
                        "current": ["A"]
                    },
                    "TYPE": 31
                }, "Volts (V) to Joules (J)": {
                    "inputs": {
                        "voltage": ["V"],
                        "coulombs": ["C"]
                    },
                    "TYPE": 32
                }, "Watts (W) to Amps (A)": {
                    "inputs": {
                        "power": ["W"],
                        "voltage": ["mV", "V", "kV"]
                    },
                    "TYPE": 33
                }, "Watts (W) to kiloWatts (kW)": {
                    "inputs": {
                        "power": ["W"]
                    },
                    "TYPE": 34
                }, "Watts (W) to kilovolt-amps (kVA)": {
                    "inputs": {
                        "power": ["W"],
                        "powerFactor": []
                    },
                    "TYPE": 35
                }, "Watts (W) to volt-amps (VA)": {
                    "inputs": {
                        "power": ["W"],
                        "powerFactor": []
                    },
                    "TYPE": 36
                }, "Watts (W) to volts (V)": {
                    "inputs": {
                        "power": ["W"],
                        "current": ["A"]
                    },
                    "TYPE": 37
                }, "Watts (W) to joules (J)": {
                    "inputs": {
                        "power": ["W"],
                        "duration": ["Seconds"]
                    },
                    "TYPE": 38
                }, "Watts (W) to watt-hour(Wh)": {
                    "inputs": {
                        "power": ["W"],
                        "duration": ["Hours"]
                    },
                    "TYPE": 39
                }, "Joules(J) to Amps(A)": {
                    "inputs": {
                        "joules": ["J/s"],
                        "voltage": ["V"]
                    },
                    "TYPE": 40
                }, "Calculate kilowatts(kW) from joules(J) ": {
                    "inputs": {
                        "joules": ["J"],
                        "duration": ["Seconds"]
                    },
                    "TYPE": 41
                }, "Joules(J) to kilovolt-amps(kVA)": {
                    "inputs": {
                        "joules": ["J/s"]
                    },
                    "TYPE": 42
                }, "Joules(J) to volt-amps(VA)": {
                    "inputs": {
                        "joules": ["J/s"]
                    },
                    "TYPE": 43
                }, "Joules(J) to volts(V)": {
                    "inputs": {
                        "joules": ["J"],
                        "coulombs": ["C"]
                    },
                    "TYPE": 44
                }, "Joules(J) to watts(W)": {
                    "inputs": {
                        "joules": ["J"],
                        "duration": ["Seconds"]
                    },
                    "TYPE": 45
                }, "Joules(J) to watt-hour(Wh)": {
                    "inputs": {
                        "joules": ["J"]
                    },
                    "TYPE": 46
                }, "Milliampere-hours(mAh) to amps(A)": {
                    "inputs": {
                        "mAh": ["mAh"],
                        "duration": ["Hours"]
                    },
                    "TYPE": 47
                }, "Milliampere-hours(mAh) to watt-hour(Wh)": {
                    "inputs": {
                        "mAh": ["mAh"],
                        "voltage": ["V"]
                    },
                    "TYPE": 48
                }, "Watt-hour(Wh) to kilowatts(kW)": {
                    "inputs": {
                        "energy": ["Wh"],
                        "duration": ["Hours"]
                    },
                    "TYPE": 49
                }, "Watt-hour(Wh) to watts(W)": {
                    "inputs": {
                        "energy": ["Wh"],
                        "duration": ["Hours"]
                    },
                    "TYPE": 50
                }, "Watt-hour(Wh) to joules(J)": {
                    "inputs": {
                        "energy": ["Wh"]
                    },
                    "TYPE": 51
                }, "Watt-hour(Wh) to Milliampere-hours(mAh)": {
                    "inputs": {
                        "energy": ["Wh"],
                        "voltage": ["V"]
                    },
                    "TYPE": 52
                }
            },
            currentConversionName: "",
            inputValues: {
                "current": ["", "A"],
                "voltage": ["", "V"],
                "ohms": ["", "Ω"],
                "duration": ["", "Hours"],
                "power": ["", "W"],
                "powerFactor": [0.16, ""],
                "coulombs": ["", "C"],
                "joules": ["", "J"],
                "mAh": ["", "mAh"],
                "energy": ["", "Wh"],
                "selections": {
                    "PhaseNumber": 3 // SET DEFAULT PHASE NUMBER TO 3
                }
            },
            initialInputValues: {},
            resultantJSON: "",
            // resultantJSON1: ""
        }
    }

    componentDidMount() {
        this.setState({
            currentConversionName: Object.keys(this.state.conversions)[0],
            initialInputValues: _cloneDeep(this.state.inputValues)
        })
    }

    updateCurrentConversion = (currentConversionName) => {
        this.setState({
            currentConversionName,
            resultantJSON: "",
            // resultantJSON1: "",
            inputValues: _cloneDeep(this.state.initialInputValues)
        }, () => {
            // this.getValueForInput()
        })
    }

    updateInputValue = (event) => {
        const { name, value } = event.target

        const inputValues = { ...this.state.inputValues }
        inputValues[name][0] = value
        this.setState({
            inputValues,
            resultantJSON: "",
            // resultantJSON1: ""
        })
    }

    handleSelectionUpdation = (event) => {
        const { name, value } = event.target

        const inputValues = { ...this.state.inputValues }
        inputValues["selections"][name] = value
        this.setState({
            inputValues,
            resultantJSON: "",
            // resultantJSON1: ""
        })
    }

    handleUnitUpdation = (event) => {
        const { id, value } = event.target
        console.log(id, value)

        const inputValues = { ...this.state.inputValues }
        inputValues[id][1] = value
        this.setState({
            inputValues,
            resultantJSON: "",
            // resultantJSON1: ""
        })
    }

    getValueForInput = () => {
        const { inputValues, conversions, currentConversionName } = this.state

        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/electricalCalculator`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    value: inputValues,
                    currentTypeIndex: conversions[currentConversionName]["TYPE"]
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    resultantJSON: responseJSON.result
                })
            })

        // fetch(`${Properties.URL}:3003/electricalCalculator`, {
        //     method: "POST", headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         data: {
        //             value: inputValues,
        //             currentTypeIndex: conversions[currentConversionName]["TYPE"]
        //         }
        //     })
        // })
        //     .then(response => response.json())
        //     .then(responseJSON => {
        //         console.log(responseJSON)
        //         this.setState({
        //             resultantJSON1: responseJSON.result
        //         })
        //     })
    }

    render() {
        const { conversions, currentConversionName, inputValues, resultantJSON } = this.state;
        console.log(currentConversionName)
        return (
            <div className="electrical-calculator-container">
                <div className="header">Electrical Calculator</div>
                <div className="row-flex">
                    <div className="available-conversion">
                        {
                            Object.keys(conversions).map((key, index) => {
                                return <li key={shortid.generate()} className={`${key === currentConversionName ? "current-conversion" : ""}`} onClick={() => this.updateCurrentConversion(key)}>{key}</li>
                            })
                        }
                    </div>
                    <div className="input-and-output">
                        {
                            currentConversionName && !_isEmpty(conversions[currentConversionName]["selections"])
                                ? Object.keys(conversions[currentConversionName]["selections"]).map((key, index) => {
                                    return (
                                        <div className="selection-wrapper" key={index}>
                                            {
                                                !_isEmpty(conversions[currentConversionName]["selections"][key])
                                                    ? <select name={key} id={key} key={currentConversionName} onChange={(event) => this.handleSelectionUpdation(event)}>
                                                        <option value="None">Select {key}</option>
                                                        {
                                                            conversions[currentConversionName]["selections"][key].map((unit, unitIndex) => {
                                                                return (
                                                                    <option value={unit} key={unitIndex}>
                                                                        {unit}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    : null
                                            }
                                        </div>
                                    )
                                })
                                : null
                        }
                        {
                            currentConversionName
                                ? Object.keys(conversions[currentConversionName]["inputs"]).map((key, index) => {
                                    return (
                                        <div className="input-wrapper" key={index}>
                                            <InputTextBox className="custom-input-text" name={key} id={key} value={inputValues[key][0]}
                                                onChange={(event) => this.updateInputValue(event)} placeholder={`Enter ${key}`} />
                                            {
                                                !_isEmpty(conversions[currentConversionName]["inputs"][key])
                                                    ? <select name={key} id={key} key={currentConversionName} onChange={(event) => this.handleUnitUpdation(event)}>
                                                        <option value="None">Select {key} Unit</option>
                                                        {
                                                            conversions[currentConversionName]["inputs"][key].map((unit, unitIndex) => {
                                                                return (
                                                                    <option value={unit} key={unitIndex}>
                                                                        {unit}
                                                                    </option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    : null
                                            }
                                        </div>
                                    )
                                })
                                : null
                        }
                        <div className="button-wrapper">
                            <CustomButton className="custom-button" onClick={() => this.getValueForInput()}>Calculate</CustomButton>
                        </div>
                        {
                            resultantJSON
                                ?
                                <div className="result">
                                    {
                                        Object.keys(resultantJSON).map((key, index) => {
                                            return (
                                                <div className="row-span" key={index}>
                                                    <div className="key">{key}</div>
                                                    <div key={index} className="resultant-value">{resultantJSON[key]}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                : null
                        }
                        {/* {
                            resultantJSON1
                                ?
                                <div className="result">
                                    {
                                        Object.keys(resultantJSON1).map((key, index) => {
                                            return (
                                                <div className="row-span" key={index}>
                                                    <div className="key">{key}</div>
                                                    <div key={index} className="resultant-value">{resultantJSON1[key]}</div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                : null
                        } */}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(ElectricalCalculator);