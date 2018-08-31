import React, {Component, Fragment} from 'react';

import univStyles from '../../home/styles.scss';
import Button from "../../button/button";
import styles from "../picture/picture.scss";
import avatar from "../../../assets/ui/avatar.svg";

class PersonalDataSheet extends Component {
  state = {
    page: 1
  };

  render() {
    const pdsTitleBar =
      <div className={univStyles.titleBar + ' ' + univStyles.fullWidth}>
        <p>Personal Data Sheet</p>
      </div>;

    const bottomBar =
      <div className={univStyles.titleBar + ' ' + univStyles.singleButton + ' ' + univStyles.fullWidth + ' ' + univStyles.bottom + ' ' + univStyles.noTransition}>
        <Button disabled={!this.state.croppedImage} onClick={this.onSave} width={70} classNames={['tertiary']} name="NEXT"/>
      </div>;

    return (
      <Fragment>
        {pdsTitleBar}
        {bottomBar}
        <div className={univStyles.main}>
          <div className={univStyles.pageMain}>
            <div className={univStyles.form}>
              <div className={univStyles.header}>
                <p>Fill up your personal data sheet</p>
              </div>
              <div className={univStyles.formBody} style={{marginBottom: 50, height: 400}}>

              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default PersonalDataSheet;
