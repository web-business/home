import React from 'react';
import Loadable from 'react-loadable';
import { BrowserRouter, Router } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import render from './uitls/render';
import routes from './routes/app.routes';

var container = document.getElementById('root');

var hotRender = (nextRoutes) => {
    render(
        <BrowserRouter>
        {
            renderRoutes(nextRoutes || routes)
        }
        </BrowserRouter>,
        container
    );
};

try {
    module.hot.accept('./routes/app.routes.js', () => {
        hotRender(require('./routes/app.routes').default);
    });
} catch(err) {
    if(process.env.NODE_ENV === 'development') {
        throw new Error(err);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if(process.env.RENDER_TYPE === 'spa') {
        hotRender();
        return;
    }
    
    Loadable.preloadReady().then(() => {
        hotRender();
    });
});
