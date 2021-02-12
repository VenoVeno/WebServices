import React from 'react';

import './HomePage.styles.scss';

class HomePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            programList: ["Date Difference", "Set Theory Operations", "Matrix Operations",
                "Figure to Words in Currency", "RSA Algorithm", "MD5 Checksum",
                "128-bit Barcode", "QR-Code", "OTP Genertion", "CAPTCHA"]
        }
    }

    toggleSelectedProgram = (programNumber) => {
        console.log(programNumber)
        this.props.history.push(`/program/${programNumber}`);
    }

    render() {
        const { programList } = this.state;
        return (
            <div className="home-page-wrapper">
                <div className="select-container">
                    <select name="program-selection" id="program-selection"
                        onChange={e => this.toggleSelectedProgram(parseInt(e.target.value) + 1)}>
                        <option value={-1}>Select Program</option>
                        {
                            programList.map((name, index) => {
                                return (
                                    <option key={index} name={name} value={index}>
                                        {name}
                                    </option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
        )
    }
}

export default HomePage;