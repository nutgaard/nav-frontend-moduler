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

export default function compile(code) {
    try {
        console.time('compile');
        const compiled = Babel.transform(code, { presets: ["es2015", "react", "stage-2"]});
        const run = new Function('require', 'exports', 'importlist', compiled.code);
        const out = {};
        const warnings = [];
        const mockrequire = (req) => {
            const res = mainfiles[req];
            if (res) {
                return res;
            }
            warnings.push(`Fant ikke avhengigheten: '${req}'`);
        };

        run(mockrequire, out, Object.keys(mainfiles));

        console.timeEnd('compile');
        if (warnings.length > 0) {
            return { warnings };
        }
        return { component: out.default };
    } catch (e) {
        return { error: prettystack(e.stack) };
    }
}