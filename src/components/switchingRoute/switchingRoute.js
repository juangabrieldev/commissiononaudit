import React, {Component} from 'react';
import { Route , Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class SwitchingRoute extends Component {
  render() {
  //   if(this.props.exact) {
  //     switch(this.props.mode) {
  //       case 1:
  //         return <Route path={this.props.firstPath} exact component={this.props.firstComponent}/>;
  //
  //       case 2:
  //         return <Route path={this.props.secondPath} exact component={this.props.secondComponent}/>;
  //
  //       case 3:
  //         return <Route path={this.props.thirdPath} exact component={this.props.thirdComponent}/>;
  //
  //       case 4:
  //         return <Route path={this.props.fourthPath} exact component={this.props.fourthComponent}/>;
  //     }
  //   } else {
  //     switch(this.props.mode) {
  //       case 1:
  //         return <Route path={this.props.firstPath} exact component={this.props.firstComponent}/>;
  //
  //       case 2:
  //         return <Route path={this.props.secondPath} exact component={this.props.secondComponent}/>;
  //
  //       case 3:
  //         return <Route path={this.props.thirdPath} exact component={this.props.thirdComponent}/>;
  //
  //       case 4:
  //         return <Route path={this.props.fourthPath} exact component={this.props.fourthComponent}/>;
  //     }
  //   }
  // }
    console.log(this.props);
    return this.props.children
  }
}

const mapStateToProps = state => {
  return {
    mode: state.authentication.mode
  }
};

export default connect(mapStateToProps)(SwitchingRoute);