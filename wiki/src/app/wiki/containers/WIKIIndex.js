import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { inject } from 'mobx-react';
import { asyncLocaleProvider, asyncRouter, nomatch } from 'choerodon-front-boot';
const OrganizationIndex = asyncRouter(() => import('./organization/hello'));
const ProjectIndex = asyncRouter(() => import('./project/hello'));


@inject('AppState')
class WIKIIndex extends React.Component {
    render() {
        const { match, AppState } = this.props;
        return (
            <Switch>
                <Route path={`${match.url}/organization/hello`} component={OrganizationIndex} />
                <Route path={`${match.url}/project/hello`} component={ProjectIndex} />
                <Route path={'*'} component={nomatch} />
            </Switch>
        );
    }
}

export default WIKIIndex;

