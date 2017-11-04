import React from 'react';
import './styles.less';

const open = "{";
const close = "}";

function LoaderAnimation() {
    return (
        <div className="loader">
            <span className="loader__child">{open}</span>
            <span className="loader__child">{close}</span>
        </div>
    );
}

function Loading(props) {
    if (props.error) {
        return <div>Error!</div>;
    } else if (props.timedOut) {
        return <LoaderAnimation />;
    } else if (props.pastDelay) {
        return <LoaderAnimation />;
    } else {
        return null;
    }
}

export default Loading;