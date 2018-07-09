import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Table, Spin, Popover, Tooltip, Icon } from 'choerodon-ui';
import { Page, Header, Content, stores, Permission, axios } from 'choerodon-front-boot';
import './WikiSettingHome.scss';
import CreateSpace from '../OperateWikiSetting/AddSpace';
// import EditComponent from '../ComponentComponent/EditComponent';

const { AppState } = stores;

@observer
class WikiSettingHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: [],
      component: {},
      currentComponentId: undefined,
      loading: false,
      confirmShow: false,
      editComponentShow: false,
      createComponentShow: false,
    };
  }

  syncInfo() {
    axios.post("syncInfoUrl")
      .then((res) => {
        //正在同步或者同步成功
      })
      .catch((error) => {
        window.console.warn('Sync userInfo failed! ');
      });
  }

  componentDidMount() {
    this.loadComponents();
  }

  showComponent(record) {
    this.setState({
      editComponentShow: true,
      currentComponentId: record.componentId,
    });
  }

  loadComponents() {
    this.setState({
      loading: false, //需要加载数据时设true
    });
    axios.get('spacesUrl')
      .then((res) => {
        this.setState({
          components: res,
          loading: false,
        });
      })
      .catch((error) => {
        window.console.warn('load spaces failed, check your organization and project are correct, or please try again later');
      });
  }

  render() {
    const column = [
      {
        title: '空间图标',
        dataIndex: 'icon',
        width: '100px',
        render: icon => (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={icon}>
              <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 0 }}>
                {icon}
              </p>
            </Tooltip>
          </div>
        ),
      },
      {
        title: '空间名称',
        dataIndex: 'name',
        // width: '200px',
        render: (issueCount, record) => (
          <div
            style={{ width: '100%', overflow: 'hidden', display: 'flex', alignItems: 'center', cursor: 'pointer', color: '#3f51b5' }}
            role="none"
            onClick={() => {
              this.props.history.push(`/agile/issue?type=${urlParams.type}&id=${urlParams.id}&name=${urlParams.name}&organizationId=${urlParams.organizationId}&paramType=component&paramId=${record.componentId}&paramName=${record.name}`);
            }}
          >
            <span style={{ display: 'inline-block', width: 25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'center' }}>{issueCount}</span>
            <span>issues</span>
          </div>
        ),
      },
      {
        title: '空间地址',
        dataIndex: 'address',
        // width: '15%',
        render: (managerId, record) => (
          <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={record.managerName}>
              <div>
                {/* <UserHead
                  user={{
                    id: record.managerId,
                    loginName: '',
                    realName: record.managerName,
                    avatar: record.imageUrl,
                  }}
                /> */}
              </div>
            </Tooltip>
          </div>
        ),
      },
      {
        title: '空间描述',
        dataIndex: 'description',
        // width: '30%',
        render: description => (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={description}>
              <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 0 }}>
                {description}
              </p>
            </Tooltip>
          </div>
        ),
      },
      {
        title: '状态',
        dataIndex: 'status',
        // width: '15%',
      },
      {
        title: '',
        dataIndex: 'edit',
        // width: '10%',
        render: (componentId, record) => (
          <div>

            <Popover placement="bottom" mouseEnterDelay={0.5} content={<div><span>详情</span></div>}>
              <Button shape="circle" onClick={this.showComponent.bind(this, record)}>
                <Icon type="mode_edit" />
              </Button>
            </Popover>

          </div>
        ),
      },
    ];
    return (
      <Page className="c7n-wiki">
        <Header title="wiki管理">
          <Button funcTyp="flat" onClick={() => this.syncInfo()}>
            <Icon type="autorenew icon" />
            <span>同步信息</span>
          </Button>
          <Button funcTyp="flat" onClick={() => this.setState({ createComponentShow: true })}>
            <Icon type="playlist_add icon" />
            <span>创建空间</span>
          </Button>
          <Button funcTyp="flat" onClick={() => this.loadComponents()}>
            <Icon type="autorenew icon" />
            <span>刷新</span>
          </Button>
        </Header>
        <Content
          title={`wiki简介`}
          description="wiki是为项目和组织提供知识管理和共享的平台。"
          link="http://v0-7.choerodon.io/zh/docs/user-guide/agile/component/"
        >
          <Spin spinning={this.state.loading}>
            <Table
              columns={column}
              dataSource={this.state.components}
              scroll={{ x: true }}
            />
          </Spin>
          {
            this.state.createComponentShow ? (
              <CreateSpace
                visible={this.state.createComponentShow}
                onCancel={() => this.setState({ createComponentShow: false })}
                onOk={() => {
                  this.loadComponents();
                  this.setState({
                    createComponentShow: false,
                  });
                }}
              />
            ) : null
          }
        </Content>
      </Page>
    );
  }
}

export default WikiSettingHome;
