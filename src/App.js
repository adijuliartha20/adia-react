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

import {SnackbarProvider} from 'notistack';


function App() {
  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3} autoHideDuration={3000}> 
          <FirebaseProvider>
            <Router>
              <Switch>
                <Route path="/" exact  component={Home} />
                <Route path="/login" component={Login} />
                <Route path="/registrasi" component={Registrasi} />
                
                <PrivateRoute path="/admin" component={Private} />
                <PrivateRoute path="/admin/laporan" component={Private} />
                <PrivateRoute path="/admin/produk" component={Private} />
                <PrivateRoute path="/admin/konsumen" component={Private} />
                <PrivateRoute path="/admin/pengaturan" component={Private} />
              </Switch>
            </Router>
          </FirebaseProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
