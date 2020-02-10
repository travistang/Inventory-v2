import React from 'react';
import Playground from './components/playground';
import {
  Router, Switch, Route
} from 'react-router-dom';
import history from './history';
import NavBar from './pages/Navbar';
import  { ToastContainer } from 'react-toastify';

// pages
import FoodPage from './pages/Food';
import CreateFoodPage from './pages/CreateFood';
import FoodDetailsPage from './pages/FoodDetails';

import ContainerPage from './pages/Container';

import BuyPage from './pages/Buy';

import store from './reducers';
import  {Provider} from 'react-redux';
import Routes from './routes';
import './App.scss';
import Buy from './pages/Buy';
import { HeaderContainer } from './pages/Header';
import client from './data/graphql';

import { ApolloProvider } from '@apollo/react-hooks';

const App: React.FC = () => {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Provider store={store}>
            <Router history={history}>
                <HeaderContainer>
                  <div className="Page">
                    <Switch>
                      <Route path={Routes.FOOD_LIST} component={FoodPage} exact />
                      <Route path={Routes.FOOD_ADD} component={CreateFoodPage} exact />
                      <Route path={Routes.FOOD_EDIT} component={CreateFoodPage} exact />
                      <Route path={Routes.CONTAINERS_LIST} component={ContainerPage} exact />
                      <Route path={Routes.FOOD_DETAILS} component={FoodDetailsPage} exact />

                      <Route path={Routes.BUY_FOOD} component={BuyPage} exact />

                      <Route path={Routes.HOME} component={Playground} />
                    </Switch>
                  </div>
                </HeaderContainer>
                <ToastContainer />
                <NavBar />
            </Router>
        </Provider>
      </ApolloProvider>
    </div>
  );
}

export default App;
