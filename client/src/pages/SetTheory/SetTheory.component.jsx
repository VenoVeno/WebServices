import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import _isEmpty from 'lodash/isEmpty';
import shortid from 'shortid';

import './SetTheory.styles.scss';

class SetTheory extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            setANumber: 1,
            setBNumber: 2,
            setAList: [],
            setBList: [],
            setTheoryResult: []
        }
    }

    updateInputNumber = (event) => {
        let { name, value } = event.target
        if (value === "") value = ""
        else if (!isNaN(Number(value))) value = parseInt(value)

        this.setState({
            [name]: value
        })
        console.log(name, value)
    }

    updateSetA = () => {
        const { setANumber, setAList } = this.state

        // CHECK FOR EMPTY STATE
        if (setANumber === "")
            return;

        const updatedSetAList = [...setAList, setANumber]
        this.setState({
            setAList: updatedSetAList,
            setANumber: ""
        })
    }

    updateSetB = () => {
        const { setBNumber, setBList } = this.state

        // CHECK FOR EMPTY STATE
        if (setBNumber === "")
            return;

        const updatedSetBList = [...setBList, setBNumber]
        this.setState({
            setBList: updatedSetBList,
            setBNumber: ""
        })
    }

    getResult = () => {
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/setTheory`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    setAList: this.state.setAList,
                    setBList: this.state.setBList
                }
            })
        })
            .then(response => response.json())
            .then(responseJSON => {
                console.log(responseJSON)
                this.setState({
                    setTheoryResult: responseJSON
                })
            })
    }

    // sortResult = () => {
    //     const { setTheoryResult } = this.state;
    //     let updatedSetTheoryResult = {}
    //     Object.keys(setTheoryResult).map(key => {
    //         console.log(setTheoryResult[key].sort())
    //         updatedSetTheoryResult = {
    //             ...updatedSetTheoryResult,
    //             [key]: setTheoryResult[key].sort()
    //         }
    //     })
    //     console.log(updatedSetTheoryResult)
    //     this.setState({
    //         setTheoryResult: updatedSetTheoryResult
    //     })
    // }

    render() {
        const { setANumber, setBNumber, setAList, setBList, setTheoryResult } = this.state
        console.log(setANumber, setBNumber)
        return (
            <div className="set-theory-operation-wrapper" >
                <div className="header">Set Theory Operations</div>
                <div className="input-wrapper">
                    <div className="input-1 input">
                        <InputTextBox type="text" className="custom-input-text" name="setANumber" id="set-a-number" value={setANumber}
                            onChange={(event) => this.updateInputNumber(event)} placeholder="Set A Input Number" />
                        <CustomButton className="custom-button" onClick={() => this.updateSetA()}>Append To Set A</CustomButton>
                        {
                            setAList.map((number, index) => {
                                return (
                                    <li key={index}>{number}</li>
                                )
                            })
                        }
                    </div>
                    <div className="input-2 input">
                        <InputTextBox type="text" className="custom-input-text" name="setBNumber" id="set-b-number" value={setBNumber}
                            onChange={(event) => this.updateInputNumber(event)} placeholder="Set B Input Number" />
                        <CustomButton className="custom-button" onClick={() => this.updateSetB()}>Append To Set B</CustomButton>
                        {
                            setBList.map((number, index) => {
                                return (
                                    <li key={index}>{number}</li>
                                )
                            })
                        }
                    </div>
                </div>
                <div className="submit-button-wrapper">
                    {
                        !_isEmpty(setAList) && !_isEmpty(setBList)
                            ? <CustomButton className="custom-button" onClick={() => this.getResult()}>
                                Perform Set Theory Operation
                            </CustomButton>
                            // <CustomButton className="custom-button" onClick={() => this.sortResult()}>
                            //     Sort Result
                            // </CustomButton>
                            : null
                    }
                </div>
                <div className="output-content-wrapper">
                    {
                        !_isEmpty(setTheoryResult)
                            ? Object.keys(setTheoryResult).map(key => {
                                return (
                                    <div className="output-wrapper" key={shortid.generate()}>
                                        <div className="name" >{key.toLocaleUpperCase()}</div>
                                        <div className="values">
                                            {
                                                setTheoryResult[key].map(value => {
                                                    return (
                                                        <li key={shortid.generate()}>{value}</li>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
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

export default connect(mapStateToProps)(SetTheory);