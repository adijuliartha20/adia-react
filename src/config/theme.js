import {createMuiTheme} from '@material-ui/core/styles';

import pink from '@material-ui/core/colors/pink';

const color = pink[300];

const theme = createMuiTheme({
	palette:{
		primary:{
			main: color
		},
		secondary:{
			main: '#fff'
		}
	}

});

export default theme;