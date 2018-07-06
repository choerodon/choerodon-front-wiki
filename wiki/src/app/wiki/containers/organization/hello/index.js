import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class Hello extends Component {
  render() {
    return (
      <div>{'Hello, it is an organization knowledge!'}</div>
    );
  }
}
export default withRouter(Hello);
