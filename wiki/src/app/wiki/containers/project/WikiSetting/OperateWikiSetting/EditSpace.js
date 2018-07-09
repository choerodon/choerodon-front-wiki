import React, { Component } from 'react';
import { Modal, Form, Input, Select, message, IconSelect } from 'choerodon-ui';
import { Content, stores, axios } from 'choerodon-front-boot';
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
      description: undefined,
      managerId: undefined,
      name: undefined,
    };
  }

  componentDidMount() {
    this.loadComponent(this.props.id);
  }

  loadComponent(componentId) {
    // loadComponent(componentId)
    axios.get("url")
      .then((res) => {
        const { icon, description, path, name } = res;
        this.setState({
          icon,
          description,
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
        const { defaultAssigneeRole, description, managerId, name } = values;
        const component = {
          objectVersionNumber: this.state.component.objectVersionNumber,
          componentId: this.state.component.componentId,
          defaultAssigneeRole,
          description,
          managerId: managerId ? JSON.parse(managerId).id || 0 : 0,
          name,
        };
        this.setState({ createLoading: true });
        updateComponent(component.componentId, component)
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
            message.error('修改空间失败');
          });
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Sidebar
        title="查看空间"
        okText="修改"
        cancelText="取消"
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
          title={`在项目"${AppState.currentMenuType.name}"中查看空间`}
          description="你可以修改空间的图标和描述。"
        >
          <Form>
            <FormItem
              {...formItemLayout}
            >
              {getFieldDecorator('icon', {
                initialValue: this.state.icon,
                rules: [{
                  required: true,
                  message: '空间图标必填'
                }],
                validateTrigger: 'onChange'
              })(
                <IconSelect
                  label="空间图标"
                  style={{ width: inputWidth }}
                />
                )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('name', {
                initialValue: this.state.name
              })(
                <Input disabled label="空间名称" />,
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('description', {
                initialValue: this.state.description,
              })(
                <TextArea label="空间描述" autosize maxLength={150} />,
              )}
            </FormItem>
          </Form>
        </Content>
      </Sidebar>
    );
  }
}

export default Form.create()(EditSpace);
