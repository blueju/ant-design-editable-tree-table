import React from 'react';
import { Row, Col, Button } from 'antd';

import dataSource from '../../mock/list';
import EditableTreeTable from './EditableTreeTable';

export default class IndexPage extends React.Component {
  state = {
    dataSource: [],
  };

  componentDidMount() {
    this.setState({
      dataSource,
    });
  }

  /**
   * 点击<添加>按钮后的回调
   */
  onAdd() {
    console.log('点击添加按钮时的回调');
  }

  /**
   * 点击<保存>按钮后的回调
   * @param newDataSource 保存后的新表格数据
   */
  onSave(newDataSource) {
    console.log(newDataSource);
  }

  /**
   * 点击确认<删除>按钮后的回调
   * @param key 所删除行的key
   */
  onDelete(key) {
    console.log(key);
  }

  render() {
    return (
      <div style={{ padding: 10 }}>
        <Row>
          <Col>
            <Button type="primary" style={{ marginBottom: 10 }}>
              添加
            </Button>
          </Col>
        </Row>
        <EditableTreeTable
          dataSource={this.state.dataSource}
          onAdd={this.onAdd}
          onSave={this.onSave}
          onDelete={this.onDelete}
        />
      </div>
    );
  }
}
