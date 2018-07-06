import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { asyncRouter, nomatch } from 'choerodon-front-boot';

const WikiSettingHome = asyncRouter(() => import('./WikiSettingHome'));

const WikiSettingIndex = ({ match }) => (
  <Switch>
    <Route exact path={match.url} component={WikiSettingHome} />
    <Route path={'*'} component={nomatch} />
  </Switch>
);

export default WikiSettingIndex;
