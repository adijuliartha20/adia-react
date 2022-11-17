import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme=>({
	iconLeft: {
		marginRight: theme.spacing(1)
	},
	produkList: {
		backgroundColor: theme.palette.background.paper,
		maxHeight: 500,
		overflow: 'auto'
	}
}))

export default useStyles;