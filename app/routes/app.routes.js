import React from 'react';
import Loadable from 'react-loadable';

import Root from './Root';
import Loading from '../components/Loading';

var Home = Loadable({
    loader: () => import(/* webpackChunkName: 'home' */ './home'),
    loading: Loading
});

var ContactUs = Loadable({
    loader: () => import(/* webpackChunkName: 'contact' */ './contact'),
    loading: Loading
});

export default [{
    component: Root,
    routes: [
        {
            path: '/',
            component: Home,
            exact: true
        },
        {
            path: '/contact',
            component: ContactUs
        }
    ]
}];