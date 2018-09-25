import React from 'react';
import Loadable from 'react-loadable';
import { hydrate, render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';

import routes from './routes/app.routes';

var domRender = process.env.RENDER_TYPE === 'spa' ? render : hydrate;
var container = document.getElementById('root');

var hotRender = () => {
    domRender(
        <BrowserRouter>
        {
            renderRoutes(routes)
        }
        </BrowserRouter>,
        container
    );
};

try {
    module.hot.accept('./routes/app.routes.js', () => {
        hotRender();
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