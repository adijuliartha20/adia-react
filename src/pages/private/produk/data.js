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
	const produkCol = firestore.collection(`toko/${user.uid}/produk`);//ingat yang dikurung user.uid saja

	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleSimpan = async e => {
		setIsSubmitting(true);
		try{
			const findErrors = validate();

			if(Object.values(findErrors).some(err=> err!=='')){
				setError(findErrors);
			}else{
				const nama = form.nama;
				const produkBaru = await produkCol.add({nama});
				history.push(`produk/edit/${produkBaru.id}`);//ingat kurung kurawal
			}

		}catch(e){
			//console.log(e);		
			setError(e.message);
		}
		setIsSubmitting(false)
	}
	//Section Add End

	//Section Data
	const [snapshot, loading] = useCollection(produkCol);//grab data
	const [produkItems, setProdukItems] = useState([]);//set array kosong

	useEffect(()=>{
		if(snapshot){
			setProdukItems(snapshot.docs);
		}
	},[snapshot])

	function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
	  return { name, calories, fat, carbs, protein };
	}

	const handleDelete = (produkDoc) => async (e) => {
		if(window.confirm('Anda yakin mau menghapus data ini?')){
			const fotoUrl = produkDoc.data().foto;
			await produkDoc.ref.delete();
			if(fotoUrl){
				await storage.refFromURL(fotoUrl).delete();
			}
		}
	}


	return <>
				{/*Section Data*/}
				<Typography variant="h5" component="h1" paragraph>Daftar Produk</Typography>

				{produkItems.length <= 0 && 
					<Typography>Belum ada data produk</Typography>
				}
				{produkItems.length > 0 && 
				<Paper>
					<Table className={classes.table} aria-label="simple table">
						<TableHead>
							<TableRow>
								<TableCell align="left">Nama</TableCell>
								<TableCell align="left">Kategory</TableCell>
								<TableCell align="left">Jumlah</TableCell>
								<TableCell align="left">Harga</TableCell>
								<TableCell align="left"></TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{produkItems.map((produkDoc)=>{
								const produkData = produkDoc.data();
								return <TableRow>
											<TableCell>{produkData.nama}</TableCell>
											<TableCell></TableCell>
											<TableCell></TableCell>
											<TableCell></TableCell>
											<TableCell>
												<IconButton className={classes.edit} component={Link} to={`produk/edit/${produkDoc.id}`}>
													<EditIcon />
												</IconButton>
												<IconButton className={classes.delete} onClick={handleDelete(produkDoc)}>
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
			        <DialogTitle id="form-dialog-title">Buat Produk</DialogTitle>
			        <DialogContent>
			          <TextField
			            autoFocus
			            margin="dense"
			            id="nama"
			            name="nama"
			            label="Nama Produk"
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