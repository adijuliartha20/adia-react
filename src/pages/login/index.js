import React, {useState} from 'react';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {Link, Redirect} from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';

import {useFirebase} from '../../components/FirebaseProvider';
import AppLoading from '../../components/AppLoading';


import useStyles from './styles';


/*
	1. Styling
	2. Set form & change
	3. Set Error (aktifkan form no validate biar helper text aktif)
	4. Set validate
	5. Loading
	6. Submit
*/

function Login(props){
	const classes = useStyles();

	const [form, setForm] = useState({
		email:'',
		password:''
	})

	const [error, setError] = useState({
		email:'',
		password:''
	});

	const handleChange = e => {
		setForm({
			...form,
			[e.target.name] : e.target.value
		})

		setError({
			...error,
			[e.target.name] : ''
		})
	}

	const validate = () => {
		const newErrors = {...error};

		if(!form.email){
			newErrors.email = 'Email wajib diisi';
		}else if(!isEmail(form.email)){
			newErrors.email = 'Email tidak valid';
		}
		if(!form.password){
			newErrors.password = 'Password wajib diisi';
		}

		return newErrors;
	}

	const [isSubmitting, setSubmitting]= useState(false);
	const {auth, user, loading} = useFirebase();

	const handleSubmit = async e => {
		e.preventDefault();

		const findErrors = validate();

		if(Object.values(findErrors).some(err=>err!=='')){
			setError(findErrors);
		}else{			
			try{
				setSubmitting(true);
				await auth.signInWithEmailAndPassword(form.email, form.password);
			}catch(e){
				const newErrors = {};

				switch(e.code){
					case 'auth/user-not-found':
						newErrors.email = 'Email tidak terdaftar';
						break;
					case 'auth/invalid-email':
						newErrors.email = 'Email tidak valid';
						break;
					case 'auth/wrong-password':
						newErrors.password = 'Password salah';
						break;
					case 'auth/user-disabled':
						newErrors.email = 'Akun dinonaktifkan, silahkan hubungi admin';
						break;
					default:
						newErrors.email = 'Terjadi kesalahan, silahkan coba lagi';	
						break;							
				}

				setError(newErrors);
				setSubmitting(false);
			}
		}
	}

	if(loading){
		return <AppLoading />
	}


	//auth.signOut();
	const {location} = props;
	if(user){
		const redirectTo = location.state && location.state.from && location.state.from.pathname? location.state.from.pathname : '/admin/transaksi';
		return <Redirect to={redirectTo} />
	}

	return (
		<Container maxWidth="xs">
			<Paper className={classes.paper}>
				<div>
					<Typography
						variant="h5"
						component="h1"
						className={classes.title}
					>
						Login
					</Typography>
					<form onSubmit={handleSubmit} noValidate>
						<TextField 
							id="email"
							name="email"
							label="Email"
							fullWidth
							margin="normal"
							required
							value={form.email}
							helperText={error.email}
							error={error.email?true:false}
							onChange={handleChange}
							disabled={isSubmitting}
						/>
						<TextField 
							id="password"
							name="password"
							label="Password"
							type="password"
							fullWidth
							margin="normal"
							required
							value={form.password}
							helperText={error.password}
							error={error.password?true:false}
							onChange={handleChange}
							disabled={isSubmitting}
						/>
						<Grid container className={classes.buttons}>
							<Grid item xs>
								<Button 
									type="submit"
									variant="contained"
									color="primary"
									size="large"
									disabled={isSubmitting}
								>
									Login
								</Button>
							</Grid>
							<Grid item>
								<Button
									component={Link}
									to="/registrasi"
									variant="contained"
									size="large"
									disabled={isSubmitting}
								>
									Daftar
								</Button>
							</Grid>
						</Grid>
					</form>
				</div>				
			</Paper>
		</Container>
		);
}

export default Login;