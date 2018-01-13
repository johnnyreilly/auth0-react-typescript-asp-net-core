// tslint:disable-next-line:no-implicit-dependencies
import * as classNames from "classnames";
import { inject, observer } from "mobx-react";
import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { Button, Container, Icon, Image, Menu } from "semantic-ui-react";
import { Config } from "../../config";
import { Dependencies } from "../../dependencies/index";
import { AuthStore } from "../../dependencies/stores/authStore";
import { pingPath, pingTitle } from "../features/ping";
import { profilePath, profileTitle } from "../features/profile";

const leftLoggedInLinks = [{ path: pingPath, title: pingTitle }];

const HeaderLink: React.SFC<{ path: string; location: string }> = props => (
  <Menu.Item active={props.location === props.path}>
    <Link key={props.path} to={props.path} className="item">
      {props.children}
    </Link>
  </Menu.Item>
);

interface IHeaderProps extends RouteComponentProps<{}> {
  config?: Config;
  authStore?: AuthStore;
}

@inject((dependencies: Dependencies) => ({
  config: dependencies.config,
  authStore: dependencies.authStore
}))
@observer
export class Header extends React.Component<IHeaderProps> {
  componentWillMount() {
    const { authStore } = this.props;
    if (authStore.initialise && !authStore.userProfile) {
      authStore.loadProfile();
    }
  }

  login = () => {
    this.props.authStore.login();
  };

  logout = () => {
    this.props.authStore.logout();
  };

  render() {
    const { isAuthenticated, userProfile } = this.props.authStore;
    const location = this.props.location.pathname;

    return (
      <Menu
        stackable={true}
        borderless={true}
        className={classNames("selection", "list")}
      >
        <Container>
          <Menu.Item className="brand">
            <Link to="/">
              <Icon className="id badge start big" />
              SEEDY AUTH0
            </Link>
          </Menu.Item>

          {isAuthenticated &&
            leftLoggedInLinks.map(({ path, title }) => (
              <HeaderLink key={path} path={path} location={location}>
                {title}
              </HeaderLink>
            ))}

          <Menu.Menu position="right">
            {isAuthenticated ? (
              [
                <HeaderLink
                  key={profilePath}
                  path={profilePath}
                  location={location}
                >
                  {userProfile && (
                    <Image
                      key="profile-pic"
                      src={userProfile.picture}
                      avatar={true}
                    />
                  )}
                  <span>{profileTitle}</span>
                </HeaderLink>,
                <Menu.Item key="logout">
                  <Button as="a" className="item" onClick={this.logout}>
                    Log out
                  </Button>
                </Menu.Item>
              ]
            ) : (
              <Menu.Item key="login">
                <Button as="a" className="item" onClick={this.login}>
                  Log in
                </Button>
              </Menu.Item>
            )}
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}
