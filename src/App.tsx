import React from 'react';
import Playground from './components/playground';
import {
  Router, Switch, Route
} from 'react-router-dom';
import history from './history';
import NavBar from './pages/Navbar';

// pages
import FoodPage from './pages/Food';
import ContainerPage from './pages/Container';

import store from './reducers';
import  {Provider} from 'react-redux';
import './App.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <Router history={history}>
            <Switch>
              <Route path="/food" component={FoodPage} exact />
              <Route path="/containers" component={ContainerPage} exact />
              <Route path="/" component={Playground} />
            </Switch>
          <NavBar />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
