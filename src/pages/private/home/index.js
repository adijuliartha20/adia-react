import React, {useState, useEffect} from "react";

//material ui
import Button from "@material-ui/core/Button";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import SaveIcon from '@material-ui/icons/Save';

import useStyles from './styles';

import format from 'date-fns/format';

function Home(){
	const classes = useStyles();

	const todayDateString =  format(new Date(), 'YYYY-MM-DD');
	const initialTransaksi = {	
								
							}


	const setFilterProduk = (e) => {

	}

	return (
		<>
			<Typography variant="h5" component="h1">Transaksi Baru</Typography>
			<Grid container spacing={5}>
				<Grid item xs>
					<TextField 
						label="No Transaksi"
						InputProps={{readOnly:true}}
					/>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
					>
						<SaveIcon className={classes.iconLeft} />
						Simpan
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={5}>
				<Grid item xs={12} md={8}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Item</TableCell>
								<TableCell>Kategori</TableCell>
								<TableCell>Jumlah</TableCell>
								<TableCell>Harga</TableCell>
								<TableCell>Subtotal</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell colSpan={4}><Typography variant="subtitle2">Total</Typography></TableCell>
								<TableCell><Typography variant="h6"></Typography></TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</Grid>
				<Grid item xs={12} md={4}>
					<List 
						className={classes.produkList} 
						component="nav"
						subheader={
							<ListSubheader component="div">
								<TextField 
									autoFocus
									label="Cari Produk"
									fullWidth
									margin="normal"
									onChange={e=>{
										setFilterProduk(e.target.value);
									}}
								/>
							</ListSubheader>
						}
					>
						{
							
						}
					</List>
				</Grid>
			</Grid>
		</>
		);
}

export default Home;