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
import Routes from './routes';
import './App.scss';

const App: React.FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <Router history={history}>
            <Switch>
              <Route path={Routes.FOOD_LIST} component={FoodPage} exact />
              <Route path={Routes.CONTAINERS_LIST} component={ContainerPage} exact />
              <Route path={Routes.HOME} component={Playground} />
            </Switch>
          <NavBar />
        </Router>
      </Provider>
    </div>
  );
}

export default App;
