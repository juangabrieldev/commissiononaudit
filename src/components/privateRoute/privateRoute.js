import React, {Component} from 'react';
import { Route , Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

class PrivateRoute extends Component {
  render() {
    if(this.props.mode === this.props.myMode) {
        if(this.props.exact) {
          return <Route path={this.props.path} exact component={this.props.component}/>
        } else {
          return <Route path={this.props.path} component={this.props.component}/>
        }
    } else {
      switch(this.props.mode) {
        case 1: {
          return <Redirect to={this.props.firstRedirect} />
        }

        case 2: {
          return <Redirect to={this.props.secondRedirect} />
        }

        case 3: {
          return <Redirect to={this.props.thirdRedirect} />
        }

        case 4: {
          return <Redirect to={this.props.fourthRedirect} />
        }
      }

    }
  }
}

const mapStateToProps = state => {
  return {
    mode: state.authentication.mode
  }
};

export default connect(mapStateToProps)(PrivateRoute);
