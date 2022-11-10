import React from 'react';
import {Switch, Route} from 'react-router-dom';

import EditProduk from './edit';
import DataPage from './data';
function Produk(){
	return (
				<Switch>
					<Route path="/admin/produk/edit/:produkId" component={EditProduk} />
					<Route component={DataPage} />
				</Switch>
		);
}

export default Produk;