import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Form, Select, Input, Tooltip, Modal, Popover, IconSelect } from 'choerodon-ui';
import { stores, Content, axios} from 'choerodon-front-boot';
import './OperateSpace.scss';

const { Sidebar } = Modal;
const { TextArea } = Input;
const { Option } = Select;
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

class EditSpace extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originUsers: [],
      selectLoading: false,
      createLoading: false,

      component: {},
      defaultAssigneeRole: undefined,
      managerId: undefined,
      name: undefined,
    };
  }

  componentDidMount() {
    this.loadComponent(this.props.id);
  }

  loadComponent(componentId) {
    // loadComponent(componentId)
    axios.get(`/wiki/v1/organizations/${AppState.currentMenuType.organizationId}/space/${componentId}`)
      .then((res) => {
        const { icon, path, name } = res;
        this.setState({
          icon,
          path,
          name,
          component: res,
        });
      });
  }

  handleOk(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { intl } = this.props;
        const { icon, name } = values;
        const component = {
          objectVersionNumber: this.state.component.objectVersionNumber,
          id: this.props.id,
          name,
          icon
        };
        this.setState({ createLoading: true });
        axios.put(`/wiki/v1/organizations/${AppState.currentMenuType.organizationId}/space/${component.id}`, component)
          .then((res) => {
            this.setState({
              createLoading: false,
            });
            this.props.onOk();
          })
          .catch((error) => {
            this.setState({
              createLoading: false,
            });
            message.error(intl.formatMessage({ id: 'wiki.edit.space.error' }));
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { intl } = this.props;
    return (
      <Sidebar
        title={<FormattedMessage id={'wiki.see.space'} />}
        okText={<FormattedMessage id={'edit'} />}
        cancelText={<FormattedMessage id={'cancel'} />}
        visible={this.props.visible || false}
        confirmLoading={this.state.createLoading}
        onOk={this.handleOk.bind(this)}
        onCancel={this.props.onCancel.bind(this)}
      >
        <Content
          style={{
            padding: 0,
            width: 512,
          }}
          title={`在组织"${AppState.currentMenuType.name}"中查看空间`}
          description={<FormattedMessage id={'wiki.eidt.description'} />}
        >
          <Form>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('icon', {
                initialValue: this.state.icon,
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
                initialValue: this.state.name
              })(
                <Input disabled label={<FormattedMessage id={'wiki.space.name'} />}/>,
              )}
            </FormItem>
          </Form>
        </Content>
      </Sidebar>
    );
  }
}

export default Form.create({})(withRouter(injectIntl(EditSpace)));
