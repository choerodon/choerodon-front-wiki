import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Table, Spin,Form, Popover, Tooltip, Icon, Modal } from 'choerodon-ui';
import {Permission, Page, Header, Content, stores, axios } from 'choerodon-front-boot';
import './WikiSettingHome.scss'; 
import CreateSpace from '../OperateWikiSetting/AddSpace';
import EditSpace from '../OperateWikiSetting/EditSpace';

const { AppState } = stores;

@observer
class WikiSettingHome extends Component {
  constructor(props) {
    super(props);
    const Request = this.GetRequest(this.props.location.search);
    const { createSpace } = Request;
    this.state = {
      components: [],
      component: {},
      currentComponentId: undefined,
      loading: false,
      confirmShow: false,
      editComponentShow: false,
      createComponentShow: createSpace?true:false,
      openRemove: false, 
      syncProjectVisible: false,
      syncProjectLoading: false,
      syncUnderProjectVisible: false,
      syncUnderProjectLoading: false,
    };
  }

  GetRequest(url) {
    const theRequest = {};
    if (url.indexOf('?') !== -1) {
    const str = url.split('?')[1];
    const strs = str.split('&');
    for (let i = 0; i < strs.length; i += 1) {
    theRequest[strs[i].split('=')[0]] = decodeURI(strs[i].split('=')[1]);
    }
    }
    return theRequest;
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

  openRemove=(record)=> {
    this.setState({
      openRemove: true,
      currentComponentId: record.id,
    });
  }

  closeRemove = () => {
    this.setState({ openRemove: false });
  } 

  handleDelete = () => { 
    this.setState({
      confirmShow: true,
    });
    axios.delete(`/wiki/v1/projects/${AppState.currentMenuType.projectId}/space/${this.state.currentComponentId}`)
    .then((datas) => {
      const res = this.handleProptError(datas);
      if(res){
        this.setState({
          openRemove: false,
          confirmShow: false,
        });
        this.loadComponents();
      }
    });
  }

  handleProptError =(error) => {
    if (error && error.failed) {
      Choerodon.prompt(error.message);
      return false;
    } else { 
      return true;
    }
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

  syncProjectShowModal = () => {
    this.setState({
      syncProjectVisible: true,
    });
  }

  projectHandleOk = () => {
    this.setState({
      syncProjectLoading: true,
    });
    axios.get(`/wiki/v1/projects/${AppState.currentMenuType.projectId}/space/sync_project`)
    .then((datas) => {
      const res = this.handleProptError(datas);
      if(res){
        this.setState({
          syncProjectVisible: false,
          syncProjectLoading: false,
        });
        this.loadComponents();
      } else {
        this.setState({
          syncProjectVisible: false,
          syncProjectLoading: false,
        });
      }
    });
  }

  projectHandleCancel = () => {
    this.setState({
      syncProjectVisible: false,
    });
  }

  syncUnderProjectShowModal = (record) => {
    this.setState({
      syncUnderProjectVisible: true,
      currentComponentId: record.id,
    });
  }

  underProjectHandleOk = () => {
    this.setState({
      syncUnderProjectLoading: true,
    });
    axios.put(`/wiki/v1/projects/${AppState.currentMenuType.projectId}/space/sync/${this.state.currentComponentId}`)
    .then((datas) => {
      const res = this.handleProptError(datas);
      if(res){
        this.setState({
          syncUnderProjectVisible: false,
          syncUnderProjectLoading: false,
        });
      } else {
        this.setState({
          syncUnderProjectVisible: false,
          syncUnderProjectLoading: false,
        });
      }
      this.loadComponents();
    })
    .catch((error) => {
      this.setState({
        syncUnderOrgVisible: false,
        syncUnderOrgLoading: false,
      });
      Choerodon.prompt(Choerodon.getMessage('同步空间失败', 'Synchronization space failed'));
    });
  }

  underProjectHandleCancel = () => {
    this.setState({
      syncUnderProjectVisible: false,
    });
  }


  render() { 
    const menu = AppState.currentMenuType;
    const projectName = menu.name;
    const { type, id: projectId, organizationId: orgId } = menu;
    const column = [
      {
        title: <FormattedMessage id={'wiki.column.name'} />,
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => {
          return (
            <span><Icon type={record.icon} style={{ verticalAlign: 'text-bottom' }} /> {record.name}</span>
          );
        },
      },
      {
        title: <FormattedMessage id={'wiki.column.path'} />,
        key: 'path',
        // width: '15%',
        render: (test, record) => (
          <div style={{ width: '100%', overflow: 'hidden' }}>
            <Tooltip placement="topLeft" mouseEnterDelay={0.5} title={record.path}>
              <a href={record.path} target="_blank" style={{dispaly: record.status === 'success' ? 'block' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 0 }}>
              ../{this.getLastName(record.path)}
              </a>
            </Tooltip>
          </div>
        ),
      },
      {
        title: <FormattedMessage id={'wiki.column.status'} />,
        key: 'status',
        // width: '15%',
        render: (record) => {
          let statusDom = null;
          switch (record.status) {
            case 'operating':
              statusDom = (<div className="c7n-wiki-status c7n-wiki-status-operating">
                <div>{<FormattedMessage id={'operating'} />}</div>
              </div>);
              break;
            case 'success':
              statusDom = (<div className="c7n-wiki-status c7n-wiki-status-success">
                <div>{<FormattedMessage id={'success'} />}</div>
              </div>);
              break;
            case 'deleted':
              statusDom = (<div className="c7n-wiki-status c7n-wiki-status-deleted">
                <div>{<FormattedMessage id={'deleted'} />}</div>
              </div>);
              break; 
            case 'failed':
              statusDom = (<div className="c7n-wiki-status c7n-wiki-status-failed">
                <div>{<FormattedMessage id={'failed'} />}</div>
              </div>);
              break;
            default:
              statusDom = (<div className="c7n-wiki-status c7n-wiki-status-success">
                <div>{<FormattedMessage id={'success'} />}</div>
              </div>);
          }
          return (statusDom);
        },
      },
      {
        key: 'action',
        //width: '10%',
        render: (record) => {
          let editDom = null;
          let deletDom = null;
          let syncDom = null;
          let projectSyncDom = null;
          if (record.resourceType === 'project') {
            if (record.status === 'failed') {
              syncDom = (<React.Fragment>
                  {<Tooltip trigger="hover" placement="bottom" title={<FormattedMessage id={'retry'} />}>
                    <Button shape="circle" size={'small'} funcType="flat" onClick={this.syncProjectShowModal}>
                      <span className="icon icon-sync" />
                    </Button>
                  </Tooltip>}
              </React.Fragment>);
            }
          } else { 
            switch (record.status) {
              case 'operating':
                editDom = (<Tooltip trigger="hover" placement="bottom" title={<FormattedMessage id={'wiki.operating'} />}>
                  <Button shape="circle" size={'small'} funcType="flat">
                    <span className="icon icon-mode_edit c7n-app-icon-disabled" />
                  </Button>
                </Tooltip>);
                deletDom = (<Tooltip trigger="hover" placement="bottom" title={<FormattedMessage id={'wiki.operating'} />}>
                  <Button shape="circle" size={'small'} funcType="flat">
                    <span className="icon icon-delete_forever c7n-app-icon-disabled" />
                  </Button>
                </Tooltip>);
                break;
              case 'failed':
                projectSyncDom = (<React.Fragment>
                  {<Tooltip trigger="hover" placement="bottom" title={<FormattedMessage id={'retry'} />}>
                    <Button shape="circle" size={'small'} funcType="flat" onClick={this.syncUnderProjectShowModal.bind(this, record)}>
                      <span className="icon icon-sync" />
                    </Button>
                  </Tooltip>}
                </React.Fragment>);
                editDom = (<Tooltip trigger="hover" placement="bottom" title={<FormattedMessage id={'wiki.failed'} />}>
                  <Button shape="circle" size={'small'} funcType="flat">
                    <span className="icon icon-mode_edit c7n-app-icon-disabled" />
                  </Button>
                </Tooltip>);
                deletDom = (<React.Fragment>
                  {<Tooltip trigger="hover" placement="bottom" title={<FormattedMessage id={'delete'} />}>
                    <Button shape="circle" size={'small'} funcType="flat" onClick={this.openRemove.bind(this, record)}>
                      <span className="icon icon-delete_forever" />
                    </Button>
                  </Tooltip>}
                </React.Fragment>);
                break;
                case 'success':
                editDom = (<React.Fragment> 
                  {<Tooltip trigger="hover" placement="bottom" title={<FormattedMessage id={'editor'} />}>
                    <Button shape="circle" size={'small'} funcType="flat" onClick={this.showComponent.bind(this, record)}>
                      <span className="icon icon-mode_edit" />
                    </Button>
                  </Tooltip>}
                </React.Fragment>);
                deletDom = (<React.Fragment>
                  {<Tooltip trigger="hover" placement="bottom" title={<FormattedMessage id={'delete'} />}>
                    <Button shape="circle" size={'small'} funcType="flat" onClick={this.openRemove.bind(this, record)}>
                      <span className="icon icon-delete_forever" />
                    </Button>
                  </Tooltip>}
                </React.Fragment>);
                break;
            }
          }
          return (<div>
            <Permission
              service={['wiki-service.wiki-project-space.sync']}
              type={type}
              projectId={projectId}
              organizationId={orgId}
            >
              {projectSyncDom}
            </Permission>
            <Permission
              service={['wiki-service.wiki-scanning.syncProject']}
              type={type}
              projectId={projectId}
              organizationId={orgId}
            >
              {syncDom}
            </Permission>
            <Permission
              service={['wiki-service.wiki-project-space.update']}
              type={type}
              projectId={projectId}
              organizationId={orgId}
            >
              {editDom}
            </Permission>
            <Permission
              service={['wiki-service.wiki-project-space.delete']}
              type={type}
              projectId={projectId}
              organizationId={orgId}
            >
              {deletDom}
            </Permission>
          </div>);
      },
    }];
    return (
      <Page
       service={[
          'wiki-service.wiki-project-space.create',
          'wiki-service.wiki-project-space.pageByOptions',
          'wiki-service.wiki-project-space.query',
          'wiki-service.wiki-project-space.update',
          'wiki-service.wiki-project-space.checkName',
          'wiki-service.wiki-project-space.delete',
          'wiki-service.wiki-project-space.sync',
          'wiki-service.wiki-scanning.syncProject',
        ]}
        className="c7n-wiki"
       > 
        <Header title={<FormattedMessage id={'wiki.header.title'} />}>
        <Permission
              service={['wiki-service.wiki-project-space.create']}
              type={type}
              projectId={projectId} 
              organizationId={orgId}
            >
          <Button funcType="flat" onClick={() => this.setState({ createComponentShow: true })}>
            <Icon type="playlist_add icon" />
            <span><FormattedMessage id={'wiki.create.space'} /></span>
          </Button>
        </Permission>
        <Permission
              service={['wiki-service.wiki-project-space.pageByOptions']}
              type={type}
              projectId={projectId}
              organizationId={orgId}
            >
          <Button funcType="flat" onClick={() => this.loadComponents()}>
            <Icon type="autorenew icon" />
            <span><FormattedMessage id={'refresh'} /></span>
          </Button>
        </Permission>
        </Header>
        <Content code="wiki" value={<FormattedMessage id={'wiki.link'} />}
          title={<FormattedMessage id={'wiki.title'} />}
          description={<FormattedMessage id={'wiki.description'} />}
        >
          <Spin spinning={this.state.loading}>
            <Table
              columns={column}
              dataSource={this.state.components}
              scroll={{ x: true }}
              rowKey={record => record.id}
              defaultExpandAllRows={true}   
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
          <Modal
          closable={false}
          visible={this.state.openRemove}
          title={<FormattedMessage id={'wiki.delete.space'} />}
          footer={[
            <Button key="back" onClick={this.closeRemove}><FormattedMessage id={'cancel'} /></Button>,
            <Button key="submit" type="danger" loading={this.state.confirmShow}  onClick={this.handleDelete}>
              <FormattedMessage id={'delete'} />
            </Button>,
          ]}
          > 
          <p><FormattedMessage id={'wiki.delete.tooltip'} />？</p>
        </Modal>
        <Modal
          closable={false}
          title={<FormattedMessage id={'wiki.sync.space'} />}
          visible={this.state.syncProjectVisible}
          onOk={this.projectHandleOk}
          confirmLoading={this.state.syncProjectLoading}
          onCancel={this.projectHandleCancel}
        >
          <p><FormattedMessage id={'wiki.sync.project.tooltip'} />？</p>
        </Modal>
        <Modal
          closable={false}
          title={<FormattedMessage id={'wiki.sync.space'} />}
          visible={this.state.syncUnderProjectVisible}
          onOk={this.underProjectHandleOk}
          confirmLoading={this.state.syncUnderProjectLoading}
          onCancel={this.underProjectHandleCancel}
        >
          <p><FormattedMessage id={'wiki.sync.under.project.tooltip'} />？</p>
        </Modal>
        </Content>
      </Page>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(WikiSettingHome)));
