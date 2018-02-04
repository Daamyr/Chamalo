import React, {PropTypes, Component} from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import {ourGreatPlaceStyle} from './our_great_place_styles.js';
import {ourGreatPlaceStyleBis} from './our_great_place_styles_bis.js';


export default class OurGreatPlace extends Component {
  static propTypes = {
    text: PropTypes.string,
    danger: PropTypes.bool
  };

  static defaultProps = {};

  shouldComponentUpdate = shouldPureComponentUpdate;

  render() {
    console.log(this.props.danger);
    if (this.props.danger) {
      return (
         <div style={ourGreatPlaceStyleBis}>
            {this.props.text}
         </div>
      );
    }
    return (
       <div style={ourGreatPlaceStyle}>
          {this.props.text}
       </div>
    );
  }
}
