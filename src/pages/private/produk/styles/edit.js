import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles(theme=> ({
	hideInputFile:{
		display: "none"
	},
    selectEmpty: {
      	marginTop: theme.spacing(2),
    },
    formControl:{
    	marginTop: theme.spacing(2),
    	marginBottom: theme.spacing(4),
    	width: "100%"
    },
    uploadFotoProduk: {
        textAlign: 'center',
        padding: theme.spacing(3)
    },
    previewFotoProduk: {
        width:'auto',
        maxHeight: '300px',
        display: 'flex',
        margin: '0 auto 30px auto'
    },
    iconRight:{
        marginLeft: theme.spacing(1)
    },
    iconLeft:{
        marginRight: theme.spacing(1)
    },
    actionButtons:{
        paddingTop: theme.spacing(2)
    }
}));

export default useStyles;