import React from 'react';
import {Route, Switch} from 'react-router-dom';

///firebasehook
import {useFirebase} from '../../components/FirebaseProvider';

import Konsumen from './konsumen';
import Laporan from './laporan';
import Pengaturan from './pengaturan';
import Produk from './produk';
import Home from './home';


import useStyles from './styles';

//
import AppBar from '@material-ui/core/AppBar';
import ToolBar from '@material-ui/core/ToolBar';
import Drawer from '@material-ui/core/Drawer';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';
import SignOutIcon from '@material-ui/icons/ExitToApp';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import StoreIcon from '@material-ui/icons/Store';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import SettingsIcon from '@material-ui/icons/Settings';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import Container from '@material-ui/core/Container';

function Private(){
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);

	const {auth} = useFirebase();

	const handleDrawerOpen = () => {
		setOpen(true);
	};
	const handleDrawerClose = () => {
		setOpen(false);
	};  

	const handleSignOut = (e) => {
		if(window.confirm('Apakah anda yakin ingin keluar dari aplikasi?'))
		auth.signOut();
	}
	
	return (
		<div className={classes.root}>
			<AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
				<ToolBar className={classes.toolbar}>
					<IconButton edge="start" color="secondary" aria-label="open drawer" onClick={handleDrawerOpen}
					className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
						<MenuIcon />
					</IconButton>
					<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
						<Switch>
							<Route path="/admin" children="Home" />
				          	<Route path="/admin/laporan" children="Laporan" />
				          	<Route path="/admin/produk" children="Produk" />
				          	<Route path="/admin/konsumen" children="Konsumen" />
				          	<Route path="/admin/pengaturan" children="Pengaturan" />
						</Switch>
					</Typography>
					<IconButton color="secondary" onClick={handleSignOut}>
						<SignOutIcon />
					</IconButton>
				</ToolBar>
			</AppBar>
			<Drawer variant="permanent" classes={{paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)}} open={open}>
				<div className={classes.toolBarIcon}>
					<IconButton  onClick={handleDrawerClose}>
						<ChevronLeftIcon />
					</IconButton>
				</div>
				<Divider />
				<List>
					<Route path="/admin" exact children={ ({match, history}) => {
							return 	<ListItem button selected={match?true:false} onClick={()=>{history.push('/admin')}}>
										<ListItemIcon>
											<HomeIcon />
										</ListItemIcon>
										<ListItemText primary="Home" />
									</ListItem>
						}
					}/>

					<Route path="/admin/produk" children={ ({match, history}) => {
								return <ListItem button selected={match?true:false} onClick={()=>{history.push('/admin/produk')}}>
												<ListItemIcon>
													<StoreIcon />
												</ListItemIcon>
												<ListItemText primary="Produk" />
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
					
					<Route path="/admin/transaksi" children={({match, history}) => {
							return <ListItem button selected={match?true:false} onClick={()=>{history.push('/admin/laporan')}}>
											<ListItemIcon>
												<ShoppingCartIcon />
											</ListItemIcon>
											<ListItemText primary="Transaksi" />
										</ListItem>
						}
					}
					/>	
					
					<Route path="/admin/pengaturan" children={({match, history}) => {
								return <ListItem button selected={match? true:false} onClick={()=>{history.push('/admin/pengaturan')}} >
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

export default Private;