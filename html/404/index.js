define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/404/index.html', '../../javascript/3rd/anime.js', '../../javascript/3rd/clipboard.js', '../../javascript/widget/tip.js', '../../javascript/3rd/cookie.js'], function(Regular, $, util, page, anime, Clipboard, tip, cookie) {    require('../../css/404.css')    return Regular.extend({        template: page    });});