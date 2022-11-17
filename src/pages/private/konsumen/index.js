import React from 'react';
import {Switch, Route} from 'react-router-dom';

import EditKonsumen from './edit';
import DataPageKonsumen from './data';
function Produk(){
	return (
				<Switch>
					<Route path="/admin/konsumen/edit/:konsumenId" component={EditKonsumen} />
					<Route component={DataPageKonsumen} />
				</Switch>
		);
}

export default Produk;