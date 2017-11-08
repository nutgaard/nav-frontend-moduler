import React, { Component } from 'react';
import _throttle from 'lodash.throttle';
import LZString from 'lz-string';
import SandboxEditor from './SandboxEditor';
import { Hovedknapp } from './../../../packages/node_modules/nav-frontend-knapper';
import { Element } from './../../../packages/node_modules/nav-frontend-typografi';
import './styles.less';

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

    // if (props.match.params.urlCode && props.match.params.urlCode.length > 0) {
    //     initialCode = LZString.decompressFromEncodedURIComponent(props.match.params.urlCode);
    // }

    return {
        value: initialCode,
        connected: false
    };
}

class SandboxPage extends Component {
    state = getInitialState(this.props);
    iframeref = (ref) => this.frame = ref.contentWindow;
    connect = () => this.setState({ connected: true }, () => this.compileScript(this.state.value));
    update = (e) => {
        const newCode = e.target.value;
        this.setState({ value: newCode });
        this.compileScript(newCode);
    };
    compileScript = _throttle((newCode) => {
        if (!this.state.connected) {
            return;
        }

        this.frame.postMessage({ type: 'code', code: newCode }, "*");
        const urlCode = LZString.compressToEncodedURIComponent(newCode);
        this.props.history.replace(`/sandbox/${urlCode}`);
    }, 100);


    render() {
        return (
            <div className="sandboxPage">
                <div className="sandboxPage__kode">
                    <SandboxEditor value={this.state.value} onChange={this.update} />
                </div>
                <div className="sandboxPage__iframewrapper">
                    {!this.state.connected && (
                        <div className="sandboxPage__iframecover">
                            <Element className="text-center">Kjøring av kode andre har skrevet medfører en risiko.</Element>
                            <Element className="blokk-m text-center">Aldri skriv inn sensitive data, eller brukernavn og passord i denne løsningen.</Element>
                            <Hovedknapp onClick={this.connect}>Last inn</Hovedknapp>
                        </div>
                    )}
                    <iframe src="sandboxRunner.html" ref={this.iframeref} sandbox="allow-scripts" className="sandboxPage__iframe"/>
                </div>
            </div>
        );
    }
}

export default SandboxPage;