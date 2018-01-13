import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { Dependencies } from '../../../dependencies/index';
import { AuthStore } from '../../../dependencies/stores/authStore';

interface IProps extends RouteComponentProps<{}> {
  authStore?: AuthStore;
}

@inject((dependencies: Dependencies) => ({
  authStore: dependencies.authStore
}))
@observer
export class HomePage extends React.Component<IProps> {
  login = () => {
    this.props.authStore.login();
  }

  render() {
    const isAuthenticated = this.props.authStore.isAuthenticated;
    return (
      <Container>
        {isAuthenticated ? (
          <h4>You are logged in!</h4>
        ) : (
          <h4>
            You are not logged in! Please{' '}
            <a style={{ cursor: 'pointer' }} onClick={this.login}>
              Log In
            </a>{' '}
            to continue.
          </h4>
        )}
      </Container>
    );
  }
}
