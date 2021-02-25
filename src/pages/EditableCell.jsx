import React from 'react';
import { Checkbox, Form, Input } from 'antd';

import { EditableTableContext } from './EditableTreeTable';

/**
 * 可编辑单元格
 */
class EditableCell extends React.Component {
  /**
   * 渲染单元格
   */
  renderCell = () => {
    const {
      editing,
      dataIndex,
      title,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    debugger;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item initialValue={record[dataIndex]}>
            <Input />
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
