import { Provider } from 'mobx-react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Router } from 'react-router-dom';
import { Api } from './api';
import { App } from './app';
import { Config } from './config';
import { Dependencies } from './dependencies';
import { StorageFacade } from './dependencies/storageFacade';
import { history } from './history';
import './styles/styles.scss';

/**
 * Wire up dependencies which will be used by the app
 */
function getDependencies() {
    const config = new Config({
        // These values are suppied by the webpack.DefinePlugin - see config
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE,
        AUTH0_REDIRECT_URI: process.env.AUTH0_REDIRECT_URI,
        API_BASE_URI: process.env.API_BASE_URI,
        NODE_ENV: process.env.NODE_ENV,
    });
    const api = new Api(config);
    const storage = new StorageFacade(window.localStorage);
    const dependencies = new Dependencies(api, config, storage);

    dependencies.authStore.initialise();

    return dependencies;
}

/**
 * Render the app
 */
function renderApp(dependencies: Dependencies) {
    const rootEl = document.getElementById('root');
    ReactDOM.render(
        <AppContainer>
            <Provider {...dependencies}>
                <Router history={history}>
                    <App />
                </Router>
            </Provider>
        </AppContainer>,
        rootEl
    );

    const anyModule: any = module;

    // Hot Module Replacement API
    if (anyModule.hot) {
        anyModule.hot.accept('./app', () => {
            const makeNextApp = require('./app').default;
            const nextApp = makeNextApp(['app']);
            ReactDOM.render(
                <AppContainer>
                    <Provider {...dependencies}>
                        <Router history={history}>
                            {nextApp.App}
                        </Router>
                    </Provider>
                </AppContainer>,
                rootEl
            );
        });
    }
}

renderApp(
    getDependencies()
);
