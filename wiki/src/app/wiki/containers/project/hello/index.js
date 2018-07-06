import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Hello extends Component {
  render() {
    return (
      <div>{'Hello, it is a project knowledge!'}</div>
    );
  }
}
export default withRouter(Hello);
