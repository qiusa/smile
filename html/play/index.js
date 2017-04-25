define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/play/index.html', '../../html/play/wap.html', '../../javascript/widget/tip.js', '../../javascript/3rd/cookie.js', '../../javascript/base/const.js', '../../javascript/3rd/md5.js', '../../javascript/widget/playFlash/index.js', '../../res/wapplayer/player.js', '../../javascript/3rd/flexible.js'], function(Regular, $, util, index, wapindex, tip, cookie, api, md5, playFlash, players) {    require('../../css/play.css');    require('../../css/playwap.css');    require('../../css/flash.css');    require('../../css/page.css');    return Regular.extend({        template: util.isPc() ? index : wapindex,        data: {            //登陆账户密码            user: {                email: '',                pwd: '',                verifyCode: '' //图片验证码            },            config: {},            renderConfig: {                pageId: '',                password: ''            },            cameraData: {},            show: {                check: true,                errmsg: ''            }        },        init: function() {            this.initCtrol();            this.getData();            this.render();        },        /**         * 初始化控件         */        initCtrol: function() {            //提示框            this.tip = util.tip();        },        getData: function() {            this.data.renderConfig.pageId = util.getQueryString('id');        },        /**         * 插入直播         */        initPlay: function(param) {            if (util.isPc()) {                if (!this.playHere) {                    this.playHere = new playFlash({                        param: param,                        url: api.LIVEWEB.play                    });                    this.playHere.$inject(this.$refs.playHere);                }            } else {                var self = this;                var videoPlayerModule = new players({                    data: {                        param: param,                        url: api.LIVEWEB.play,                        // regularObj:self,                        regCameraDetail:self,                        page: /(channel\?)/, // 正则表达式 问号结尾是为了过滤掉 event? 和 events?的这个种情况                    }                });                videoPlayerModule.$inject(this.$refs.playHere);            }                        },        render: function() {            console.info(99999, api.LIVEWEB.init)            if (!this.data.renderConfig.pageId) {                window.location.href = './404.html';                return;            }            var self = this;            //获取直播页面信息            util.rest(api.LIVEWEB.init, {                param: {                    pageId: this.data.renderConfig.pageId                },                method: 'post',                onload: function(data) {                    console.info('成功', data);                    data.title ? document.title = data.title : '';                    self.data.config = data;                    self.$update();                    if (data.isEncrypt == 0) { //如果没有加密直接获取直播接口                        self.enterPwd();                    }                },                onerror: function(data) {                    console.info('牺牲', data);                    if (data.code == 17) { //页面不存在                        //window.location.href = './404.html';                    }                }            })        },        /**         * 密码确认         * @param  {Boolean} isEncrypt 是否加密         */        enterPwd: function(isEncrypt) {            var self = this,                param = {                    pageId: this.data.renderConfig.pageId,                    platform: util.isPc() //0:web(hls) 1:PC(rtmp)                };            if (isEncrypt) {                console.info(999, this.data.renderConfig.password)                if (!util.trim(this.data.renderConfig.password)) {                    return;                }                param.password = md5(util.trim(this.data.renderConfig.password));            }            util.rest(api.LIVEWEB.play, {                param: param,                method: 'post',                onload: function(data) {                    console.info('成功', data);                    self.data.config = data;                    self.initPlay(param);                    self.$update();                },                onerror: function(data) {                    console.info('牺牲', data);                    var data = {                        flvUrl: "http://flv1e73ceec.live.126.net/live/0ec74ec3d7d240c8a778c25e4c220ea0.flv?netease=flv1e73ceec.live.126.net",                        hlsUrl: "http://pullhls1e73ceec.live.126.net/live/0ec74ec3d7d240c8a778c25e4c220ea0/playlist.m3u8",                        rtmpUrl: "rtmp://v1e73ceec.live.126.net/live/0ec74ec3d7d240c8a778c25e4c220ea0"                    }                    if (data.code == 17) { //页面不存在                        //window.location.href = './404.html';                    }                }            })        }    });});