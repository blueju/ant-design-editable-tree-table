import React from 'react';
import { Form, Input } from 'antd';

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
      // 是否处于正在编辑的状态
      editing,
      // 列名
      dataIndex,
      // 行数据
      record,
      // 子元素
      children,
    } = this.props;
    if (editing) {
      /**
       * 单元格初始值
       * record[dataIndex] 这么写比较动态，即使列名换了也能取到值
       */
      const initialValue = record[dataIndex];
      return (
        <td>
          <Form.Item
            name={dataIndex}
            initialValue={initialValue}
            style={{ marginBottom: 0 }}
          >
            <Input />
          </Form.Item>
        </td>
      );
    } else {
      return <td>{children}</td>;
    }
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
