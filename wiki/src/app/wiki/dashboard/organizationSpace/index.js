import React, { Component } from 'react';
import {Spin, Icon, Tooltip } from 'choerodon-ui';
import { DashBoardNavBar } from 'choerodon-front-boot';
import { FormattedMessage } from 'react-intl';
import './index.scss';

const { AppState } = stores;

export default class Announcement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    this.setState({ loading: true });
    axios.get(`/wiki/v1/organizations/${AppState.currentMenuType.organizationId}/space/under`)
      .then((res) => {
        this.setState({
          components: res,
          loading: false,
        });
      });
  }

  renderSpaces(space) {
    return (
      <div className="list" key={space.id}>
        <div className="spaceSummary-wrap">
          <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={space.name}>
            <p className="spaceSummary text-overflow-hidden">
              {space.name}
            </p>
          </Tooltip>
        </div>
      </div>
    );
  }

  renderContent() {
    const { loading, components } = this.state;
    if (loading) {
      return (
        <div className="loading-wrap">
          <Spin />
        </div>
      );
    }
    return (
      <div className="lists">
        {
          components.map(space => this.renderSpaces(space))
        }
      </div>
    );
  }

  render() {
    const { components } = this.state;
    return (
      <div className="c7n-wiki-dashboard-under-organization-space">
        {this.renderContent()}
        <DashBoardNavBar>
          <a target="choerodon" href="http://choerodon.io/zh/docs/user-guide/wiki/">{Choerodon.getMessage('转至Wiki管理', 'go to Wiki management')}</a>
        </DashBoardNavBar>
      </div>
    );
  }
}
