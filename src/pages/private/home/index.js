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
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';

import Accordion from '@material-ui/core/ExpansionPanel';
import AccordionSummary from '@material-ui/core/ExpansionPanelSummary';
import AccordionDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';


import ImageIcon from '@material-ui/icons/Image';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableHead from '@material-ui/core/TableHead';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import SaveIcon from '@material-ui/icons/Save';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';

import useStyles from './styles';

import format from 'date-fns/format';

import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';
import { useSnackbar } from 'notistack';
import { currency } from '../../../utils/formatter';

import SearchDialog from './searchDialog';
//import Transaksi from './Transaksi';

function Home(){
	const classes = useStyles();

	const todayDateString =  format(new Date(), 'YYYY-MM-DD');
	const initialTransaksi = {	
								transaksiID: '',
								tanggal: todayDateString,
								totalPesanan: 0,
								diskon: 0,
								ongkir: 0,
								totalPembayaran: 0,
								bayar: 0,
								kembalian: 0,
								statusPembayaran: 'bln',
								statusPesanan: 'pb',
								tempatDeal: '',
								tanggalKirim: '',

								konsumenId: '',
								nama: '',
								jenisKelamin: '',
								tanggalLahir: '',
								noTelpon: '',
								alamat: '',
								kecamatan: '',
								kabupaten: '',
								provinsi: '',
								negara: '',
								kenalDari: ''
							}
	const [transaksi, setTransaksi] = useState(initialTransaksi);
	const [totalPembayaran, setTotalPembayaran] = useState(0);
	const [totalKembalian, setTotalKembalian] = useState(0);
	const [totalOngkir, setTotalOngkir] = useState(0);
	const [totalDiskon, setTotalDiskon] = useState(0);



	
	const {firestore, user} = useFirebase();
	const transaksiCol = firestore.collection(`toko/${user.uid}/transaksi`);
	const [snapshotTransaksi, loadingTransaksi] = useCollection(transaksiCol.where('tanggal','==',todayDateString));
	useEffect(()=>{
		if(snapshotTransaksi){//jika transaksi ada
			setTransaksi(transaksi=>({
				...transaksi,
				transaksiID: `${transaksi.tanggal}/${snapshotTransaksi.docs.length + 1}`
			}))
		}else{
			setTransaksi(transaksi=>({
				...transaksi,
				transaksiID: `${transaksi.tanggal}/1`
			}))
		}
	},[snapshotTransaksi])

	//Set Search Product
	const produkCol = firestore.collection(`toko/${user.uid}/produk`);
	const [snapshotProduk, loadingProduk] = useCollection(produkCol);
	const [produkItems, setProdukItems] = useState([]);
	const [filterProduk, setFilterProduk] = useState('');

	useEffect(()=>{
		if(snapshotProduk){
			setProdukItems(snapshotProduk.docs.filter(
					(produkDoc) => {
						if(filterProduk){
							return produkDoc.data().nama.toLowerCase().includes(filterProduk.toLowerCase())
						}
						return true;
					}
				));
		}
	},[snapshotProduk, filterProduk])

	const {enqueueSnackbar} =  useSnackbar();
	const initialDetailTransaksi = {
		items: {},
		total: 0
	}
	const [detailTransaksi, setDetailTransaksi] = useState(initialDetailTransaksi);
	const addItem = produkDoc => e => {
		let newItem = {...detailTransaksi.items[produkDoc.id]};//panggil data bila sudah diset sebelumnya
		const produkData = produkDoc.data();
		
		if(newItem.jumlah){
			newItem.jumlah = newItem.jumlah + 1;
			newItem.subTotal = produkData.harga * newItem.jumlah;
		}else{
			newItem.tanggal =  todayDateString;
			newItem.transaksiId = transaksi.transaksiID;
			newItem.produkId = produkDoc.id;
			newItem.produk = produkData.nama;
			newItem.kategoriId = '';
			newItem.kategori = produkData.kategori;
			newItem.modal = produkData.modal;
			newItem.harga = produkData.harga;
			newItem.jumlah = 1;
			newItem.subTotal = produkData.harga;
		}

		const newItems = {
							...detailTransaksi.items,
							[produkDoc.id]: newItem
						}
		if(newItem.jumlah > produkData.stok){
			enqueueSnackbar('Jumlah melebihi stok produk',{variant: 'error'});
		}else{
			const totalPesanan = Object.keys(newItems).reduce((total,k)=>{
					const item = newItems[k];
					return total + parseInt(item.subTotal);
			},0);

			let ongkir = transaksi.ongkir;
			let diskon = transaksi.diskon;
			let totalPembayaran = (totalPesanan + parseInt(ongkir)) - parseInt(diskon);

			let bayar = parseInt(transaksi.bayar);
			let kembalian = bayar - totalPembayaran ; 	

			setDetailTransaksi({
				...detailTransaksi,
				items : newItems,
				total : totalPesanan
			})

			setTransaksi({
				...transaksi,
				totalPesanan : totalPesanan,
				totalPembayaran: totalPembayaran,
				bayar: bayar,
				kembalian: kembalian
			})
			setTotalKembalian(kembalian);
			setPembayaran();
		}
		
	}

	const handleChangeJumlah =  k => e => {
		let newItem = {...detailTransaksi.items[k]};
		newItem.jumlah = parseInt(e.target.value);
		newItem.subTotal = newItem.harga * newItem.jumlah;

		const newItems = {
							...detailTransaksi.items,
							[k]: newItem
						}

		const produkDoc = produkItems.find(item=>item.id === k);
		const produkData = produkDoc.data();
		
		if(newItem.jumlah > produkData.stok){
			enqueueSnackbar('Jumlah melebihi stok produk',{variant: 'error'});
		}else{
			const totalPesanan = Object.keys(newItems).reduce((total,k)=>{
					const item = newItems[k];
					return total + parseInt(item.subTotal);
				},0);

			let ongkir = transaksi.ongkir;
			let diskon = transaksi.diskon;
			let totalPembayaran = (totalPesanan + parseInt(ongkir)) - parseInt(diskon);

			let bayar = parseInt(transaksi.bayar);
			let kembalian = bayar - totalPembayaran ; 			

			setDetailTransaksi({
				...detailTransaksi,
				items : newItems,
				total : totalPesanan
			})

			setTransaksi({
				...transaksi,
				totalPesanan : totalPesanan,
				totalPembayaran: totalPembayaran,
				bayar: bayar,
				kembalian: kembalian

			})

			setTotalKembalian(kembalian);
			setPembayaran();
		}

	}

	const [pembayaran, setPembayaran] = useState([]);

	const handleChangeOngkir = (e) => {
		setTotalOngkir(e.target.value)
		let totalPesanan = parseInt(transaksi.totalPesanan);
		let ongkir = parseInt(e.target.value);
		let diskon = parseInt(transaksi.diskon);
		let totalPembayaran = (totalPesanan + ongkir) - diskon;
		let bayar = parseInt(transaksi.bayar);
		let kembalian = bayar - totalPembayaran ; 

		setTransaksi({
			...transaksi,
			ongkir: ongkir,
			totalPembayaran: totalPembayaran,
			bayar: bayar,
			kembalian: kembalian
		})

		setTotalKembalian(kembalian);
	}

	const handleChangeDiskon = (e) => {
		setTotalDiskon(e.target.value);
		let totalPesanan = parseInt(transaksi.totalPesanan);
		let ongkir = parseInt(transaksi.ongkir);
		let diskon = parseInt(e.target.value);
		let totalPembayaran = (totalPesanan + ongkir) - diskon;			
		let bayar = parseInt(transaksi.bayar);
		let kembalian = bayar - totalPembayaran ; 

		setTransaksi({
			...transaksi,
			diskon: diskon,
			totalPembayaran: totalPembayaran,
			bayar: bayar,
			kembalian: kembalian
		})

		setTotalKembalian(kembalian);
	}

	

	const handleChangeBayar = (e) => {
		setTotalPembayaran(e.target.value)
		let totalPembayaran = parseInt(transaksi.totalPembayaran);
		let bayar = parseInt(e.target.value);
		let kembalian = bayar - totalPembayaran;	

		setTotalKembalian(kembalian);

		let statusPembayaran = 'bln';
		if(bayar >= totalPembayaran){
			statusPembayaran = 'lns';
		}

		setTransaksi({
			...transaksi,
			kembalian: kembalian,
			bayar: bayar,
			statusPembayaran: statusPembayaran
		})
	}

	const handleChangeTanggalKirim = (e) => {
		setTransaksi({
			...transaksi,
			tanggalKirim: e.target.value
		})
	}

	//Set Search Product End


	//Set Search Konsumen
	const [openSearchDialog, setOpenSearchDialog] = useState(false);
	
	//Set Search Konsumen End


	const [tempatDeal, setTempatDeal] = React.useState('');
	const handleChangeTempatDeal = (event: React.ChangeEvent<HTMLInputElement>) => {
	    setTempatDeal(event.target.value);

	   	setTransaksi({
			...transaksi,
			tempatDeal: event.target.value
		})
	};

	const [statusPesanan, setStatusPesanan] = React.useState('');
	const handleChangeStatusPesanan = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTempatDeal(event.target.value);
		setTransaksi({
			...transaksi,
			statusPesanan: event.target.value
		})
	}



	const [isSubmitting, setIsSubmitting] = useState(false);


	const simpanTransaksi = async (e) => {
		if(transaksi.totalPembayaran==0){
			enqueueSnackbar('Tidak ada transaksi untuk disimpan',{variant:'error'});
			return false;
		}

		if(transaksi.konsumenId==''){
			enqueueSnackbar('Tidak ada konsumen yang dipilih',{variant:'error'});
			return false;	
		}

		setIsSubmitting(true)

		try{
			//const { firestore, storage, user } = useFirebase();
			const transaksiCol = firestore.collection(`toko/${user.uid}/transaksi`);
			//simpan transaksi
			const dataBaru = await transaksiCol.add({
				...transaksi,
				timestamp: Date.now()
			})
			const newId = dataBaru.id; //'QMZGzjdnWnDK1aHQJRtT';

			//simpan detailtransaksi
			if(newId){
				//console.log(detailTransaksi);
				await firestore.runTransaction(transaction=>{
					const produkIDs = Object.keys(detailTransaksi.items);
					console.log(produkIDs)
					return Promise.all(produkIDs.map(produkId=>{
						const produkRef = firestore.doc(`toko/${user.uid}/produk/${produkId}`);

						return transaction.get(produkRef).then((produkDoc)=>{//cek apa data produk ada di db
							console.log(produkDoc)
							
							if(!produkDoc.exists){
								throw Error('Produk tidak ada');
							}else{ //simpan n update stok
								const detailTransaksiCol = firestore.collection(`toko/${user.uid}/detailTransaksi`);

								const newColl = {
													...detailTransaksi.items[produkId],
													timestamp : Date.now()
												}

								const dataDetailBaru = detailTransaksiCol.add(newColl);

								let newStok = parseInt(produkDoc.data().stok) - parseInt(detailTransaksi.items[produkId].jumlah);

								if(newStok < 0){
									newStok = 0;
								}

								transaction.update(produkRef, {stok:newStok});
							}
						})


					}));
				});
			}			
			
			//simpan detailstatustransaksi
			const dataStatusTransaksi = {
				transaksiId: newId,
				timestamp : Date.now(),
				status: transaksi.statusPesanan
			}

			const detailStatusTransaksiColl = firestore.collection(`toko/${user.uid}/detailStatusTransaksi`);
			await detailStatusTransaksiColl.add(dataStatusTransaksi);
			
			//simpan detailPembayaran
			const dataPembayaran = {
				transaksiId: newId,
				timestamp : Date.now(),
				jumlah: transaksi.bayar
			}
			const detailPembayaranColl = firestore.collection(`toko/${user.uid}/detailPembayaran`);
			await detailPembayaranColl.add(dataPembayaran);

			enqueueSnackbar('Transaksi berhasil disimpan',{variant:'success'});
			setTransaksi(transaksi=>({
				...initialTransaksi,
				no: transaksi.no
			}));

			setDetailTransaksi(detailTransaksi=>({
				...initialDetailTransaksi
			}));

			setTotalOngkir(0);
			setTotalDiskon(0);
			setTotalPembayaran(0);
			setTotalKembalian(0);


		}catch(e){

		}
	}

	return (
		<>
			<Typography variant="h5" component="h1">Transaksi Baru</Typography>
			<Grid  container spacing={5}>
				<Grid item xs>
					<TextField 
						label="No Transaksi"
						InputProps={{readOnly:true}}
						value={transaksi.transaksiID}
					/>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						onClick={simpanTransaksi}
						disabled={isSubmitting}
					>
						<SaveIcon className={classes.iconLeft} />
						Simpan
					</Button>
				</Grid>
			</Grid>
			<Grid  container spacing={5}>
				<Grid item xs={12} md={8}>
					<Table className={classes.transaksi}>
						<TableHead>
							<TableRow>
								<TableCell>Item</TableCell>
								<TableCell>Kategori</TableCell>
								<TableCell>Jumlah</TableCell>
								<TableCell>Harga</TableCell>
								<TableCell align="right">Subtotal</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{
								Object.keys(detailTransaksi.items).map(k=>{//ini foreach react
									const item = detailTransaksi.items[k];
									return (
												<TableRow key={k}>
													<TableCell>{item.produk}</TableCell>
													<TableCell>{item.kategori}</TableCell>
													<TableCell>
														<TextField 
															className={classes.inputJumlah}
															value={item.jumlah}
															type="number"
															onChange={handleChangeJumlah(k)}
															disabled={isSubmitting}
														/>
													</TableCell>
													<TableCell>{currency(item.harga)}</TableCell>
													<TableCell align="right">{currency(item.subTotal)}</TableCell>
												</TableRow>
										)
								})

							}
							<TableRow>
								<TableCell colSpan={4}><Typography variant="subtitle2">Total Pesanan</Typography></TableCell>
								<TableCell align="right"><Typography variant="h6">{currency(detailTransaksi.total)}</Typography></TableCell>
							</TableRow>
							<TableRow>
								<TableCell colSpan={4} align="right"><Typography variant="subtitle2">Ongkir</Typography></TableCell>
								<TableCell align="right">
									<TextField
										className={classes.ongkir}
										inputProps={{style: { textAlign: 'right' }}}										
										type="number"
										value={totalOngkir}
										onChange={handleChangeOngkir}
										disabled={isSubmitting}
									/>
								</TableCell>
							</TableRow>
							<TableRow>
								<TableCell align="right" colSpan={4}><Typography variant="subtitle2">Diskon</Typography></TableCell>
								<TableCell align="right">
									<TextField
										className={classes.diskon}
										inputProps={{style: { textAlign: 'right' }}}										
										type="number"
										value={totalDiskon}
										onChange={handleChangeDiskon}
										disabled={isSubmitting}
									/>
								</TableCell>
							</TableRow>
							
							<TableRow>
								<TableCell align="right" colSpan={4}><Typography variant="subtitle2">Total Pembayaran</Typography></TableCell>
								<TableCell align="right"><Typography variant="h6">{currency(transaksi.totalPembayaran)}</Typography></TableCell>
							</TableRow>
						</TableBody>
					</Table>


					<Accordion className={classes.accBayar}>
				        <AccordionSummary
				          expandIcon={<ExpandMoreIcon />}
				          aria-controls="panel1a-content"
				          id="panel1a-header"
				        >
				          <Typography className={classes.heading}>Bayar</Typography>
				        </AccordionSummary>
				        <AccordionDetails>
				          	<Table>
								<TableBody>
									<TableRow>
										<TableCell colSpan={4}><Typography variant="subtitle2">Bayar</Typography></TableCell>
										<TableCell align="right">
											<TextField
												className={classes.bayar}
												inputProps={{style: { textAlign: 'right' }}}
												type="number"
												onChange={handleChangeBayar}
												value={totalPembayaran}
												disabled={isSubmitting}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={4}><Typography variant="subtitle2">Kembalian</Typography></TableCell>
										<TableCell align="right">
											<Typography variant="h6" id="bayar">
												{currency(totalKembalian)}
											</Typography>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
				        </AccordionDetails>
				    </Accordion>

				    <Accordion className={classes.accBayar}>
				        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header" >
				          <Typography className={classes.heading}>Detail Lainnya</Typography>
				        </AccordionSummary>
				        <AccordionDetails>
				          	<Table className={classes.kirim}>
								<TableBody>
									<TableRow>
										<TableCell colSpan={4}><Typography variant="subtitle2">Tanggal Kirim</Typography></TableCell>
										<TableCell align="right">
											<TextField
												className={classes.kirim}
												inputProps={{style: { textAlign: 'right' }}}
												value={transaksi.kirim}
												type="date"
												onChange={handleChangeTanggalKirim}
												disabled={isSubmitting}
											/>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={4}><Typography variant="subtitle2">Deal di</Typography></TableCell>
										<TableCell align="right">
											<TextField
												id="filled-select-tempatDeal"
												select
												name="tempatDeal"
												margin="normal"
												value={transaksi.tempatDeal}
												onChange={handleChangeTempatDeal}
												fullWidth
												required
												disabled={isSubmitting}
									        >
										        <MenuItem key="wa" value="wa">Whats App</MenuItem>
										        <MenuItem key="fb" value="fb">Facebook</MenuItem>
										        <MenuItem key="ig" value="ig">Instagram</MenuItem>
										        <MenuItem key="shp" value="shp">Shopee</MenuItem>
										        <MenuItem key="tik" value="tik">Tiktok</MenuItem>
									        </TextField>
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell colSpan={4}><Typography variant="subtitle2">Status Pesanan</Typography></TableCell>
										<TableCell align="right">
											<TextField
												id="filled-select-statusPesanan"
												select
												name="statusPesanan"
												margin="normal"
												value={transaksi.statusPesanan}
												onChange={handleChangeStatusPesanan}
												fullWidth
												required
												disabled={isSubmitting}
									        >
									        	<MenuItem key="pb" value="pb">Pesanan Baru</MenuItem>
										        <MenuItem key="jr" value="jr">Jarit</MenuItem>
										        <MenuItem key="pk" value="pk">Pesanan Siap Kirim</MenuItem>
										        <MenuItem key="tk" value="tk">Terkirim</MenuItem>
										        <MenuItem key="bt" value="bt">Batal</MenuItem>
									        </TextField>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
								
				        </AccordionDetails>
				    </Accordion>
					

				</Grid>
				<Grid item xs={12} md={4}>
					<List className={classes.listKonsumen}>
						<IconButton 
							className={classes.pilihKonsumen} 
							onClick={(e)=>{
								setOpenSearchDialog(true)
							}}
						>
							<PersonAddIcon />
						</IconButton>
						{
							transaksi.foto ?
								<Avatar className={classes.avatar} src={transaksi.foto} />
							:
								<InsertEmoticonIcon className={classes.iconKonsumen} />		
						}


						{
							transaksi.nama ?
							<Typography variant="body1" className={classes.detailInfoKonsumen}>{transaksi.nama}</Typography>
							:
							''
						}

						{
							transaksi.noTelpon ?
							<Typography variant="body1" className={classes.detailInfoKonsumen}>{transaksi.noTelpon}</Typography>
							:
							''
						}
						
						{
							transaksi.alamat ?
							<Typography variant="body1" className={classes.detailInfoKonsumen}>{transaksi.alamat}</Typography>
							:
							''
						}
					</List>

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
							produkItems.map((produkDoc)=>{
								const produkData = produkDoc.data();
								return 	<ListItem key={produkDoc.id} button disabled={produkData.stok==0?true:false} onClick={addItem(produkDoc)}>
											{
												produkData.foto ? 
													<ListItemAvatar>
														<Avatar src={produkData.foto} alt={produkData.nama} />
													</ListItemAvatar>
													:
													<ListItemIcon>
														<ImageIcon />
													</ListItemIcon>
											}

											<ListItemText primary={produkData.nama} secondary={`Stok: ${produkData.stok || 0}`} />
										</ListItem>
							})
						}
					</List>

					
				</Grid>
			</Grid>


			<SearchDialog 
				open={openSearchDialog}
				setOpenSearchDialog= {setOpenSearchDialog}
				transaksi={transaksi}
				setTransaksi={setTransaksi}
				handleClose={()=>{
					setOpenSearchDialog(false)
				}}
				/>



		</>
		);
}

export default Home;