import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types' ;
//material ui
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ImageIcon from '@material-ui/icons/Image';

import {withRouter} from 'react-router-dom'; //untuk ambil history
import { useFirebase } from '../../../components/FirebaseProvider';
import { useCollection } from 'react-firebase-hooks/firestore';

function SearchDialog({history, open, handleClose, transaksi, setTransaksi, setOpenSearchDialog}){//ingat tanda kurung ya bro, karena ini variable component	
	const[isSubmitting, setSubmitting] = useState(false);

	const {firestore, user} = useFirebase();
	const dataCol = firestore.collection(`toko/${user.uid}/konsumen`);
	const [snapshot, loading] = useCollection(dataCol);
	const [Items, setItems] = useState([]);
	const [filter, setFilter] = useState('');

	useEffect(()=>{
		if(snapshot){
			setItems(snapshot.docs.filter(
					(dataDoc) => {
						if(filter){
							return dataDoc.data().nama.toLowerCase().includes(filter.toLowerCase())
						}
						return true;
					}
				));
		}
	},[snapshot, filter])




	const addItem = dataDoc => e => { //format func harus seperti ini klo event klik item
		const dtKonsumen = dataDoc.data();
		setTransaksi({
			...transaksi,
			konsumenId: dataDoc.id,
			nama: dtKonsumen.nama,
			noTelpon: dtKonsumen.noTelpon,			
			foto: dtKonsumen.foto,
			jenisKelamin: dtKonsumen.jenisKelamin,
			tanggalLahir: dtKonsumen.tanggalLahir,
			alamat: dtKonsumen.alamat,
			kecamatan: dtKonsumen.kecamatan,
			kabupaten: dtKonsumen.kabupaten,			
			provinsi: dtKonsumen.provinsi,
			negara: dtKonsumen.negara,						
			kenalDari: dtKonsumen.kenalDari			
		})
		setOpenSearchDialog(false)
	}


	return <Dialog open={open} onClose={handleClose} disabled={isSubmitting}>
					<DialogContent dividers>
						<List 
							
							component="nav"
							subheader={
								<ListSubheader component="div">
									<TextField 
										autoFocus
										label="Cari Konsumen"
										fullWidth
										margin="normal"
										onChange={e=>{
											setFilter(e.target.value);
										}}
									/>
								</ListSubheader>
							}
						>

						{
							Items.map((dataDoc)=>{
								const dt = dataDoc.data();
								return 	<ListItem key={dataDoc.id} button  onClick={addItem(dataDoc)}>
											{
												dt.foto ? 
													<ListItemAvatar>
														<Avatar src={dt.foto} alt={dt.nama} />
													</ListItemAvatar>
													:
													<ListItemIcon>
														<ImageIcon />
													</ListItemIcon>
											}

											<ListItemText primary={dt.nama} secondary={`No Telpon: ${dt.noTelpon || '-'}`} />
										</ListItem>
							})
						}

						</List>
					</DialogContent>
				</Dialog>

}
SearchDialog.propTypes= {
	open : PropTypes.bool.isRequired,
	handleClose : PropTypes.func.isRequired,
	transaksi : PropTypes.object.isRequired,
	setTransaksi : PropTypes.func.isRequired,
	setOpenSearchDialog : PropTypes.func.isRequired,
}

export default withRouter(SearchDialog);