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
export class ProfilePage extends React.Component<IProps> {
    componentWillMount() {
        const { authStore } = this.props;
        if (!authStore.userProfile) {
            authStore.loadProfile();
        }
    }

    render() {
        const profile = this.props.authStore.userProfile;

        return profile ? (
            <Container>
                <div className="profile-area">
                    <h1>{profile.name}</h1>
                    <img src={profile.picture} alt="profile" />
                    <div>
                        Nickname <h3>{profile.nickname}</h3>
                    </div>
                    <pre>{JSON.stringify(profile, null, 2)}</pre>
                </div>
            </Container>
        ) : null;
    }
}
