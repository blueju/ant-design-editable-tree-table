import React, { Component } from 'react';
import { render } from 'react-dom';
import EditableTreeTable from './EditableTreeTable';
import 'antd/dist/antd.css';
import './index.css';
import inputParam from './mock/inputParam';
import { v4 as uuidv4 } from 'uuid';

class App extends Component {
  constructor() {
    super();
    this.state = {
      dataSource: []
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        dataSource: inputParam
      });
    }, 500);
  }

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

  save = (newDataSource) => {
    this.setState({
      dataSource: newDataSource
    });
  };

  remove(key) {
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
          add={(key) => this.addChildParam(key)}
          save={(newDataSource) => this.save(newDataSource)}
          remove={(key) => this.remove(key)}
        />
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
