import React from 'react';

export default function createErrorboundary(Component) {
    if (!Component) {
        return Component;
    }
    const originalRender = Component.prototype.render;

    Component.prototype.render = function tryRender() {
        try {
            return originalRender.apply(this, arguments);
        } catch (err) {
            return (<pre className="sandboxPage__feilmelding">err</pre>);
        }
    };
    return Component;
}