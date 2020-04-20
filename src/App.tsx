import React from 'react';
// import Playground from './components/playground';
import {
  Router, Switch, Route, useLocation
} from 'react-router-dom';
import history from './history';
import NavBar from './pages/Navbar';
import  { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// pages
import FoodPage from './pages/Food';
import CreateFoodPage from './pages/CreateFood';
import EditFoodPage from './pages/EditFood';
import FoodDetailsPage from './pages/FoodDetails';
import ContainerPage from './pages/Container';
import SettingsPage from './pages/Settings';
import BuyPage from './pages/Buy';
import ConsumePage from './pages/Consume';
import RecordsPage from './pages/Records';

import Routes, { PageNames } from './routes';
import { HeaderContainer } from './pages/Header';

import client from './data/graphql';
import { ApolloProvider } from '@apollo/react-hooks';
import { correctDatabase } from './data/resolvers';


import './App.scss';

const RouteSwitch: React.FC = () => {
  const query = new URLSearchParams(useLocation().search);

  switch(query.get('page')) {
    case PageNames.FOOD_LIST:
      return <FoodPage />
    case PageNames.FOOD_ADD:
      return <CreateFoodPage />
    case PageNames.FOOD_EDIT:
      return <EditFoodPage />
    case PageNames.CONTAINERS_LIST:
      return <ContainerPage />
    case PageNames.FOOD_DETAILS:
      return <FoodDetailsPage />
    case PageNames.BUY_FOOD:
      return <BuyPage />
    case PageNames.CONSUME:
      return <ConsumePage />
    case PageNames.SETTINGS:
      return <SettingsPage />
    case PageNames.RECORDS:
      return <RecordsPage />

    default:
      return null;
  }
}

const App: React.FC = () => {

  // correct database when the App just loads
  React.useEffect(() => {
      correctDatabase();
  }, []);

  return (
    <ApolloProvider client={client}>
      <div className="App">
            <Router history={history}>
                <HeaderContainer>
                  <div className="Page">
                    <Switch>
                      <Route path={Routes.HOME} component={RouteSwitch} />
                    </Switch>
                  </div>
                </HeaderContainer>
                <ToastContainer />
                <NavBar />
            </Router>
      </div>
    </ApolloProvider>
  );
}

export default App;
