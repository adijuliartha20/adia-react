import React, {useState} from 'react';

import {Link, Redirect} from 'react-router-dom';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import useSytle from './styles';

import isEmail from 'validator/lib/isEmail';

//4. import firebase
import { useFirebase } from '../../components/FirebaseProvider';

import AppLoading from '../../components/AppLoading';


function Registrasi(){
	const classes = useSytle();

	//1. control field
	const [form, setForm] = useState({
		email:"",
		password:"",
		ulangi_password:""
	})

	//2. error
	const [error, setError] = useState({
		email:"",
		password:"",
		ulangi_password:""		
	});

	//3. submitting 
	const [isSubmitting, setSubmitting] = useState(false);

	//ingat paket kurung ini ya
	const {auth, user, loading} = useFirebase();
	
	const handleChange = e => {
		setForm({
			...form,
			[e.target.name]	: e.target.value		
		})

		setError({
			...error,
			[e.target.name] : ''
		})

		
	}

	const validate = () => {
		const newError = {...error};
		if(!form.email){
			newError.email= "Email wajib diisi";
		}else if(!isEmail(form.email)){
			newError.email= "Email tidak valid";
		}
		if(!form.password){
			newError.password= "Password wajib diisi";
		}
		if(!form.ulangi_password){
			newError.ulangi_password= "Ulangi password wajib diisi";
		}else if(form.password !== form.ulangi_password){
			newError.ulangi_password= "Ulangi password tidak sama"
		}

		return newError;
	}

	

	const handleSubmit = async e => {
		e.preventDefault();

		const findErrors = validate();
		if(Object.values(findErrors).some(err=>err!=='')){
			setError(findErrors);
		}else{
			try{
				setSubmitting(true)	
				await auth.createUserWithEmailAndPassword(form.email, form.password);
			}
			catch(e){
				const newError = {};

				switch(e.code){
					case 'auth/email-already-in-use':
						newError.email = 'Email sudah terdaftar';
						break;	
					case 'auth/invalid-email':
						newError.email = 'Email tidak valid';	
						break;	
					case 'auth/operation-not-allowed'	:
						newError.email = 'Pendaftartan email dan password belum aktif';
						break;	
					case 'auth/weak-password':
						newError.password = 'Password terlalu lemah';
						break;	
				}
				setError(newError);
				setSubmitting(false);
			}
		}

	}


	if(loading){
		return <AppLoading />
	}

	if(user){
		return <Redirect to="admin/transaksi" />
	}

	return (
		<Container maxWidth="xs">
			<Paper className={classes.paper}>
				<Typography 
					variant="h5"
					component="h1"
					className={classes.title}
				>
					Buat Akun Baru
				</Typography>

				<form onSubmit={handleSubmit} noValidate>
					<TextField
						id="email"
						name="email"
						type="email"
						label="Alamat Email"
						fullWidth
						margin="normal"
						helperText={error.email}
						error= {error.email?true:false}
						disabled={isSubmitting}
						onChange={handleChange}
						value={form.email}
					 />
					 <TextField
					 	id="password"
					 	name="password"
					 	type="password"
					 	label="Password"
					 	fullWidth
					 	margin="normal"					 	
					 	helperText={error.password}
					 	error={error.password?true:false}
					 	onChange={handleChange}
					 	value={form.password}
					 />
					 <TextField
					 	id="ulangi_password"
					 	name="ulangi_password"
					 	type="password"
					 	label="Ulangi Password"
					 	fullWidth
					 	margin="normal"					 	
					 	helperText={error.ulangi_password}
					 	error={error.ulangi_password?true:false}
					 	onChange={handleChange}
					 	value={form.ulangi_password}
					 />
					 <Grid container className={classes.buttons}>
					 	<Grid item xs>
					 		<Button
					 			type="submit"
					 			color="primary"
					 			variant="contained"
					 			size="large"
					 		>
					 			Daftar
					 		</Button>	
					 	</Grid>
					 	<Grid item>
					 		<Button 
					 			component={Link} 
					 			to="/login"
					 			variant="contained"
					 			size="large"
					 		>
					 			Login
					 		</Button>
					 	</Grid>
					 </Grid>
				</form>
			</Paper>
		</Container>
		);
}

export default Registrasi;