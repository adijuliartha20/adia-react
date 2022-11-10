import React from 'react';
import clsx from 'clsx';

import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';

import HomeIcon from '@material-ui/icons/Home';
import StoreIcon from '@material-ui/icons/Store';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SettingsIcon from '@material-ui/icons/Settings';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import SignOutIcon from '@material-ui/icons/ExitToApp';

import useStyles from './styles';
import {Route, Switch} from 'react-router-dom';

import Konsumen from './konsumen';
import Laporan from './laporan';
import Pengaturan from './pengaturan';
import Produk from './produk';
import Home from './home';

import {useFirebase} from '../../components/FirebaseProvider.js';

export default function Dashboard() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const {auth} = useFirebase();

  const handleSignOut = () => {
      if(window.confirm('Apakah anda yang mau keluar dari aplikasi?')){
        auth.signOut();    
      }
      
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <Switch>
              <Route path="/admin" exact children="Home"/>
              <Route path="/admin/konsumen" children="Konsumen" />
              <Route path="/admin/produk" children="Produk" />
              <Route path="/admin/laporan" children="Laporan" />
              <Route path="/admin/pengaturan" children="Pengaturan" />
            </Switch>
          </Typography>
          <IconButton color="secondary" onClick={handleSignOut}>
            <SignOutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Route path="/admin" exact children={ ({match, history}) => {
                return <ListItem button selected={match?true:false} onClick={()=>{history.push('/admin')}}>
                        <ListItemIcon>
                          <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary="Home" />
                      </ListItem>
              }     
            }
          />
          <Route path="/admin/konsumen" children={ ({match, history}) => {
                return <ListItem button selected={match?true:false} onClick={()=>{history.push('/admin/konsumen')}}>
                        <ListItemIcon>
                          <InsertEmoticonIcon />
                        </ListItemIcon>
                        <ListItemText primary="Konsumen" />
                      </ListItem>
              }     
            }
          />
          <Route path="/admin/produk" children={ ({match, history}) => {
                return <ListItem button selected={match?true:false} onClick={()=>{history.push('/admin/produk')}}>
                        <ListItemIcon>
                          <AddPhotoAlternateIcon />
                        </ListItemIcon>
                        <ListItemText primary="Produk" />
                      </ListItem>
              }     
            }
          />
          <Route path="/admin/laporan" children={ ({match, history}) => {
                return <ListItem button selected={match?true:false} onClick={()=>{history.push('/admin/laporan')}}>
                        <ListItemIcon>
                          <StoreIcon />
                        </ListItemIcon>
                        <ListItemText primary="Laporan" />
                      </ListItem>
              }     
            }
          />
          <Route path="/admin/pengaturan" children={ ({match, history}) => {
                return <ListItem button selected={match?true:false} onClick={()=>{history.push('/admin/pengaturan')}}>
                        <ListItemIcon>
                          <SettingsIcon />
                        </ListItemIcon>
                        <ListItemText primary="Pengaturan" />
                      </ListItem>
              }     
            }
          />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Switch>
              <Route path="/admin" exact component={Home} />
              <Route path="/admin/laporan" component={Laporan} />
              <Route path="/admin/produk" component={Produk} />
              <Route path="/admin/konsumen" component={Konsumen} />
              <Route path="/admin/pengaturan" component={Pengaturan} />
          </Switch>
        </Container>
      </main>
    </div>
  );
}