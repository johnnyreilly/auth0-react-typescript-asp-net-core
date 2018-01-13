import * as mobx from 'mobx';
import { Config } from '../config';
import { StorageFacade } from './storageFacade';
import { AuthStore } from './stores/authStore';

mobx.useStrict(true); // Use to prevent mysterious issues creeping in https://github.com/mobxjs/mobx/blob/gh-pages/docs/refguide/api.md#usestrict

export class Dependencies {
    authStore: AuthStore;

    constructor(
        public config: Config,
        public storage: StorageFacade
    ) {
        this.authStore = new AuthStore(config.auth0Config, storage);
    }
}
