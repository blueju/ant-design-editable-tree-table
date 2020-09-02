import 'antd/dist/antd.css';
import React, { Component } from 'react';
import { render } from 'react-dom';
import { v4 as uuidv4 } from 'uuid';
import EditableTreeTable from './EditableTreeTable';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    };
  }

  componentDidMount() {
    fetch('//localhost:8090/list')
      .then((res) => {
        return res.json();
      })
      .then((resJson) => {
        this.setState({
          dataSource: resJson
        });
      });
  }

  // 新增子级参数
  addChildParam(key) {
    const unifyHandle = (key, source) => {
      function Param() {
        this.key = uuidv4();
        this.name = Math.random().toString(16).slice(2, 8);
        this.type = 'string';
        this.required = true;
        this.defaultValue = '';
        this.description = '';
      }
      for (const item of source) {
        if (item.key === key) {
          if (item.hasOwnProperty('children')) {
            item.children.push(new Param());
          } else {
            item.children = [];
            item.children.push(new Param());
          }
        }
        if (item.hasOwnProperty('children')) {
          unifyHandle(key, item.children);
        }
      }
    };
    unifyHandle(key, this.state.dataSource);
    this.setState({
      dataSource: this.state.dataSource
    });
  }

  // 保存（参数）
  saveParam = (newDataSource) => {
    this.setState({
      dataSource: newDataSource
    });
  };

  // 删除（参数）
  deleteParam(key) {
    const unifyHandle = (key, source) => {
      for (let i = 0; i < source.length; i++) {
        const item = source[i];
        if (item.key === key) {
          source.splice(i, 1);
          return;
        }
        if (item.hasOwnProperty('children')) {
          unifyHandle(key, item.children);
        }
      }
    };
    unifyHandle(key, this.state.dataSource);
    this.setState({
      dataSource: this.state.dataSource
    });
  }

  render() {
    return (
      <div>
        <EditableTreeTable
          dataSource={this.state.dataSource}
          onAdd={(key) => this.addChildParam(key)}
          onSave={(newDataSource) => this.saveParam(newDataSource)}
          onDelete={(key) => this.deleteParam(key)}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
