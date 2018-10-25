import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject } from 'mobx-react';
import { asyncLocaleProvider, asyncRouter, nomatch } from 'choerodon-front-boot';
const OrganizationWikiSetting = asyncRouter(() => import('./organization/WikiSetting'))
const ProjectWikiSetting = asyncRouter(() => import('./project/WikiSetting'))

@inject('AppState')
class WIKIIndex extends React.Component {
    render() {
        const { match, AppState } = this.props;
        const langauge = AppState.currentLanguage;
        const IntlProviderAsync = asyncLocaleProvider(langauge, () => import(`../locale/${langauge}`));
        return (
            <IntlProviderAsync>
            <Switch>
                <Route path={`${match.url}/space`} component={OrganizationWikiSetting} />
                <Route path={`${match.url}/space`} component={ProjectWikiSetting} />
                <Route path={'*'} component={nomatch} />
            </Switch>
            </IntlProviderAsync>
        );
    }
}

export default WIKIIndex;

