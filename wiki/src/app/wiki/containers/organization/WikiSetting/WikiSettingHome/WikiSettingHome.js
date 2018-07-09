import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Table, Spin, Popover, Tooltip, Icon } from 'choerodon-ui';
import { Page, Header, Content, stores, axios } from 'choerodon-front-boot';
import './WikiSettingHome.scss';
import CreateSpace from '../OperateWikiSetting/AddSpace';
import EditSpace from '../OperateWikiSetting/EditSpace';

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
      currentComponentId: record.id,
    });
  }

  loadComponents() {
    this.setState({
      loading: true, //需要加载数据时设true
    });
    axios.post('/wiki/v1/organizations/167/space/list_by_options')
      .then((res) => {
        this.setState({
          components: res.content,
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
          <i className={`icon icon-${icon}`} />
        ),
      },
      {
        title: '空间名称',
        dataIndex: 'name',
        // width: '200px',
      },
      {
        title: '空间地址',
        dataIndex: 'path',
        // width: '15%',
        render: path => (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={path}>
              <a href={path} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 0 }}>
                {path}
              </a>
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
        dataIndex: 'synchro',
        // width: '15%',
        render: synchro => (
          synchro ? "创建完成" : "创建中"
        ),
      },
      {
        title: '',
        dataIndex: 'id',
        // width: '10%',
        render: (id, record) => (
          <div>
            <Popover placement="bottom" mouseEnterDelay={0.5} content={<div><span>编辑</span></div>}>
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
          link="http://choerodon.io/zh/"
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
          {
            this.state.editComponentShow ? (
              <EditSpace
                id={this.state.currentComponentId}
                visible={this.state.editComponentShow}
                onCancel={() => this.setState({ editComponentShow: false })}
                onOk={() => {
                  this.loadComponents();
                  this.setState({
                    editComponentShow: false,
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
