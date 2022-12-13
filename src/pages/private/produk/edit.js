import React from 'react';

import TextField from '@material-ui/core/TextField';

import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';


import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import UploadIcon from '@material-ui/icons/CloudUpload';
import SaveIcon from '@material-ui/icons/Save';

import { useFirebase } from '../../../components/FirebaseProvider';
import { useDocument } from 'react-firebase-hooks/firestore/';
import { useState, useEffect } from 'react';
//ambil data kategori
import {useCollection} from 'react-firebase-hooks/firestore';


import useStyles from './styles/edit';
import {Prompt} from 'react-router-dom';
import {useSnackbar} from 'notistack';
import AppPageLoading from '../../../components/AppPageLoading';



function EditProduk({match}){
	const clasess = useStyles();
	const {firestore, user, storage} = useFirebase();	
	const {enqueueSnackbar} =  useSnackbar();

	//Grab kategori
	const kategoriCol = firestore.collection(`toko/${user.uid}/kategori`);
	const [snapshotK, loadingK] = useCollection(kategoriCol);//grab data
	const [kategoriItems, setKategoriItems] = useState([]);//set array kosong

	useEffect(()=>{
		if(snapshotK){
			const docs = snapshotK.docs;
			docs.map((dt)=>{
				const katData = dt.data();
				const newData = [];
				newData.id = dt.id;
				newData.nama = katData.nama
				setKategoriItems(kategoriItems =>[...kategoriItems, newData]);
				//setKategoriItems
			})

			//setKategoriItems(snapshotK.docs);
		}
	},[snapshotK])
	//Grab kategori end


	const produkDoc = firestore.doc(`toko/${user.uid}/produk/${match.params.produkId}`);
	const [snapshot, loading] =  useDocument(produkDoc);
	const [form, setForm] = useState({
										nama: '',
										modal: 0,
										harga: 0,
										stok: 0,
										kategori:'',
										kategoriId:''
									});

	useEffect(()=>{
		if(snapshot){
			setForm(currentForm => ({
				...currentForm,
				...snapshot.data()
			}))
		}
	},[snapshot]);

	const [error, setError] = useState({
										nama: '',
										modal: '',
										harga: '',
										stok: '',
										kategori:'',
										kategoriId:''
									});




	const handleChange = (e) => {
		setForm({
			...form,
			[e.target.name] : e.target.value
		})

		setError({
			...error,
			[e.target.name] : ''
		})
	}

	const [kat, setKat] = React.useState('');

	const handleChangeS = (event: React.ChangeEvent<HTMLInputElement>) => {
	    setKat(event.target.value);

	    const kategoriSelected = kategoriItems.find(arr=>{
	    	return arr.id === event.target.value;
	    })	    

	    setForm({
			...form,
			['kategoriId'] : event.target.value,
			['kategori'] : kategoriSelected.nama
		})
	};


	console.log(form);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSomethingChange, setIsSomethingChange] = useState(false);

	const handleUploadFile = async (e) => {
		const file = e.target.files[0];
		setError({
			...error,
			foto: ''
		})

		if(!['image/jpeg','image/png'].includes(file.type)){
			setError({
				...error,
				foto: `Tipe file tidak didukung: ${file.type}`
			})
		}else if(file.size >= 512000){
			setError({
				...error,
				foto: 'Ukuran file terlalu besar > 500KB'
			})
		}else{
			const reader = new FileReader();
			const produkStorageRef = storage.ref(`toko/${user.uid}/produk`);
			//batal upload
			reader.onabort = () => {
				setError({
					...error,
					foto: "Proses pembacaan dibatalkan"
				})
			}
			//saat error
			reader.onerror = () => {
				setError({
					...error,
					foto: "File gagal dibaca"
				})
			}
			//saat load
			reader.onload = async () => {
				setError({
					...error,
					foto:''
				})

				setIsSubmitting(true);
				try{
					const fotoExt = file.name.substring(file.name.lastIndexOf('.'));
					const fotoRef = produkStorageRef.child(`${match.params.produkId}${fotoExt}`);
					const fotoSnapshot = await fotoRef.putString(reader.result, 'data_url');
					const fotoUrl = await fotoSnapshot.ref.getDownloadURL();
					setForm(currentForm => ({
						...currentForm,
						foto: fotoUrl
					}))
					setIsSomethingChange(true);
				}catch(e){
					setError(e=>({
						...error,
						foto: e.message
					}))
				}
				setIsSubmitting(false);
			}
			reader.readAsDataURL(file);
		}
	}

	const validate = () => {
		const newError = {...error};
		if(!form.nama){
			newError.nama = 'Nama wajib diisi';
		}
		if(!form.modal || form.modal <=0){
			newError.modal = 'Modal tidak boleh kosong';
		}
		if(!form.harga || form.harga <=0){
			newError.harga = 'Harga tidak boleh kosong';
		}else if(form.harga <= form.modal){
			newError.harga = 'Harga tidak boleh lebih kecil dari modal';
		}
		if(form.stok <0){
			newError.stok = 'stok tidak boleh lebih kecil dari kosong';
		}

		return newError;
	}

	const handleSubmit = async e => {
		e.preventDefault();
		setError({
										nama: '',
										modal: '',
										harga: '',
										stok: '',
										kategori:''
									});

		const findError = validate();
		if(Object.values(findError).some(err => err!='')){
			setError(findError);
		}else{
			try{
				setIsSubmitting(true);
				await produkDoc.set(form, {merge:true});
				enqueueSnackbar('Data berhasil tersimpan',{variant:'success'});
				setIsSubmitting(false);
			}catch(e){
				enqueueSnackbar(e.message,{variant:'error'})
			}
		}
	}

	if(loadingK || loading){
		return <AppPageLoading />
	}

	return 	<div>
				<Typography>Edit Produk: {form.nama}</Typography>
				<Grid container justify="center">
					<Grid item xs={12} sm={6}>
						<form id="produk-form" noValidate onSubmit={handleSubmit}>
							<TextField
								id="nama"
								name="nama"
								label="Nama"
								margin="normal"
								fullWidth
								required
								value={form.nama}
								onChange={handleChange}
								error = {error.nama? true:false}
								helperText = {error.nama}
								disabled={isSubmitting}
							/>
							<TextField 
							 	id="modal"
							 	name="modal"
							 	label="Modal"
							 	margin="normal"
							 	fullWidth
							 	required
							 	value={form.modal}
							 	onChange={handleChange}
							 	error = {error.modal? true:false}
								helperText = {error.modal}
								disabled={isSubmitting}
							/>
							<TextField 
							 	id="harga"
							 	name="harga"
							 	label="Harga"
							 	margin="normal"
							 	type="number"
							 	fullWidth
							 	required
							 	value={form.harga}
							 	onChange={handleChange}
							 	error = {error.harga? true:false}
								helperText = {error.harga}
								disabled={isSubmitting}
							/>
							<TextField 
							 	id="stok"
							 	name="stok"
							 	label="Stok"
							 	margin="normal"
							 	type="number"
							 	fullWidth
							 	required
							 	value={form.stok}
							 	onChange={handleChange}
							 	error = {error.stok? true:false}
								helperText = {error.stok}
								disabled={isSubmitting}
							/>
							<TextField
								id="filled-select-currency"
								select
								label="Kategori"
								name="kategori"
								margin="normal"
								value={form.kategoriId}
								onChange={handleChangeS}
								variant="filled"
								fullWidth
								required
								error = {error.kategori? true:false}
								helperText = {error.kategori}
								disabled={isSubmitting}
					        >
						        {kategoriItems.map((katData)=>{
						        	return <MenuItem key={katData.id} value={katData.id}>{katData.nama}</MenuItem>
						        })}
						         
					        </TextField>
						</form>
					</Grid>
					<Grid item xs={12} sm={6}>
						<div className={clasess.uploadFotoProduk}>
							{
								form.foto && 
								<img src={form.foto} className={clasess.previewFotoProduk}  alt={`Foto Produk $(form.nama)`}/>
							}
							<input 
									className={clasess.hideInputFile}
									type="file"
									id="upload-foto-produk"
									accept="image/jpeg, image/png"
									onChange={handleUploadFile}
							/>
							<label htmlFor="upload-foto-produk">
									<Button
										disabled={isSubmitting}
										variant="outlined"
										component="span"
									>
										Upload Foto<UploadIcon className={clasess.iconRight} />
									</Button>
							</label>
							{	
									error.foto && 
										<Typography color="error">{error.foto}</Typography>
							}
							
						</div>
					</Grid>
					<Grid item xs={12}>
						<div className={clasess.actionButtons}>
							<Button
								form="produk-form"
								type="submit"
								color="primary"
								variant="contained"
								disabled={isSubmitting}
							>
								<SaveIcon /> Simpan
							</Button>
						</div>
					</Grid>

				</Grid>
			</div>	
}

export default EditProduk;