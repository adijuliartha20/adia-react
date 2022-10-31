import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme=>({
	paper:{
		marginTop: theme.spacing(8),
		padding: theme.spacing(6)
	},
	title:{
		textAlign: 'center',
		marginBottom: theme.spacing(3)
	},
	buttons:{
		marginTop: theme.spacing(3)
	}
}));

export default useStyles;