function fixHash(hash) {
    return `${(''+hash).charAt(0) !== '#' ? '#/' : ''}${hash}`;
}

export function replaceHash(hash) {
    history.replaceState('', '', fixHash(hash));
}

export function getHash() {
    return location.hash.slice(2);
}

export function setHash(hash) {
    history.pushState('', '', fixHash(hash));
}