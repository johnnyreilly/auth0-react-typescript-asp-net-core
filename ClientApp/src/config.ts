export interface IEnv {
    AUTH0_DOMAIN: string;
    AUTH0_CLIENT_ID: string;
    AUTH0_AUDIENCE: string;
    AUTH0_REDIRECT_URI: string;
    API_BASE_URI: string;
    NODE_ENV: string;
}

export interface IAuth0Config {
    domain: string;
    clientId: string;
    audience: string;
    redirectUri: string;
}

export class Config {
    auth0Config: IAuth0Config;
    apiBaseUri: string;
    development: boolean;

    constructor(env: IEnv) {
        this.auth0Config = {
            domain: env.AUTH0_DOMAIN,
            clientId: env.AUTH0_CLIENT_ID,
            audience: env.AUTH0_AUDIENCE,
            redirectUri: env.AUTH0_REDIRECT_URI,
        };
        this.apiBaseUri = env.API_BASE_URI;
        this.development = env.NODE_ENV !== 'production';
    }
}