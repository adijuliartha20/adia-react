import React, {useState} from 'react';
import PropTypes from 'prop-types' ;
//material ui
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';


import {withRouter} from 'react-router-dom'; //untuk ambil history

function SearchDialog({history, open, handleClose}){//karena menggunakan withRouter kita dapat props history
	console.log(open)



	const[isSubmitting, setSubmitting] = useState(false);
	
	return <Dialog open={open} onClose={handleClose} disabled={isSubmitting}>
					<DialogTitle>Buat Produk Baru</DialogTitle>
					<DialogContent dividers>
						
					</DialogContent>
					<DialogActions>
						
					</DialogActions>
				</Dialog>
}


//saat dialog ini di buka harus memiliki props open dan handleClose
SearchDialog.propTypes = {
	open : PropTypes.bool.isRequired,
	handleClose : PropTypes.func.isRequired
}

export default withRouter(SearchDialog);