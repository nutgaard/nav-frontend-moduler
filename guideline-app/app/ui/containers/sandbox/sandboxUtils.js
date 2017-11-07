import React from 'react';
import * as Babel from '@babel/standalone';

function requireAll(requireContext) {
    return requireContext.keys().reduce((acc, rc) => ({ ...acc, [rc]: requireContext(rc) }), {});
}
function getRequireContext() {
    if (process.env.NODE_ENV === 'production') { // Pga statisk analyse kan ikke `isProduction` brukes her
        return require.context('./../../../../../packages/node_modules/', true, /lib\/.*\.jsx?$/);
    } else {
        return require.context('./../../../../../packages/node_modules/', true, /src\/.*\.jsx?$/)
    }
}

const requireSource = process.env.NODE_ENV === 'production' ? 'lib' : 'src';
const pkgs = requireAll(require.context('./../../../../../packages/node_modules/', true, /package.json$/));
const requireContext = getRequireContext();

const mainfiles = Object.entries(pkgs)
    .map(([pkgPath, pkg]) => [pkg.name, pkg.main])
    .filter(([pkgName, mainfile]) => !mainfile.endsWith('less'))
    .reduce((acc, [pkgName, mainfile]) => ({
        ...acc,
        [pkgName]: requireContext(`./${pkgName}/${mainfile.replace(/^lib/, requireSource)}`)
    }), {});

mainfiles.react = React;

function prettystack(ex) {
    return ex.split('\n')
        .filter((line, idx) => idx === 0 || line.includes('|'))
        .join('\n');
}
const isolatedScope = [
    'window',
    'document',
    'location',
    'history'
];

const tryCatchString = `
exports.default = function() {
  try {
    return _default();
  } catch (inscriptError) {
    console.error('inscriptError', inscriptError);
    return _react.default.createElement('pre', { className: 'sandboxPage__feilmelding' }, inscriptError.toString());
  }
};
`;

function tryCatch(code) {
    return code.replace('exports.default = _default;', tryCatchString);
}

export default function compile(code) {
    const startTime = performance.now();
    const warnings = [];
    try {
        const compiled = Babel.transform(code, { presets: ["es2015", "react", "stage-2"]});
        const run = new Function('require', 'exports', 'importlist', ...isolatedScope, tryCatch(compiled.code));
        const out = {};
        const mockrequire = (req) => {
            const res = mainfiles[req];
            if (res) {
                return res;
            }
            warnings.push(`Fant ikke avhengigheten: '${req}'`);
        };

        run(mockrequire, out, Object.keys(mainfiles));

        const endTime = performance.now();
        const time = endTime - startTime;
        if (warnings.length > 0) {
            return { warnings, time };
        }
        return { component: out.default, warnings, time };
    } catch (e) {
        const endTime = performance.now();
        const time = endTime - startTime;
        return { error: prettystack(e.stack), warnings, time };
    }
}