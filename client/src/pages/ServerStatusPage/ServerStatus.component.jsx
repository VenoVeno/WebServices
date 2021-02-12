import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { selectAPIServerPORT } from '../../redux/app/app.selectors';

import { Properties } from '../../global.properties';

import { ReactComponent as NewWindow } from '../../assets/New_Window.svg';
import { ReactComponent as BackIcon } from '../../assets/BackIcon.svg';

import './ServerStatus.styles.scss';

class ServerStatusPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: {},
            showResponse: false,
            errorMessage: ""
        }
    }
    componentDidMount() {
        fetch(`${Properties.URL}:${this.props.API_SERVER_PORT}/status`)
            .then(response => {
                this.setState({ response })
            })
            .catch(error => {
                this.setState({ errorMessage: error.message })
            })
            .finally(() => {
                this.setState({ showResponse: true })
            })
    }

    checkSocketHealth = () => {
        window.open(`${Properties.URL}:${this.props.API_SERVER_PORT}/health`)
    }

    render() {
        const { response, showResponse, errorMessage } = this.state;
        return (
            <div className="server-status-check">
                <div className="header">
                    <div className="logo-container">
                        <div onClick={() => window.history.back()}>
                            <BackIcon className="back-icon" />
                        </div>
                    </div>
                </div>
                <div className="content">
                    {
                        showResponse
                            ? errorMessage !== ""
                                ? <div className="error">Failed! Couldn't connect to the Server!
                                This may be due to Node Server is not Running! Or the Node Server URL is not Updated!</div>
                                : <>
                                    <h3>Node Server Status</h3>
                                    <div className="server-url-wrapper">
                                        <span>Node Server URL : </span>
                                        <span className="url-and-image" onClick={() => this.checkSocketHealth()}>
                                            <span className="server-url">{response.url.substr(0, response.url.lastIndexOf("/"))}</span>
                                            <NewWindow />
                                        </span>
                                    </div>
                                    <div>
                                        <span>Server Status : </span>
                                        <span style={{ color: response.status !== 200 ? "red" : "#2bb673" }}>{response.status}</span>
                                    </div>
                                    <div>
                                        <span>Server Text : </span>
                                        <span>{response.statusText}</span>
                                    </div>
                                    <div>
                                        <span>Server Redirected : </span>
                                        <span>{String(response.redirected)}</span>
                                    </div>
                                    <div>
                                        <span>Server Ok : </span>
                                        <span>{String(response.ok)}</span>
                                    </div>
                                    <div>
                                        <span>Server Type : </span>
                                        <span>{response.type}</span>
                                    </div>
                                </>
                            : <div>Connecting to The Server...</div>
                    }
                </div>
            </div>
        )
    }
}

const mapStateToProps = createStructuredSelector({
    API_SERVER_PORT: selectAPIServerPORT
});

export default connect(mapStateToProps)(ServerStatusPage);