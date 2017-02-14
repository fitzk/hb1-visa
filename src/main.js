import React, { Component } from "react"
import { AppContainer } from "react-hot-loader"
import { render } from 'react-dom';
import HB1 from './hb1.js';

const renderApp = () => {
  render(<AppContainer>
          <HB1/>
        </AppContainer>, document.getElementById("app"));
}

renderApp() // Renders App on init

if (module.hot) {
  module.hot.accept("./hb1.js", renderApp)
}
