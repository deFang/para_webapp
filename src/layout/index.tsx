import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Trade from '../views/Trade'
import Liquidity from '../views/Liquidity'

const LayoutView: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Trade/>
        </Route>
        <Route path="/liquidity" exact>
          <Liquidity/>
        </Route>
      </Switch>
    </Router>
  )
}

export default LayoutView;
