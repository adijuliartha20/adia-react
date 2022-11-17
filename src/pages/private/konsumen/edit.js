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



function EditKonsumen({match}){
	const clasess = useStyles();
	const {firestore, user, storage} = useFirebase();	
	const {enqueueSnackbar} =  useSnackbar();
	
	const[filter2, setFilter2] = useState('');

	const dataDoc = firestore.doc(`toko/${user.uid}/konsumen/${match.params.konsumenId}`);
	const [snapshot, loading] =  useDocument(dataDoc);
	const [form, setForm] = useState({
										nama: '',
										jenisKelamin: '',
										kecamatan: '',
										kabupaten: '',
										provinsi: '',
										negara:'',
										alamat: '',
										noTelpon:'',
										tanggalLahir:'1990-07-20',
										kenalDari:''
									});

	useEffect(()=>{
		if(snapshot){
			const dataF = snapshot.data()


			setForm(currentForm => ({
				...currentForm,
				...dataF
			}))

			if(dataF.provinsi){
				setFilter2(dataF.provinsi)
				//console.log(snapshot.data());				
			}

		}
	},[snapshot]);

	const [error, setError] = useState({
										nama: '',
										jenisKelamin: '',
										kecamatan: '',
										kabupaten: '',
										provinsi: '',
										negara:'',
										alamat: '',
										noTelpon:'',
										tanggalLahir:'',
										kenalDari:''
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


	//Grab negara
	const DataCol1 = firestore.collection(`toko/${user.uid}/negara`);
	const [snapshot1, loading1] = useCollection(DataCol1);//grab data
	const [Items1, setItems1] = useState([]);//set array kosong

	useEffect(()=>{
		if(snapshot1){
			const docs = snapshot1.docs;
			docs.map((dt)=>{
				const Data1 = dt.data();
				const newData = [];
				newData.id = dt.id;
				newData.nama = Data1.nama
				setItems1(Items1 =>[...Items1, newData]);
			})
		}
	},[snapshot1])

	const [data1, setData1] = React.useState('');


	const handleChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
	    setData1(event.target.value);
	    
	    setForm({
			...form,
			['negara'] : event.target.value
			
		})
		setError({
			...error,
			['negara'] : ''
		})
		setFilter2(event.target.value);
		setItems2(Items2 => []);
		//setNegaraId(event.target.value)
	};
	//Grab negara end

	//Grab Provinsi
	
	const DataCol2 =  firestore.collection(`toko/${user.uid}/provinsi`).where("negaraId", "==", filter2);;	
	const [snapshot2, loading2] = useCollection(DataCol2);	
	const [Items2, setItems2] = useState([]);

	useEffect(()=>{
		if(snapshot2){
			const docs = snapshot2.docs;
			docs.map((dt)=>{
				const Data1 = dt.data();
				const newData = [];
				newData.id = dt.id;
				newData.nama = Data1.nama
				setItems2(Items2 =>[...Items2, newData]);
			})
		}
	},[snapshot2])

	const [data2, setData2] = React.useState('');
	const handleChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
	    setData2(event.target.value);

	    setForm({
			...form,
			['provinsi'] : event.target.value
		})
		setError({
			...error,
			['provinsi'] : ''
		})
		setFilter3(event.target.value);
		setItems3(Items3 => []);
	};
	//Grab Provinsi End

	//Grab Kabupaten
	const[filter3, setFilter3] = useState('');
	const DataCol3 =  firestore.collection(`toko/${user.uid}/kabupaten`).where("provinsiId", "==", filter3);;	
	const [snapshot3, loading3] = useCollection(DataCol3);	
	const [Items3, setItems3] = useState([]);

	useEffect(()=>{
		if(snapshot3){
			const docs = snapshot3.docs;
			docs.map((dt)=>{
				const Data3 = dt.data();
				const newData = [];
				newData.id = dt.id;
				newData.nama = Data3.nama
				setItems3(Items3 =>[...Items3, newData]);
			})
		}
	},[snapshot3])

	const [data3, setData3] = React.useState('');
	const handleChange3 = (event: React.ChangeEvent<HTMLInputElement>) => {
	    setData3(event.target.value);

	    setForm({
			...form,
			['kabupaten'] : event.target.value
		})
		setError({
			...error,
			['kabupaten'] : ''
		})
		setFilter4(event.target.value);
		setItems4(Items4 => []);
	};
	//Grab Kabupaten End

	//Grab Kabupaten
	const[filter4, setFilter4] = useState('');
	const DataCol4 =  firestore.collection(`toko/${user.uid}/kecamatan`).where("kabupatenId", "==", filter4);;	
	const [snapshot4, loading4] = useCollection(DataCol4);	
	const [Items4, setItems4] = useState([]);

	useEffect(()=>{
		if(snapshot4){
			const docs = snapshot4.docs;
			docs.map((dt)=>{
				const Data4 = dt.data();
				const newData = [];
				newData.id = dt.id;
				newData.nama = Data4.nama
				setItems4(Items4 =>[...Items4, newData]);
			})
		}
	},[snapshot4])

	const [data4, setData4] = React.useState('');
	const handleChange4 = (event: React.ChangeEvent<HTMLInputElement>) => {
	    setData4(event.target.value);

	    setForm({
			...form,
			['kecamatan'] : event.target.value
		})
		setError({
			...error,
			['kecamatan'] : ''
		})
	};
	//Grab Kabupaten End



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
			const StorageRef = storage.ref(`toko/${user.uid}/konsumen`);
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
					const fotoRef = StorageRef.child(`${match.params.konsumenId}${fotoExt}`);
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
		if(!form.jenisKelamin){
			newError.jenisKelamin = 'Jenik kelamin wajib diisi';
		}
		if(!form.noTelpon){
			newError.noTelpon = 'No Telpon wajib diisi';
		}
		if(!form.tanggalLahir){
			newError.tanggalLahir = 'Tanggal lahir wajib diisi';
		}
		if(!form.negara){
			newError.negara = 'Negara wajib diisi';
		}
		if(!form.provinsi){
			newError.provinsi = 'Provinsi wajib diisi';
		}
		if(!form.kabupaten){
			newError.kabupaten = 'Kabupaten wajib diisi';
		}
		if(!form.kecamatan){
			newError.kecamatan = 'Kecamatan wajib diisi';
		}
		if(!form.alamat){
			newError.alamat = 'Alamat wajib diisi';
		}
		if(!form.kenalDari){
			newError.kenalDari = 'Tahu dari wajib diisi';
		}

		return newError;
	}

	const handleSubmit = async e => {
		e.preventDefault();
		setError({
										nama: '',
										jenisKelamin: '',
										kecamatan: '',
										kabupaten: '',
										provinsi: '',										
										negara:'',
										alamat: '',
										noTelpon:'',
										tanggalLahir:'',
										kenalDari:''
									});

		const findError = validate();
		if(Object.values(findError).some(err => err!='')){
			setError(findError);
		}else{
			try{
				setIsSubmitting(true);
				await dataDoc.set(form, {merge:true});
				enqueueSnackbar('Data berhasil tersimpan',{variant:'success'});
				setIsSubmitting(false);
			}catch(e){
				enqueueSnackbar(e.message,{variant:'error'})
			}
		}
	}

	if(loading){
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
								select
							 	id="jenisKelamin"
							 	name="jenisKelamin"
							 	label="Jenis Kelamin"
							 	margin="normal"
							 	fullWidth
							 	required
							 	value={form.jenisKelamin}
							 	onChange={handleChange}
							 	error = {error.jenisKelamin? true:false}
								helperText = {error.jenisKelamin}
								disabled={isSubmitting}
							>
								<MenuItem value="Perempuan">Perempuan</MenuItem>
								<MenuItem value="laki-laki">Laki-laki</MenuItem>
							</TextField>
							<TextField 
							 	id="noTelpon"
							 	name="noTelpon"
							 	label="No Telpon"
							 	margin="normal"
							 	type="number"
							 	fullWidth
							 	required
							 	value={form.noTelpon}
							 	onChange={handleChange}
							 	error = {error.noTelpon? true:false}
								helperText = {error.noTelpon}
								disabled={isSubmitting}
							/>
							<TextField 
							 	id="tanggalLahir"
							 	name="tanggalLahir"
							 	label="Tanggal Lahir"
							 	margin="normal"
							 	type="date"
							 	fullWidth
							 	required
							 	value={form.tanggalLahir}
							 	onChange={handleChange}
							 	error = {error.tanggalLahir? true:false}
								helperText = {error.tanggalLahir}
								disabled={isSubmitting}
							/>
							<TextField
								id="negara"
								select
								label="Negara"
								name="negara"
								margin="normal"
								value={form.negara}
								onChange={handleChange1}
								variant="filled"
								fullWidth
								required
								error = {error.negara? true:false}
								helperText = {error.negara}
								disabled={isSubmitting}
					        >
						        {Items1.map((data)=>{
						        	return <MenuItem key={data.id} value={data.id} label={data.nama}>{data.nama}</MenuItem>
						        })}
						         
					        </TextField>
					        <TextField
								id="provinsi"
								select
								label="Provinsi"
								name="provinsi"
								margin="normal"
								value={form.provinsi}
								onChange={handleChange2}
								variant="filled"
								fullWidth
								required
								error = {error.provinsi? true:false}
								helperText = {error.provinsi}
								disabled={isSubmitting}
					        >
						        {Items2.map((data2)=>{
						        	return <MenuItem key={data2.id} value={data2.id}>{data2.nama}</MenuItem>
						        })}
						         
					        </TextField>
					        <TextField
								id="kabupaten"
								select
								label="Kabupaten"
								name="kabupaten"
								margin="normal"
								value={form.kabupaten}
								onChange={handleChange3}
								variant="filled"
								fullWidth
								required
								error = {error.kabupaten? true:false}
								helperText = {error.kabupaten}
								disabled={isSubmitting}
					        >
						        {Items3.map((data3)=>{
						        	return <MenuItem key={data3.id} value={data3.id}>{data3.nama}</MenuItem>
						        })}
						         
					        </TextField>
					        <TextField
								id="kecamatan"
								select
								label="Kecamatan"
								name="kecamatan"
								margin="normal"
								value={form.kecamatan}
								onChange={handleChange4}
								variant="filled"
								fullWidth
								required
								error = {error.kecamatan? true:false}
								helperText = {error.kecamatan}
								disabled={isSubmitting}
					        >
						        {Items4.map((data4)=>{
						        	return <MenuItem key={data4.id} value={data4.id}>{data4.nama}</MenuItem>
						        })}
						         
					        </TextField>
					        <TextField 
							 	id="alamat"
							 	name="alamat"
							 	label="Alamat"
							 	margin="normal"
							 	fullWidth
							 	required
							 	value={form.alamat}
							 	onChange={handleChange}
							 	error = {error.alamat? true:false}
								helperText = {error.alamat}
								disabled={isSubmitting}
							/>
							<TextField 
							 	id="kenalDari"
							 	name="kenalDari"
							 	label="Tahu Dari"
							 	margin="normal"
							 	select
							 	fullWidth
							 	required
							 	value={form.kenalDari}
							 	onChange={handleChange}
							 	error = {error.kenalDari? true:false}
								helperText = {error.kenalDari}
								disabled={isSubmitting}
							>
								<MenuItem value="fb">Facebook</MenuItem>
								<MenuItem value="ig">Instagram</MenuItem>
								<MenuItem value="toko">Toko</MenuItem>
								<MenuItem value="tiktok">Tiktok</MenuItem>
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

export default EditKonsumen;