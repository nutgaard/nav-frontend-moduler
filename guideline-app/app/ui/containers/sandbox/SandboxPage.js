import React, { Component } from 'react';
import _throttle from 'lodash.throttle';
import classNames from 'classnames';
import LZString from 'lz-string';
import compile from './sandboxUtils';
import SandboxEditor from './SandboxEditor';
import './styles.less';

const visningsCls = (compiledComponent) => classNames('sandboxPage__visning', {
    'sandboxPage__visning--error': compiledComponent.error,
    'sandboxPage__visning--warning': compiledComponent.warnings.length > 0
});

const testScript = `import React from 'react';
import Panel from 'nav-frontend-paneler';
import { Systemtittel, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';

function TestComp() {
    return (
        <div>
            <Panel className="blokk-xs">
                <Systemtittel className="blokk-xs">Velkommen til sandkassa.</Systemtittel>
                <Normaltekst className="blokk-xxs">
                    Her kan du leke med de nyeste lekene i NAVs designsystem.
                </Normaltekst>
                <Normaltekst className="blokk-xxs">
                    Ved endringer på koden til høyre oppdateres denne visningen automatisk. 
                </Normaltekst>
                <Normaltekst className="blokk-m">
                    Alle modulene fra NAVs designsystem er tilgjengelig her. 
                    Men husk at du må importere som om det var en normal react-komponent. 
                </Normaltekst>
            </Panel>
            <EkspanderbartPanel tittelProps="undertittel" tittel="Tilgjengelige imports">
                {importlist.map((imp) => <p key={imp}>{imp}</p>)}
            </EkspanderbartPanel>
        </div>
    );
}

export default TestComp;`;

function getInitialState(props) {
    let initialCode = testScript;

    if (props.match.params.urlCode && props.match.params.urlCode.length > 0) {
        initialCode = LZString.decompressFromEncodedURIComponent(props.match.params.urlCode);
    }

    return {
        value: initialCode,
        compiledComponent: compile(initialCode)
    };
}

class SandboxPage extends Component {
    state = getInitialState(this.props);
    update = (e) => {
        const newCode = e.target.value;
        this.setState({ value: newCode });
        this.compileScript(newCode);
    };
    compileScript = _throttle((newCode) => {
        const compiledComponent = compile(newCode);
        const urlCode = LZString.compressToEncodedURIComponent(newCode);
        this.props.history.replace(`/sandbox/${urlCode}`);
        this.setState({ compiledComponent });
    }, 100);

    render() {
        const CompiledComponent = this.state.compiledComponent.component;
        const CompileException = this.state.compiledComponent.error;
        const CompileWarnings = this.state.compiledComponent.warnings.join('\n');
        const time = this.state.compiledComponent.time;

        return (
            <div className="sandboxPage">
                <div className="sandboxPage__kode">
                    <SandboxEditor value={this.state.value} onChange={this.update} />
                </div>
                <div className={visningsCls(this.state.compiledComponent)}>
                    { CompileException && <pre className="sandboxPage__feilmelding">{CompileException}</pre> }
                    { CompileWarnings && <pre className="sandboxPage__advarsel">{CompileWarnings}</pre> }
                    { CompiledComponent && <CompiledComponent /> }
                    { <span className="sandboxPage__time">{`Compiled in ${time.toFixed(0)} ms`}</span>}
                </div>
            </div>
        );
    }
}

export default SandboxPage;