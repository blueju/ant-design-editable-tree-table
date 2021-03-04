import React from 'react';
import { Checkbox, Popconfirm, Table, Form, Button, Divider } from 'antd';

import styles from './EditableTreeTable.less';
import EditableCell from './EditableCell';

/**
 * 可编辑表格的上下文
 */
export const EditableTableContext = React.createContext({});

/**
 * 可编辑表格
 * @param dataSource  表格数据
 * @param onAdd       点击添加时的回调
 * @param onSave      点击保存时的回调
 * @param onDelete    点击删除时的回调
 */
class EditableTreeTable extends React.Component {
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
                <Button type="link" onClick={() => this.save(form, record.key)}>
                  保存
                </Button>
              )}
            </EditableTableContext.Consumer>
            <Divider type="vertical" />
            <Button type="link" onClick={() => this.cancel(record.key)}>
              取消
            </Button>
          </>
        ) : (
          <div className={styles.operationBtnGroup}>
            <Button
              type="link"
              disabled={editingKey !== ''}
              onClick={() => this.add(record.key)}
            >
              添加
            </Button>
            <Divider type="vertical" />
            <Button
              type="link"
              disabled={editingKey !== ''}
              onClick={() => this.edit(record.key)}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              title="确认删除?"
              onConfirm={() => this.deleteParam(record.key)}
              okText="是"
              cancelText="否"
            >
              <Button type="link" disabled={editingKey !== ''}>
                删除
              </Button>
            </Popconfirm>
          </div>
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

export default EditableTreeTable;
