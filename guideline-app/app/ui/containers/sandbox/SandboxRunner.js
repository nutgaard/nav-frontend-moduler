import React, {Component} from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import compile from "./sandboxUtils";
import "./frame.less";

const visningsCls = (compiledComponent) => classNames('sandboxPage__visning', {
    'sandboxPage__visning--error': compiledComponent.error,
    'sandboxPage__visning--warning': compiledComponent.warnings.length > 0
});

class Sandbox extends Component {
    state = {
        compiledComponent: {
            component: null,
            error: null,
            warnings: [],
            time: 0
        }
    };
    listener = (evt) => {
        if (evt.data.type === 'code') {
            const compiledComponent = compile(evt.data.code);
            this.setState({compiledComponent});
        }
    };

    componentDidMount() {
        window.addEventListener('message', this.listener, false);
    }

    componentWillMount() {
        window.removeEventListener('message', this.listener, false)
    }

    render() {
        const CompiledComponent = this.state.compiledComponent.component;
        const CompileException = this.state.compiledComponent.error;
        const CompileWarnings = this.state.compiledComponent.warnings.join('\n');
        const time = this.state.compiledComponent.time;

        return (
            <div className={visningsCls(this.state.compiledComponent)}>
                { CompileException && <pre className="sandboxPage__feilmelding">{CompileException}</pre> }
                { CompileWarnings && <pre className="sandboxPage__advarsel">{CompileWarnings}</pre> }
                { CompiledComponent && <CompiledComponent /> }
                { <span className="sandboxPage__time">{`Compiled in ${time.toFixed(0)} ms`}</span>}
            </div>
        );
    }
}

ReactDOM.render(<Sandbox />, document.getElementById('app'));