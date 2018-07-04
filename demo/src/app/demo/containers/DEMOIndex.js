import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject } from 'mobx-react';
import { asyncLocaleProvider, asyncRouter, nomatch } from 'choerodon-front-boot';
const HelloIndex = asyncRouter(() => import('./organization/hello'));

@inject('AppState')
class DEMOIndex extends React.Component {
    render() {
        const { match, AppState } = this.props;
        return (
            <Switch>
                <Route path={`${match.url}/hello`} component={HelloIndex} />
                <Route path={'*'} component={nomatch} />
            </Switch>
        );
    }
}

export default DEMOIndex;

