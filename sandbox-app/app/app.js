import React from 'react';
import Header from './components/header';
import Sandbox from './sandbox/SandboxPage';
import './app.less';

function App(){
    return (
        <div>
            <Header />
            <main className="main">
                <Sandbox />
            </main>
        </div>
    );
}

App.propTypes = {};

export default App;
