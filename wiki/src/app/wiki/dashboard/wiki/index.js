import React, { Component } from 'react';
import { Icon } from 'choerodon-ui';
import { DashBoardNavBar } from 'choerodon-front-boot';
import { FormattedMessage } from 'react-intl';
import './index.scss';

export default class Announcement extends Component {
  render() {
    return (
      <div className="c7n-iam-dashboard-announcement">
        <ul>
          <li>
            <Icon type="document" />
            <a target="choerodon" href="http://choerodon.io/zh/docs/user-guide/wiki/">
              {Choerodon.getMessage('wiki开发知识总结', 'wiki development knowledge summary')}
            </a>
          </li>
          <li>
            <Icon type="branch" />
            <a target="choerodon" href="http://choerodon.io/zh/docs/user-guide/wiki/">
              {Choerodon.getMessage('wiki系统测试页面', 'wiki system test page')}
            </a>
          </li>
          <li>
            <Icon type="directions_run" />
            <a target="choerodon" href="http://choerodon.io/zh/docs/user-guide/wiki/">
              {Choerodon.getMessage('XWiki使用技巧总结', 'XWiki uses tips summary')}
            </a>
          </li>
          <li>
            <Icon type="application_model" />
            <a target="choerodon" href="http://choerodon.io/zh/docs/user-guide/wiki/">
              {Choerodon.getMessage('知识管理其他知识总结', 'knowledge management other knowledge summary')}
            </a>
          </li>
          <li>
            <Icon type="domain" />
            <a target="choerodon" href="http://choerodon.io/zh/docs/user-guide/wiki/">
              {Choerodon.getMessage('需求与设计', 'requirements and design')}
            </a>
          </li>
        </ul>
        <DashBoardNavBar>
          <a target="choerodon" href="http://choerodon.io/zh/docs/user-guide/wiki/">{Choerodon.getMessage('转至Wiki管理', 'go to Wiki management')}</a>
        </DashBoardNavBar>
      </div>
    );
  }
}
