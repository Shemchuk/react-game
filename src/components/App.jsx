import '../sass/components/App.scss';
import { join } from 'lodash';
import React from 'react';

import logo from '../img/logo192.png';

const lodashTest = join(['Hello', 'React', '!'], ' ');

const App = () => (
  <div className="test_container">
    <h1 className="test_fonts">{lodashTest}</h1>
    <img src={logo} alt="logo" />
  </div>
);

export default App;
