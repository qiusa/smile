/** * 我的摄像机-云储存查看 */define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/mycloud/index.html', '../../javascript/3rd/anime.js', '../../javascript/3rd/clipboard.js', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js', '../../html/sliderbar/index.js', '../../javascript/widget/pager/pager.js', '../../javascript/widget/videoPlay.js'], function(Regular, $, util, index, anime, Clipboard, tip, dialog, sliderbar, pager, videoPlay) {    require('../../css/mycloud.css');    return Regular.extend({        template: '<sliderbarTpl pro = {user}>' + index + '</sliderbarTpl>',        data: {            //登陆账户密码            user: {                nick: '游客考拉',                icon: '',                type: 2//左侧导航栏模块标识            },            show: {                nav: 1,            },            record: [{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            },{                time: '19:22:11-22:22:11'            }]        },        init: function() {            this.initCtrol();            var self = this;                    },        /**         * 初始化控件         * @return {} [description]         */        initCtrol: function() {            //提示框            this.tip = new tip();            this.tip.$inject('body');        },        renderVideo: function() {            var url = 'http://nos.netease.com/smartcamera/qingguo_1491300530030_1491300595862_274481050-00000.mp4?NOSAccessKeyId=1faa1d9d8a7b427788c2c44af518cf3c&Expires=1506852751&Signature=lkWWbEguJt7SXAD3%2BtTnULjM%2BXuWxHDz7K0fjKdOE%2BA%3D';            var video = new videoPlay({                data: {                    url: url                }            });            video.$inject('body');        },        /**         * 导航切换         * @param  {NUmber} index 点击的导航序号         */        nav: function(index) {            this.data.show.nav = index;            this.$update();        },        /**         * 收起展开         */        showCloud: function(event) {            if (Regular.dom.hasClass(event.origin.parentElement.parentElement, 'cloud-show')) {                Regular.dom.delClass(event.origin.parentElement.parentElement, 'cloud-show');            } else {                Regular.dom.addClass(event.origin.parentElement.parentElement, 'cloud-show');            }        },        /**         * 操作显示列表         */        onShow: function(event) {            Regular.dom.addClass(event.origin, 'live');        },        /**         * 操作隐藏列表         */        onHide: function(event) {            Regular.dom.delClass(event.origin, 'live');        },        /**         * 选中设备         */        check: function(index) {            console.info('index',index)            this.data.dataList[index].checkbox = this.data.dataList[index].checkbox ? false : true;            this.$update();        },        /**         * 编辑设备名称         */        edit: function(event) {            console.info(event)            event.origin.style.display = 'none';            event.origin.nextElementSibling.style.display = 'block';        },        /**         * 隐藏编辑设备名称         */        hide: function(event) {            console.info(222)            event.origin.parentElement.style.display = 'none';            event.origin.parentElement.previousElementSibling.style.display = 'block';        }    });});