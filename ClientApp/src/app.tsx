import { inject, observer } from "mobx-react";
import DevTools from "mobx-react-devtools";
import * as React from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from "react-router-dom";
import { Callback, callbackPath } from "./components/callback";
import { HomePage, homePath } from "./components/features/home";
import { PingPage, pingPath } from "./components/features/ping";
import { ProfilePage, profilePath } from "./components/features/profile";
import { Header } from "./components/layout/header";
import { Config } from "./config";
import { Dependencies } from "./dependencies";
import { AuthStore } from "./dependencies/stores/authStore";

const loggedInRoutes = [
  { path: profilePath, component: ProfilePage },
  { path: pingPath, component: PingPage }
];

interface IProps extends RouteComponentProps<{}> {
  config?: Config;
  authStore?: AuthStore;
}

@inject((dependencies: Dependencies) => ({
  config: dependencies.config,
  authStore: dependencies.authStore
}))
@observer
export class AppRaw extends React.Component<IProps> {
  renderRoute = (
    path: string,
    component:
      | React.ComponentType<RouteComponentProps<any>>
      | React.ComponentType<any>
  ) => <Route key={path} path={path} exact={true} component={component} />;

  render() {
    const { config, authStore } = this.props;
    const isAuthenticated = authStore.isAuthenticated;
    return (
      <div>
        <Route path="/" component={Header} />
        <Route path={callbackPath} exact={true} component={Callback} />
        <Switch>
          <Route path={homePath} exact={true} component={HomePage} />
          {isAuthenticated
            ? loggedInRoutes.map(({ path, component }) =>
                this.renderRoute(path, component)
              )
            : null}
          <Redirect key="redirect" to={homePath} />
        </Switch>
        {config.development ? <DevTools /> : null}
      </div>
    );
  }
}

export const App = withRouter(AppRaw);
