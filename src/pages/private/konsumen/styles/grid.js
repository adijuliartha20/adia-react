import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme=>({
	fab: {
		position: 'absolute',
		bottom: theme.spacing(2),
		right: theme.spacing(2)		
	},
	edit: {
		padding: theme.spacing(0),
		marginRight: theme.spacing(1)
	},
	delete: {
		padding: theme.spacing(0)
	}
}));

export default useStyles;