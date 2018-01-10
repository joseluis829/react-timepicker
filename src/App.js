import React, { Component } from 'react';
import './App.css';
import {DateTime} from './DateTime';


class App extends Component {
  render() {
    return (
      /*ReactDOM.render(
        React.createElement(DateTime, {
          viewMode: 'time',
          dateFormat: false,
          defaultValue: '12:00 AM',
          timeConstraints: { minutes: { min: 0, max: 59, step: 60 }},
          isValidDate: function(current) {
            return current.isBefore(DateTime.moment().startOf('month'));
          }
        }),
        document.getElementById('datetime')
      );*/

      <DateTime viewMode= 'time' dateFormat= {false} defaultValue= '12:00 AM' timeConstraints= {{ minutes: { min: 0, max: 59, step: 60 }}}>
      </DateTime>
    );
  }
}

export default App;
