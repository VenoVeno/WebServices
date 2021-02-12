import React, { useEffect } from 'react';
import { useHistory } from 'react-router';

// import PageNotFoundImage from '../../assets/404.jpg'
import { ReactComponent as PageNotFoundImage } from '../../assets/404.svg';

import './PageNotFound.styles.scss';

const PageNotFound = () => {
    const [counter, setCounter] = React.useState(5);
    const history = useHistory();

    useEffect(() => {
        const timer = counter > 0 && setInterval(() => {
            setCounter(counter - 1)
        }, 1000);
        if (counter === 0)
            history.push({ pathname: '/' })
        return () => clearInterval(timer);
        // eslint-disable-next-line
    }, [counter]);

    return (
        <div className="not-found-wrapper">
            <div>
                <PageNotFoundImage className="page-not-found-image" />
                <h3 className="header">404 page not found</h3>
                <p className="content">We are sorry but the page you are looking for does not exist.</p>
                <p>You should be automatically redirected in {counter} seconds...</p>
            </div>
        </div>
    );
}

export default PageNotFound;