import { Checkbox, Form, Popconfirm, Table } from 'antd';
import React from 'react';
import EditableCell from './EditableCell';

export const EditableContext = React.createContext();

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      // 正在编辑的行的key
      editingKey: ''
    };
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        editable: true
      },
      {
        title: '类型',
        dataIndex: 'type',
        editable: true
      },
      {
        title: '必填',
        dataIndex: 'required',
        editable: true,
        render: (text, record, index) => {
          return <Checkbox defaultChecked={record.required} disabled />;
        }
      },
      {
        title: '默认值',
        dataIndex: 'defaultValue',
        editable: true
      },
      {
        title: '描述',
        dataIndex: 'description',
        editable: true
      },
      {
        title: '操作',
        width: 250,
        dataIndex: 'operation',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {(form) => (
                  <a onClick={() => this.save(form, record.key)} style={{ marginRight: 8 }}>
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <a onClick={() => this.cancel(record.key)}>取消</a>
            </span>
          ) : (
            <div>
              <a disabled={editingKey !== ''} onClick={() => this.add(record.key)}>
                新增子级参数
              </a>
              &emsp;
              <a disabled={editingKey !== ''} onClick={() => this.edit(record.key)}>
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
            </div>
          );
        }
      }
    ];
  }

  // 通过对比当前行key与正在编辑行key是否相等，在遍历渲染时判断当前行是否需要禁用
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

  edit(key) {
    this.setState({ editingKey: key });
  }

  // 删除（参数）
  deleteParam(key) {
    this.props.onDelete(key);
  }

  render() {
    const components = {
      body: {
        cell: EditableCell
      }
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
          editing: this.isEditing(record)
        })
      };
    });

    return (
      <EditableContext.Provider value={this.props.form}>
        <Table
          rowKey={(record) => record.key}
          components={components}
          bordered
          dataSource={this.props.dataSource}
          columns={columns}
          rowClassName="editable-row"
          pagination={false}
          defaultExpandAllRows={true}
          size="middle"
        />
      </EditableContext.Provider>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable;
