import React from 'react';
import { Row, Col, Button } from 'antd';

// dataSource's mock
import dataSourceMock from '../../mock/dataSourceMock';
import EditableTreeTable from './EditableTreeTable';

export default class IndexPage extends React.Component {
  state = {
    // 表格数据
    dataSource: [],
  };

  componentDidMount() {
    this.setState({
      dataSource: dataSourceMock,
    });
  }

  /**
   * 处理添加逻辑
   */
  handleAdd = () => {
    console.log('处理添加逻辑');
  };

  /**
   * 点击添加时的回调
   * @param {string} key
   */
  onAddCallback = (key) => {
    console.log('点击添加时的回调');
  };

  /**
   * 点击保存时的回调
   * @param {array} newDataSource
   */
  onSaveCallback = (newDataSource) => {
    console.log('点击保存时的回调');
  };

  /**
   * 点击删除时的回调
   * @param {string} key
   */
  onDeleteCallback = (key) => {
    console.log('点击删除时的回调');
  };

  render() {
    return (
      <div style={{ padding: 10 }}>
        <Row>
          <Col>
            <Button
              type="primary"
              style={{ marginBottom: 10 }}
              onClick={this.handleAdd}
            >
              添加
            </Button>
          </Col>
        </Row>
        <EditableTreeTable
          dataSource={this.state.dataSource}
          onAdd={this.onAddCallback}
          onSave={this.onSaveCallback}
          onDelete={this.onDeleteCallback}
        />
      </div>
    );
  }
}
