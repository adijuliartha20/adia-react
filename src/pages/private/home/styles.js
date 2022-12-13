import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme=>({
	iconLeft: {
		marginRight: theme.spacing(1)
	},
	transaksi:{
		backgroundColor: theme.palette.background.paper,
		marginTop: theme.spacing(2)
	},
	pembayaran:{
		backgroundColor: theme.palette.background.paper,
		marginTop: theme.spacing(2),
		textAlign: 'right'
	},
	produkList: {
		backgroundColor: theme.palette.background.paper,
		marginTop: theme.spacing(2),
		maxHeight: 500,
		overflow: 'auto'
	},
	inputJumlah: {
		width: 35
	},
	accBayar: {
		marginTop: theme.spacing(2)
	},
	listKonsumen: {
		backgroundColor: theme.palette.background.paper,
		marginTop: theme.spacing(2),
		textAlign: 'center'
	},
	avatar : {
		margin: '14px auto',
	    width: '75px',
	    height: '75px'
	},
	detailInfoKonsumen: {
		margin: '10px 0',
	    fontSize: '0.9rem',
	    padding: '0 20px'
	},
	pilihKonsumen: {
	    position: 'absolute',
	    right: '5px',
	    top: '0px'	
	},
	iconKonsumen: {
	    width: '100px',
	    height: '100px',
	    color: '#ebeaea'
	}
}))

export default useStyles;