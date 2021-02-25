import React from 'react';
import { Checkbox, Form, Input } from 'antd';

import { EditableTableContext } from './EditableTreeTable';

/**
 * 可编辑单元格
 */
class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'checkbox') {
      return <Checkbox />;
    }
    return <Input />;
  };

  /**
   * 渲染单元格
   */
  renderCell = () => {
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
          <Form.Item
            initialValue={record[dataIndex]}
            valuePropName={inputType === 'checkbox' ? 'checked' : 'value'}
            rules={[
              {
                required: true,
                message: `请输入 ${title}!`,
              },
            ]}
          >
            {this.getInput()}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return (
      <EditableTableContext.Consumer>
        {this.renderCell}
      </EditableTableContext.Consumer>
    );
  }
}

export default EditableCell;
