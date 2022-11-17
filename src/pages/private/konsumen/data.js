import React, {useState} from 'react';

//Section Add
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import useStyles from './styles/grid';

import {useFirebase} from '../../../components/FirebaseProvider';
import {withRouter} from 'react-router-dom'; //untuk ambil history

//Section Data
import {useCollection} from 'react-firebase-hooks/firestore';
import {Link} from 'react-router-dom';
import {useEffect} from 'react';
import Typography from '@material-ui/core/Typography';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import AppPageLoading from '../../../components/AppPageLoading';

function DataPage({history}){
	const classes = useStyles();
	
	//Section Add
	const [open, setOpen] = React.useState(false);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	// handle simpan
	const [form, setForm] = useState({
		nama:''
	})
	const [error, setError] = useState({
		nama: ''
	});

	const handleChange = (e) => {
		setForm({
				[e.target.name] : e.target.value
			})

		setError({
			[e.target.name] : ''
		})
	}

	const validate = () => {
		const newErrors = {...error};

		if(!form.nama){
			newErrors.nama = 'Nama wajib diisi';
		}

		return newErrors;
	}

	const { firestore, storage, user } = useFirebase();
	const dataCol = firestore.collection(`toko/${user.uid}/konsumen`);//ingat yang dikurung user.uid saja

	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleSimpan = async e => {
		setIsSubmitting(true);
		try{
			const findErrors = validate();

			if(Object.values(findErrors).some(err=> err!=='')){
				setError(findErrors);
			}else{
				const nama = form.nama;
				const dataBaru = await dataCol.add({nama});
				history.push(`konsumen/edit/${dataBaru.id}`);//ingat kurung kurawal
			}

		}catch(e){
			//console.log(e);		
			setError(e.message);
		}
		setIsSubmitting(false)
	}
	//Section Add End

	//Section Data
	const [snapshot, loading] = useCollection(dataCol);//grab data
	const [Items, setItems] = useState([]);//set array kosong

	useEffect(()=>{
		if(snapshot){
			setItems(snapshot.docs);
		}
	},[snapshot])


	const handleDelete = (dataDoc) => async (e) => {
		if(window.confirm('Anda yakin mau menghapus data ini?')){
			const fotoUrl = dataDoc.data().foto;
			await dataDoc.ref.delete();
			if(fotoUrl){
				await storage.refFromURL(fotoUrl).delete();
			}
		}
	}

	if(loading){
		return <AppPageLoading />
	}


	return <>
				{/*Section Data*/}
				<Typography variant="h5" component="h1" paragraph>Daftar Konsumen</Typography>

				{Items.length <= 0 && 
					<Typography>Belum ada data konsumen</Typography>
				}
				{Items.length > 0 && 
				<Paper>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left">Nama</TableCell>
								<TableCell align="left">No Telpon</TableCell>
								<TableCell align="left">Kecamatan</TableCell>
								<TableCell align="left">Kabupaten</TableCell>
								<TableCell align="left">Provinsi</TableCell>
								<TableCell align="left"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{Items.map((dataDoc)=>{
								const dataData = dataDoc.data();
								return <TableRow>
											<TableCell>{dataData.nama}</TableCell>
											<TableCell>{dataData.noTelpon}</TableCell>
											<TableCell>{dataData.kecamatan}</TableCell>
											<TableCell>{dataData.kabupaten}</TableCell>
											<TableCell>{dataData.provinsi}</TableCell>
											<TableCell>
												<IconButton className={classes.edit} component={Link} to={`konsumen/edit/${dataDoc.id}`}>
													<EditIcon />
												</IconButton>
												<IconButton className={classes.delete} onClick={handleDelete(dataDoc)}>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										</TableRow>
							})}
						</TableBody>
					</Table>
			    </Paper>
				}
				{/*Section Data End*/}


				{/*Section tambah produk*/}
				<Fab color="primary" aria-label="add" className={classes.fab} onClick={handleClickOpen}>
					<AddIcon />
				</Fab>

				<Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
			        <DialogTitle id="form-dialog-title">Tambah Konsumen</DialogTitle>
			        <DialogContent>
			          <TextField
			            autoFocus
			            margin="dense"
			            id="nama"
			            name="nama"
			            label="Nama"
			            onChange={handleChange}
			            helperText={error.nama}
			            error={error.nama?true:false}
			            disabled={isSubmitting}
			            fullWidth
			          />
			        </DialogContent>
			        <DialogActions>
			          <Button onClick={handleClose} color="primary">
			            Cancel
			          </Button>
			          <Button onClick={handleSimpan} color="primary" variant="contained">
			            Simpan
			          </Button>
			        </DialogActions>
			    </Dialog>
			    {/*Section tambah produk End*/}
			</>
}

export default DataPage;