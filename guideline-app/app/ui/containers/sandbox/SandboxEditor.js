import React from 'react';

const tellerTekst = (antallTegn) => `${antallTegn} tegn`;

function SandboxEditor(props) {
    const antallTegn = props.value.length;

    return (
        <div className="skjemaelement textarea__container sandboxPage__textarea">
            <label className="skjemaelement__label" htmlFor={props.name}>Kode</label>
            <div className="textarea--medMeta__wrapper">
                <textarea
                    className="skjemaelement__input textarea--medMeta"
                    type="text"
                    id={props.name}
                    {...props}
                />
                <p className="textarea--medMeta__teller">
                    { tellerTekst(antallTegn || 0) }
                </p>
            </div>
        </div>
    );
}

export default SandboxEditor;