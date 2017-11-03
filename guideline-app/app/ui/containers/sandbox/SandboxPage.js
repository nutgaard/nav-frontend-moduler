import React, { Component } from 'react';
import _throttle from 'lodash.throttle';
import classNames from 'classnames';
import compile from './sandboxUtils';
import { Textarea } from './../../../../../packages/node_modules/nav-frontend-skjema';
import './styles.less';

const visningsCls = (compiledComponent) => classNames('sandboxPage__visning', {
    'sandboxPage__visning--error': compiledComponent.error,
    'sandboxPage__visning--warning': compiledComponent.warnings
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
                {importlist.map((imp) => <p>{imp}</p>)}
            </EkspanderbartPanel>
        </div>
    );
}

export default TestComp;`;

class SandboxPage extends Component {
    state = { value: testScript, compiledComponent: compile(testScript) };
    update = (e) => {
        const newCode = e.target.value;
        this.setState({ value: newCode });
        this.compileScript(newCode);
    };
    compileScript = _throttle((newCode) => {
        const compiledComponent = compile(newCode);
        this.setState({ compiledComponent });
    }, 100);

    tellerTekst = (antallTegn) => `${antallTegn} tegn`;

    render() {
        const CompiledComponent = this.state.compiledComponent.component;
        const CompileException = this.state.compiledComponent.error;
        const CompileWarnings = this.state.compiledComponent.warnings;

        return (
            <div className="sandboxPage">
                <div className="sandboxPage__kode">
                    <Textarea
                        label="Kode"
                        className="sandboxPage__textarea"
                        value={this.state.value}
                        onChange={this.update}
                        tellerTekst={this.tellerTekst}
                    />
                </div>
                <div className={visningsCls(this.state.compiledComponent)}>
                    { CompileException && <pre className="sandboxPage__feilmelding">{CompileException}</pre> }
                    { CompileWarnings && <pre className="sandboxPage__advarsel">{CompileWarnings}</pre> }
                    { CompiledComponent && <CompiledComponent /> }
                </div>
            </div>
        );
    }
}

export default SandboxPage;