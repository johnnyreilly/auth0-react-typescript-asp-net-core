import { Auth0UserProfile, WebAuth } from 'auth0-js';
import { action, computed, observable, runInAction } from 'mobx';
import { IAuth0Config } from '../../config';
import { StorageFacade } from '../storageFacade';

interface IStorageToken {
  accessToken: string;
  idToken: string;
  expiresAt: number;
}

const STORAGE_TOKEN = 'storage_token';

export class AuthStore {
  @observable.ref auth0: WebAuth;
  @observable.ref userProfile: Auth0UserProfile;
  @observable.ref token: IStorageToken;

  constructor(config: IAuth0Config, private storage: StorageFacade) {
    this.auth0 = new WebAuth({
      domain: config.domain,
      clientID: config.clientId,
      redirectUri: config.redirectUri,
      audience: config.audience,
      responseType: 'token id_token',
      scope: 'openid email profile do:admin:thing' // the do:admin:thing scope is custom and defined in the scopes section of our API in the Auth0 dashboard
    });
  }

  initialise() {
    const token = this.parseToken(this.storage.getItem(STORAGE_TOKEN));
    if (token) {
      this.setSession(token);
    }
    this.storage.addEventListener(this.onStorageChanged);
  }

  parseToken(tokenString: string) {
    const token = JSON.parse(tokenString || '{}');
    return token;
  }

  onStorageChanged = (event: StorageEvent) => {
    if (event.key === STORAGE_TOKEN) {
      this.setSession(this.parseToken(event.newValue));
    }
  }

  @computed get isAuthenticated() {
    // Check whether the current time is past the 
    // access token's expiry time
    return this.token && new Date().getTime() < this.token.expiresAt;
  }

  login = () => {
    this.auth0.authorize();
  }

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        const token = {
          accessToken: authResult.accessToken,
          idToken: authResult.idToken,
          // Set the time that the access token will expire at
          expiresAt: authResult.expiresIn * 1000 + new Date().getTime()
        };

        this.setSession(token);
      } else if (err) {
        // tslint:disable-next-line:no-console
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  @action
  setSession(token: IStorageToken) {
    this.token = token;
    this.storage.setItem(STORAGE_TOKEN, JSON.stringify(token));
  }

  getAccessToken = () => {
    const accessToken = this.token.accessToken;
    if (!accessToken) {
      throw new Error('No access token found');
    }
    return accessToken;
  }

  @action
  loadProfile = async () => {
    const accessToken = this.getAccessToken();
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (err) { throw err; }

      if (profile) {
        runInAction(() => this.userProfile = profile);
        return profile;
      }

      return undefined;
    });
  }

  @action
  logout = () => {
    // Clear access token and ID token from local storage
    this.storage.removeItem(STORAGE_TOKEN);
    
    this.token = null;
    this.userProfile = null;
  }
}