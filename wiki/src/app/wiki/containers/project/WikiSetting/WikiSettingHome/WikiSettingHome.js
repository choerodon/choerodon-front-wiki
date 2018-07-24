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
    window.console.log(AppState.currentMenuType);
  }

  showComponent(record) {
    this.setState({
      editComponentShow: true,
      currentComponentId: record.id,
    });
  }

  getLastName(path) {
    const arrlen = path.split('/');
    var backstr = "";
    for(var a=5;a<arrlen.length;a++){
      backstr = backstr+arrlen[a];
      if(a!=arrlen.length-1){
        backstr = backstr+"/";
      }
    }
    return backstr;
  }

  loadComponents() {
    this.setState({
      loading: true, //需要加载数据时设true
    });
    axios.post(`/wiki/v1/projects/${AppState.currentMenuType.projectId}/space/list_by_options?sort=id%2Cdesc`)
      .then((res) => {
        this.setState({
          components: res.content,
          loading: false,
        });
      })
      .catch((error) => {
        window.console.warn('load spaces failed, check your organization or project are correct, or please try again later');
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
        render: (path, record) => (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={path}>
              <a hidden={!record.synchro} href={path} target="_blank" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 0 }}>
              ../{this.getLastName(path)}
              </a>
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
              <Button
                disabled={!record.synchro}
                shape="circle"
                onClick={this.showComponent.bind(this, record)}
              >
                <Icon type="mode_edit" />
              </Button>
            </Popover>
          </div>
        ),
      },
    ];
    return (
      <Page className="c7n-wiki">
        <Header title="Wiki管理">
          {/*<Button funcTyp="flat" onClick={() => this.syncInfo()}>
            <Icon type="autorenew icon" />
            <span>同步信息</span>
          </Button>*/}
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
          title={`Wiki简介`}
          description="Wiki是为项目和组织提供知识管理和共享的平台。"
          link="http://v0-8.choerodon.io/zh/docs/user-guide/wiki/space/create-space/"
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
