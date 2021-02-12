import React from 'react';

import './CustomButton.styles.scss';

const CustomButton = React.forwardRef((props, ref) => {
    const { children } = props
    return (
        <div {...props} ref={ref}>{children}</div>
    )
})

export default CustomButton;