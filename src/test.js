import React, {Component} from 'react';
import axios from 'axios';

class Test extends Component {
  state = {
    showPreview: false,
    url: null
  };

  onChangeFileHandler = () => {
    const formData = new FormData();

    formData.append('file', this.refs.file.files[0]);
    formData.append('applicationId', '5891568898');

    axios.post('http://localhost:4000/documents/', formData)
      .then(res => {
        if(res.data.status === 200) {
          this.setState({
            showPreview: true,
            url: res.data.url
          })
        }
      })
  };

  render() {
    return (
      <div style={{height: '100vh', boxSizing: 'border-box', background: this.state.showPreview ? 'black' : ''}}>
        <input type="file" ref="file" onChange={this.onChangeFileHandler}/>
        {
          this.state.showPreview ?
            <iframe
              src={'https://view.officeapps.live.com/op/embed.aspx?src=' + this.state.url}
              width='80%' height='80%' style={{boxSizing: 'border-box'}} frameBorder='0'>This is an embedded <a target='_blank' href='http://office.com'>Microsoft
              Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
            </iframe> :
            null
        }
      </div>
    );
  }
}

export default Test;
