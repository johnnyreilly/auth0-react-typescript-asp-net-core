import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Button, Container } from 'semantic-ui-react';
import { fetchJson } from '../../../api/network';
import { Config } from '../../../config';
import { Dependencies } from '../../../dependencies/index';
import { AuthStore } from '../../../dependencies/stores/authStore';

interface IBook {
    author: string;
    title: string;
    ageRestriction: boolean;
}

interface IProps extends RouteComponentProps<{}> {
    authStore?: AuthStore;
    config?: Config;
}

interface IState {
    message: string;
}

@inject((dependencies: Dependencies) => ({
    authStore: dependencies.authStore,
    config: dependencies.config
}))
@observer
export class PingPage extends React.Component<IProps, IState> {
    componentWillMount() {
        this.setState({ message: '' });
    }

    serverGetsProfileData = () => {
        const accessToken = this.props.authStore.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        fetchJson<any>(`${this.props.config.apiBaseUri}/user`, { headers })
            .then(user => this.setState({ message: `user: ${JSON.stringify(user)}` }))
            .catch(error => this.setState({ message: error.message }));
    };

    adminData = () => {
        const accessToken = this.props.authStore.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        fetchJson<any>(`${this.props.config.apiBaseUri}/userDoAdminThing`, { headers })
            .then(user => this.setState({ message: `this is admin data: ${JSON.stringify(user)}` }))
            .catch(error => this.setState({ message: error.message }));
    };

    privateData = () => {
        const accessToken = this.props.authStore.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        fetchJson<IBook[]>(`${this.props.config.apiBaseUri}/books`, { headers })
            .then(books => this.setState({ message: `we got the books: ${JSON.stringify(books)}` }))
            .catch(error => this.setState({ message: error.message }));
    };
    
    render() {
        const { message } = this.state;
        return (
            <Container>
                <h1>Make a Call to the Server</h1>
                <Button primary={true} onClick={this.privateData}>
                    Get Private Data
                </Button>
                <Button primary={true} onClick={this.serverGetsProfileData}>
                    Get Server To Retrieve Profile Data
                </Button>
                <Button primary={true} onClick={this.adminData}>
                    Get Admin Data
                </Button>
                <h2>{message}</h2>
            </Container>
        );
    }
}
