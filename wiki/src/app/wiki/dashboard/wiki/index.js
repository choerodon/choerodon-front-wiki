import React, { Component } from 'react';
import {Spin, Icon, Tooltip } from 'choerodon-ui';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { DashBoardNavBar, stores, axios } from 'choerodon-front-boot';
import EmptyBlockDashboard from '../../components/EmptyBlockDashboard';
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
    axios.get(`/wiki/v1/projects/${AppState.currentMenuType.projectId}/space/under`)
      .then((res) => {
        this.setState({
          components: res.slice(0,6),
          loading: false,
        });
      });
  }

  renderSpaces(space) {
    return (
      <div className="list" key={space.id} >
        <div className="wiki-dashboard-space-icon">
          <Icon type={space.icon} />
        </div>
        <div className="spaceSummary-wrap">
          <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={space.name}>
            <a  href={space.path} target="_blank" className="spaceSummary text-overflow-hidden">
              {space.name}
            </a>
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
    if (components && !components.length) {
      return (
        <div className="loading-wrap">
          <EmptyBlockDashboard
            des="当前项目下没有创建wiki空间"
          />
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
    const { history } = this.props;
    const urlParams = AppState.currentMenuType;
    return (
      <div className="c7n-wiki-dashboard-under-organization-space">
        {this.renderContent()}
        <DashBoardNavBar>
        <Link
          role="none"
          to = {`/wiki/space?type=${urlParams.type}&id=${urlParams.id}&name=${encodeURIComponent(urlParams.name)}&organizationId=${urlParams.organizationId}`}
        >
          {'转至Wiki管理'}
        </Link>
      </DashBoardNavBar>
      </div>
    ); 
  }
}
