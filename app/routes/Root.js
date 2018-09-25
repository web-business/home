import React from 'react';
import { renderRoutes } from 'react-router-config';

export default (props) => {
    var { route } = props;

    return (
        <div>
            <div className="nav">
                导航部分
            </div>
            <div className="app-content">
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