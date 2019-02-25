import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Form, Select, Input, Tooltip, Modal, Popover, IconSelect } from 'choerodon-ui';
import { stores, Content, axios} from 'choerodon-front-boot';
import './OperateSpace.scss';


const { Sidebar } = Modal;
const { AppState } = stores;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 100 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 10 },
  },
};
const inputWidth = 512;

class AddSpace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originUsers: [],
      selectLoading: false,
      createLoading: false,
    };
  }

  checkName = (rule, value, callback) => {
    const { intl } = this.props;
    axios.get(`/wiki/v1/organizations/${AppState.currentMenuType.organizationId}/space/check?name=${value}`)
      .then((res) => {
        if (res.failed) {
          callback(intl.formatMessage({ id: 'wiki.name.check.exist' }))
        } else {
          callback()
        }
      });
  }

  handleOk(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { intl } = this.props;
        const { icon, name, description } = values;
        const component = {
          icon,
          name,
          description
        };
        this.setState({ createLoading: true });
        axios.post(`/wiki/v1/organizations/${AppState.currentMenuType.organizationId}/space`, component)
          .then((datas) => {
            const res = this.handleProptError(datas);
            if(res){
            this.setState({
              createLoading: false,
            });
            this.props.onOk();
          } else {
            this.setState({
              createLoading: false,
            });
            this.props.onOk();
          }
          })
          .catch((error) => {
            this.setState({
              createLoading: false,
            });
            Choerodon.prompt(Choerodon.getMessage('创建空间失败!', 'Failed to create space!'));
          });
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    return (
      <Sidebar
        className="c7n-component-component"
        title={<FormattedMessage id={'wiki.create.space'} />}
        okText={<FormattedMessage id={'create'} />}
        cancelText={<FormattedMessage id={'cancel'} />}
        visible={this.props.visible || false}
        confirmLoading={this.state.createLoading}
        onOk={this.handleOk.bind(this)}
        onCancel={this.props.onCancel.bind(this)}
      >
        <Content
          style={{
            padding: 0,           
          }}
          title={`在组织"${AppState.currentMenuType.name}"中创建空间`} 
          description={<FormattedMessage id={'wiki.create.org.description'} />}
        >
          <Form style={{ width: 512 }}>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('icon', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: 'required' }),
                }],
                validateTrigger: 'onChange'
              })(
                <IconSelect
                  label={<FormattedMessage id={'wiki.space.icon'} />}
                  style={{ width: inputWidth }}
                />
                )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: intl.formatMessage({ id: 'required' }),
                }, {
                  validator: this.checkName,
                }]
              })(
                <Input label={<FormattedMessage id={'wiki.space.name'} />} maxLength={30} />,
              )}
            </FormItem>
          </Form>
        </Content>
      </Sidebar>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(AddSpace)));

