import React from 'react';
import { Checkbox, Form, Input } from 'antd';
import { EditableContext } from './EditableTreeTable';

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'checkbox') {
      return <Checkbox />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `请输入 ${title}!`
                }
              ],
              initialValue: record[dataIndex],
              valuePropName: inputType === 'checkbox' ? 'checked' : 'value'
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

export default EditableCell;
