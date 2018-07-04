import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Hello extends Component {
  render() {
    return (
      <div>{'Hello, it is a demo!'}</div>
    );
  }
}
export default withRouter(Hello);
