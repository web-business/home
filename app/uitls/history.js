
var scrollHistory = {};

export default async function onLocationChange({location, action}) {
    if(!process.env.BROWSER) return;

    scrollHistory[location.key] = {
        scrollX: window.pageXOffset,
        scrollY: window.pageYOffset,
    };

    var scrollX = 0;
    var scrollY = 0;
    var pos = scrollHistory[location.key];
    if (pos) {
        scrollX = pos.scrollX;
        scrollY = pos.scrollY;
    } else {
        
    }
console.log(action)
    if(action === 'PUSH') {
        console.log('新开页面');
    } else if(action === 'POP') {
        console.log('返回页面');
    }

    window.scrollTo(scrollX, scrollY);
};