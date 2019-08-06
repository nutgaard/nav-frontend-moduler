import React, {Component} from "react";
import ReactDOM from "react-dom";
import compile from "./sandboxUtils";
import createErrorboundary from './SandboxErrorboundary';
import "./frame.less";

class Sandbox extends Component {
    state = {
        compiledComponent: {
            component: null,
            error: null,
            warnings: [],
            time: 0
        }
    };
    setRenderref = (ref) => this.renderref = ref;
    listener = (evt) => {
        if (evt.data.type === 'code') {
            const compiledComponent = compile(evt.data.code);
            this.setState({compiledComponent}, this.renderView);
        }
    };

    componentDidMount() {
        window.addEventListener('message', this.listener, false);
    }

    componentWillMount() {
        window.removeEventListener('message', this.listener, false)
    }

    renderView() {
        const CompiledComponent = createErrorboundary(this.state.compiledComponent.component);
        const CompileException = this.state.compiledComponent.error;
        const CompileWarnings = this.state.compiledComponent.warnings.join('\n');
        const time = this.state.compiledComponent.time;

        const renderElement = (
            <div className="sandboxPage__visning">
                { CompileException && <pre className="sandboxPage__feilmelding">{CompileException}</pre> }
                { CompileWarnings && <pre className="sandboxPage__advarsel">{CompileWarnings}</pre> }
                { CompiledComponent && <CompiledComponent /> }
                { <span className="sandboxPage__time">{`Compiled in ${time.toFixed(0)} ms`}</span>}
            </div>
        );

        ReactDOM.unstable_renderSubtreeIntoContainer(this, renderElement, this.renderref);
    }

    render() {
        return (
            <div className="sandboxPage__visningwrapper" ref={this.setRenderref} />
        );
    }
}

ReactDOM.render(<Sandbox />, document.getElementById('app'));