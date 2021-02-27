import React from 'react';
import { Checkbox, Popconfirm, Table, Form } from 'antd';

import EditableCell from './EditableCell';

/**
 * 可编辑表格的上下文
 */
export const EditableTableContext = React.createContext();

/**
 * 可编辑表格
 */
class EditableTable extends React.Component {
  state = {
    data: [],
    // 正在编辑的行的key
    editingKey: '',
  };
  // 表格列属性
  columns = [
    {
      title: '名称',
      dataIndex: 'name',
      width: '16.6%',
      editable: true,
    },
    {
      title: '类型',
      dataIndex: 'type',
      editable: true,
      width: '16.6%',
    },
    {
      title: '必填',
      dataIndex: 'required',
      editable: true,
      width: '16.6%',
      render: (text, record) => {
        return <Checkbox defaultChecked={record.required} disabled />;
      },
    },
    {
      title: '默认值',
      dataIndex: 'defaultValue',
      editable: true,
      width: '16.6%',
    },
    {
      title: '描述',
      dataIndex: 'description',
      editable: true,
      width: '16.6%',
    },
    {
      title: '操作',
      width: 250,
      dataIndex: 'operation',
      render: (text, record) => {
        const { editingKey } = this.state;
        const editable = this.isEditing(record);
        return editable ? (
          <>
            <EditableTableContext.Consumer>
              {(form) => (
                <a
                  onClick={() => this.save(form, record.key)}
                  style={{ marginRight: 8 }}
                >
                  保存
                </a>
              )}
            </EditableTableContext.Consumer>
            <a onClick={() => this.cancel(record.key)}>取消</a>
          </>
        ) : (
          <>
            <a
              disabled={editingKey !== ''}
              onClick={() => this.add(record.key)}
            >
              新增子级参数
            </a>
            &emsp;
            <a
              disabled={editingKey !== ''}
              onClick={() => this.edit(record.key)}
            >
              编辑
            </a>
            &emsp;
            <Popconfirm
              title="确认删除?"
              onConfirm={() => this.deleteParam(record.key)}
              okText="是"
              cancelText="否"
            >
              <a disabled={editingKey !== ''}>删除</a>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  /**
   * 是否处于编辑状态
   * 通过对比当前行key与正在编辑行key是否相等
   * @param record 当前行数据
   * @returns {boolean}
   */
  isEditing = (record) => record.key === this.state.editingKey;

  // 取消（编辑）
  cancel = () => {
    this.setState({ editingKey: '' });
  };

  // 保存（正在编辑的数据）
  save(form, key) {
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.props.dataSource];
      const updateTreeTable = function (data, key, row) {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            data[i] = { ...data[i], ...row };
            break;
          } else if (data[i].hasOwnProperty('children')) {
            updateTreeTable(data[i].children, key, row);
          }
        }
      };
      updateTreeTable(newData, key, row);
      this.setState({ data: newData, editingKey: '' });
      this.props.onSave(newData);
    });
  }

  add(key) {
    this.props.onAdd(key);
  }

  /**
   * 编辑
   * @param {*} key
   */
  edit(key) {
    console.log(key);
    this.setState({ editingKey: key });
  }

  // 删除（参数）
  deleteParam(key) {
    this.props.onDelete(key);
  }

  render() {
    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          inputType: col.dataIndex === 'required' ? 'checkbox' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <EditableTableContext.Provider value={this.props.form}>
        <Form>
          <Table
            // 表格行 key
            rowKey={(record, index) => {
              if (this.props.rowKey) {
                return this.props.rowKey;
              } else {
                return index;
              }
            }}
            // 覆盖默认的 table tbody cell 元素
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            // 边框
            bordered
            // 数据
            dataSource={this.props.dataSource}
            // 列
            columns={columns}
            // 树形表格没必要分页
            pagination={false}
          />
        </Form>
      </EditableTableContext.Provider>
    );
  }
}

export default EditableTable;
