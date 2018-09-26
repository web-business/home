import { hydrate, render } from 'react-dom';

var domRender = null;

if(process.env.RENDER_TYPE === 'spa') {
    domRender = render;
} else if (window.location.pathname.startsWith('/index.html')) {
    domRender = render;
} else {
    domRender = hydrate;
}

export default domRender;