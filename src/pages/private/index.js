import React from 'react';
import {Route, Switch} from 'react-router-dom';

///firebasehook
import {useFirebase} from '../../components/FirebaseProvider';

import Konsumen from './konsumen';
import Laporan from './laporan';
import Pengaturan from './pengaturan';
import Produk from './produk';
import Transaksi from './transaksi';


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


function Private(){
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

	const classes = useStyles();

	
	return (
		<div className={classes.root}>
			<AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
				<ToolBar className={classes.toolbar}>
					<IconButton edge="start" color="secondary" aria-label="open drawer" 
					className={clsx(classes.menuButton, open && classes.menuButtonHidden)}>
						<MenuIcon />
					</IconButton>
					<Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
						<Switch>
							<Route path="/admin/transaksi" children="Transaksi" />
				          	<Route path="/admin/laporan" children="Laporan" />
				          	<Route path="/admin/produk" children="Produk" />
				          	<Route path="/admin/konsumen" children="Konsumen" />
				          	<Route path="/admin/pengaturan" children="Pengaturan" />
						</Switch>
					</Typography>
					<IconButton color="secondary">
						<SignOutIcon />
					</IconButton>
				</ToolBar>
			</AppBar>
			<Drawer>

			</Drawer>
			<main>
				<Switch>
					<Route path="/admin/transaksi" component={Transaksi} />
		          	<Route path="/admin/laporan" component={Laporan} />
		          	<Route path="/admin/produk" component={Produk} />
		          	<Route path="/admin/konsumen" component={Konsumen} />
		          	<Route path="/admin/pengaturan" component={Pengaturan} />
				</Switch>
			</main>
		</div>
	);
}

export default Private;