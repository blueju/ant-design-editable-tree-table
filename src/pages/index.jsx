import React from 'react';

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

  render() {
    return (
      <EditableTreeTable
        dataSource={this.state.dataSource}
        onAdd={(key) => this.addChildParam(key)}
        onSave={(newDataSource) => this.saveParam(newDataSource)}
        onDelete={(key) => this.deleteParam(key)}
      />
    );
  }
}
