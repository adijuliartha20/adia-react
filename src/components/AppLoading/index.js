import React from 'react';

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import useStyle from './styles';

function AppLoading(){
	const classes = useStyle();
	return (
				<Container maxWidth="xs">
					<div className={classes.loadingBox}>
						<Typography
							variant="h6"
							component="h2"
							className={classes.title}
						>
							Adia Busana Bali
						</Typography>
						<LinearProgress />
					</div>
					
				</Container>
		)
}

export default AppLoading;