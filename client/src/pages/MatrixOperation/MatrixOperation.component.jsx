import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import CustomButton from '../../components/CustomButton/CustomButton.component';
import InputTextBox from '../../components/InputTextBox/InputTextBox.component';

import { Properties } from '../../global.properties';

import _isEmpty from 'lodash/isEmpty';

import './MatrixOperation.styles.scss';
import shortid from 'shortid';

class MatrixOperation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rowCount: 3,
            columnCount: 3,
            matrixValue: "",
            // matrixList: [1, 2, 3, 4, 5, 6, 7, 8, 9],
            matrixList: [],
            twoDimMatrix: [],
            setTheoryResult: []
        }
    }

    updateInputNumber = (event) => {
        let { name, value } = event.target
        if (value === "") value = ""
        else value = parseInt(value)

        // CLEAR THE VALUE OF EXISTING MATRIX
        if (name === "rowCount" || name === "columnCount")
            this.setState({
                matrixList: [],
                twoDimMatrix: [],
                setTheoryResult: []
            })
        this.setState({
            [name]: value
        })
        console.log(name, value)
    }

    calculateTotalElements = () => {
        const { rowCount, columnCount } = this.state;
        if (rowCount === 0 || rowCount === "") return columnCount;
        else if (columnCount === 0 || columnCount === "") return rowCount
        else return rowCount * columnCount;
    }

    updateMatrixList = () => {
        const { rowCount, columnCount, matrixValue, matrixList } = this.state;
        if (rowCount === 0 || columnCount === 0 || matrixValue === "") return

        // FOCUS INPUT TAG AFTER ENTERING VALUE
        document.getElementById("matrix-number").focus()

        const updatedMatrixList = [...matrixList, matrixValue]
        this.setState({
            matrixList: updatedMatrixList,
            matrixValue: ""
        })
    }

    performMatrixOperation = () => {
        const { matrixList, rowCount, columnCount } = this.state
        console.log(matrixList)

        var matrix = new Array(rowCount)
        console.log(matrix)

        for (let i = 0; i < rowCount; i++) {
            matrix[i] = new Array(columnCount)
        }
        console.log(matrix)

        var index = 0;

        for (let i = 0; i < rowCount; i++) {
            for (let j = 0; j < columnCount; j++) {
                matrix[i][j] = matrixList[index++]
            }
        }
        console.log(matrix)
        this.setState({
            twoDimMatrix: matrix
        })
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/matrixOperation`, {
            method: "POST", headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: {
                    matrix
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

    render() {
        const { rowCount, columnCount, matrixValue, matrixList, twoDimMatrix, setTheoryResult } = this.state;
        console.log(rowCount, columnCount)
        return (
            <div className="matrix-operation-wrapper">
                <div className="header">Matrix Operation</div>
                <div className="matrix-input">
                    <div className="row-column-count">
                        <InputTextBox className="custom-input-text" name="rowCount" id="row-count" value={rowCount} min={0}
                            onChange={(event) => this.updateInputNumber(event)} placeholder="Row Count" />
                        <InputTextBox className="custom-input-text" name="columnCount" id="column-count" value={columnCount} min={0}
                            onChange={(event) => this.updateInputNumber(event)} placeholder="Column Count" />
                    </div>
                    {
                        this.calculateTotalElements() && rowCount >= 0 && columnCount >= 0 && rowCount !== "" && columnCount !== ""
                            ? <>
                                {
                                    this.calculateTotalElements() !== matrixList.length
                                        ? <>
                                            <InputTextBox className="custom-input-text" name="matrixValue" id="matrix-number" value={matrixValue} autoFocus
                                                onChange={(event) => this.updateInputNumber(event)} placeholder={`Enter ${this.calculateTotalElements()} Elements One By One`} />
                                            <CustomButton className="custom-button" onClick={() => this.updateMatrixList()}>Append To Matrix</CustomButton>
                                        </>
                                        : null
                                }
                                {
                                    this.calculateTotalElements() !== matrixList.length
                                        ? <div className="matrix-numbers">
                                            {
                                                matrixList.map((number, index) => {
                                                    return (
                                                        <li key={index}>{number}</li>
                                                    )
                                                })
                                            }
                                        </div>
                                        : null
                                }
                                {
                                    this.calculateTotalElements() === matrixList.length
                                        // && _isEmpty(setTheoryResult)
                                        ? <CustomButton className="custom-button" onClick={() => this.performMatrixOperation()}>Perform Matrix Operation</CustomButton>
                                        : null
                                }
                                <div className="two-dim-matrix-numbers">
                                    <div className="input-matrix-wrapper">
                                        {
                                            !_isEmpty(twoDimMatrix)
                                                ? <div className="input-matrix">
                                                    <div className="matrix-name">Original Matrix</div>
                                                    {
                                                        twoDimMatrix.map((row, rowIndex) => {
                                                            return (
                                                                <div className={`row-${rowIndex} row`}>
                                                                    {
                                                                        twoDimMatrix[rowIndex].map((col, colIndex) => {
                                                                            return (
                                                                                <li key={shortid.generate()}>{twoDimMatrix[rowIndex][colIndex]}</li>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                                : null
                                        }
                                    </div>
                                    <div className="output-matrix-container">
                                        {
                                            !_isEmpty(setTheoryResult)
                                                ? Object.keys(setTheoryResult).map((value, index) => {
                                                    return (
                                                        <div className="output-matrix" key={index}>
                                                            <div className="matrix-name">{value.toLocaleUpperCase()}</div>
                                                            {
                                                                setTheoryResult[value].map((row, rowIndex) => {
                                                                    return (
                                                                        <div className={`row-${rowIndex} row`} key={shortid.generate()}>
                                                                            {
                                                                                row.map((col, colIndex) => {
                                                                                    return (
                                                                                        <li key={shortid.generate()}>{setTheoryResult[value][rowIndex][colIndex] ? setTheoryResult[value][rowIndex][colIndex] : "-"}</li>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    )
                                                })
                                                : null
                                        }
                                    </div>
                                </div>
                            </>
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

export default connect(mapStateToProps)(MatrixOperation);