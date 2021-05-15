import React from 'react';
import './App.css';

import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";

 
import Home from './screens/Home'
import Create from './screens/Create'
import HeaderNav from './components/HeaderNav'
 
 
export default function App() {
 
  return (
    <BrowserRouter>

    <HeaderNav />
      <Switch>
        <Route 
          path="/home" 
          render={(props) => <Home {...props} />} />
        <Route
          path="/create"
          render={(props) => <Create {...props} />}
        />  

        <Redirect to="/home" />
      </Switch>
    </BrowserRouter>


  );
}