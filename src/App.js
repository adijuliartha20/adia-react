import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';


import FirebaseProvider from './components/FirebaseProvider';
import PrivateRoute from './components/PrivateRoute';


import CssBaseline from '@material-ui/core/CssBaseline';
import ThemeProvider from '@material-ui/styles/ThemeProvider';
import theme from './config/theme';

import Home from './pages/home';
import Login from './pages/login';
import Registrasi from './pages/registrasi';
import Private from './pages/private';



function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <FirebaseProvider>
          <Router>
            <Switch>
              <Route path="/" exact  component={Home} />
              <Route path="/login" component={Login} />
              <Route path="/registrasi" component={Registrasi} />
              
              <PrivateRoute path="/admin/transaksi" component={Private} />
              <PrivateRoute path="/admin/laporan" component={Private} />
              <PrivateRoute path="/admin/produk" component={Private} />
              <PrivateRoute path="/admin/konsumen" component={Private} />
              <PrivateRoute path="/admin/pengaturan" component={Private} />
            </Switch>
          </Router>
        </FirebaseProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
