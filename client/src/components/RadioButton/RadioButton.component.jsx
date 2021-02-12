import React from 'react';

import './RadioButton.styles.scss';

const RadioButton = ({ children, ...props }) => {
    const { id } = props
    return (
        <div className="radio-button-div">
            <input type="radio" className="radio-button" {...props} />
            <label htmlFor={id}>{children}</label>
        </div>
    )
}

export default RadioButton;