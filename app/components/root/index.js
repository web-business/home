import React from 'react';
import { renderRoutes } from 'react-router-config';

import NavBar from '../NavBar';
import navs from '../../consts/nav';
// import './root.less';

export default (props) => {
    var { route } = props;

    return (
        <div className="app-container">
            <div className="app-content">
                <div className="nav">
                    <NavBar data={navs}></NavBar>
                </div>
            {
				renderRoutes(route.routes)
			}
            </div>
            <div className="app-footer">
                页面底部
            </div>
        </div>
    );
};