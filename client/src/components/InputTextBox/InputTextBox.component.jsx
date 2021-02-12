import React from 'react';

import './InputTextBox.styles.scss';

const InputTextBox = ({ ...props }) => {
    return (
        <input type="number" {...props} />
    )
}

export default InputTextBox;