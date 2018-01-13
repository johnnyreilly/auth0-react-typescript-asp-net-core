import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import { Dependencies } from '../../dependencies/index';
import { AuthStore } from '../../dependencies/stores/authStore';

interface IProps extends RouteComponentProps<{}> {
  authStore: AuthStore;
}

@inject((dependencies: Dependencies) => ({
  authStore: dependencies.authStore
}))
@observer
export class Callback extends React.Component<IProps> {
  componentWillMount() {
    const { authStore, location } = this.props;
    if (/access_token|id_token|error/.test(location.hash)) {
      authStore.handleAuthentication();
    }
  }

  render() {
    const style = {
      position: 'absolute',
      display: 'flex',
      justifyContent: 'center',
      height: '100vh',
      width: '100vw',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
    };

    return (
      <div style={{style}}>
          <Icon className="wait big" />
          Loading...
      </div>
    );
  }
}
