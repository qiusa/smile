/*******************************************************************************
 * 播放器封装 @hzyangyang2015
 * 1. 整个模块为regular对象，使用时，引用该模块并初始化，离开模块式，销毁模块即可
 ******************************************************************************/
define([
    'regularjs',
    './player.html',
    '../../javascript/base/util.js'
    //'../module/rest.js',
    // '{pro}base/util.js',
], function(Regular, template, util){
    require('./index.css');
    var videoPlayer = Regular.extend({
        template: template,
        data: {
            page: null,//页面hash
            deviceId: null,// 摄像机ID
            // 摄像机相关信息
            deviceState: { //device数据需要与模块reg进行通信,本对象内部仅仅用于离线显示，其他数据均无用，
                loadFlag: true, // 当为该状态的时候，显示页面正在加载
                deviceFlag: 1, // 1正常，-1摄像机失效
                commentFlag: 0, //0不能评论 1可评论
                //设置相应的显示效果
                idotmsg: "在线", // 提示消息(离线、在线)
                idotimg: "/live/res/wap/channel/icon_online_dot.png",
                idotOnlineimg: "/live/res/wap/channel/icon_online_dot.png",
                idotOfflineimg: "/live/res/wap/channel/icon_offline_dot.png",
                //摄像机失效页面
                unValidimg: "/live/res/wap/channel/uvalid.png",
            },
            //浏览器类型检测，如果是PC的话禁止播放，自动切换到PC版对应页面
            platForm: {
                isDesktop: false,
                isMobile: false,
                isAndroid: false,
                isWinphone: false,
                isIOS: false,
                inYixin: false,
                inWeixin: false,
                inWeibo: false,
                inSafari: false,
            },
            // 播放器状态
            videoState: {
                clickwantplay: false, // 用户是否请求播放
                bhearting: false, // 是否正在进行心跳检测
                bloading: false, // 是否正在进行加载
                lastErrormsg: "", // 错误信息，当错误信息非时提示错误信息，禁止播放
                playCheck: null, //定时器for视频状态检测
                canReconnect:true,
                reconnectTime:10,
                reconnectCount: 0,
                firstConnect: true
            },
            //播放按钮、加载控制
            control: {
                flag: true, //播放控制状态
                bgimg: "", // 读取摄像机detail时加载
                bgimgShow:"",
                loading_bgimg:"/live/res/wap/channel/loadingbgimg.jpg",
                defaultimg :"/live/res/wap/common/load.png",
                playimg: "/live/res/wap/channel/icon_play.png",
                pausedimg: "/live/res/wap/channel/icon_paused.png",
                loadingimg: "/live/res/wap/channel/icon_loading.png",
                startloading: "/live/res/wap/channel/loading.png",
                videoGif: "/live/res/wap/channel/video.gif",
                status: 0
            },
            //  视频展示数据
            videoData: {
                urlReg:"http://v.smartcamera.163.com/qingguo-public/deviceId/playlist.m3u8",
                urlRegPrivate:"http://v.smartcamera.163.com/qingguo-private/deviceId/playlist.m3u8",
                flag: true,
                firstFlag: true,
                playUrl: "",
                hlsUrl: "",
                rtmpUrl: "",
            },
            // 各种定时器
            timerHandle: {
                heart:null, // 心跳检测定时器
            },
            // 播放埋点相关数据
            maidian:{
                playFlag: false, // 视频是否被播放过
                startTime: 0, // 当播放器启动触发时，获取当前时间戳
                currentTime: 0, // 暂停或者离开页面时，获取当前时间戳
            },
            //广告相关数据
            adDate:{
                show: true,//广告是否显示
                count: 4,
                timerHandle:null,//定时器
                data:[],
                ads: {}
            },
        },
        /*********************************************************************
         * [console_log 手机调试窗口]
         * @param  {[object]} obj [显示信息对象]
         * @return {Void}
         ********************************************************************/
        console:function(obj){
            var msg = '';
            if(typeof(obj) === "object"){
                for(var item in obj){
                    var element = item + " : " + obj[item] + "\n";
                    msg += element;
                }
            }else{
                msg = obj;
            }
            if(!document.getElementById('consoleLog')){
                $('<div>').attr("id","consoleLog").attr("class","n-console").appendTo($("body"));
            }
            c = document.getElementById("consoleLog");
            if(c){
                c.innerText = msg;
            }
        },
        init: function(){
            this.initPlatform();//初始化UA
            this.initData();
            //this.initAdDate();//初始化广告数据
            this.initVideoData(1);
            this.$update();
        },
        // 初始化 分发new传入的data数据regCameraDetail
        initData: function(){
            //regular对象被销毁后，会保留data对象的最后场景
            //当第二次new 一个regular对象的时候，所使用的数据直接基于上一次销毁时候的场景
            //例如，初始的data.a=4 第一次使用后data.a=0, 这个时候销毁对象，下次new该对象的时候，初始data.a=0，而不是4
            //基于上述原因，需要重置所有数据到初始状态
            
            // this.data.page 在new时传入
            // this.data.deviceId 在new时传入

            this.data.deviceState.loadFlag = true;
            this.data.deviceState.deviceFlag = 1;
            this.data.deviceState.commentFlag = 0;

            this.data.videoState.clickwantplay = false;
            this.data.videoState.bhearting = false;
            this.data.videoState.bloading = false;
            this.data.videoState.lastErrormsg = "";
            this.data.videoState.playCheck = null;
            this.data.videoState.canReconnect = true;
            this.data.videoState.reconnectTime = 10;
            this.data.videoState.reconnectCount = 0;
            this.data.videoState.firstConnect = true;

            this.data.control.flag = true;
            this.data.control.status = 0;
            /*this.data.control.bgimg = this.data.regCameraDetail.data.cameraData.cameraDetail.coverFileName;
            this.data.control.bgimgShow = this.data.regCameraDetail.data.cameraData.cameraDetail.coverFileName;*/

            this.data.videoData.flag = true;
            this.data.videoData.firstFlag = true;
            /*this.data.videoData.playUrl = this.data.videoData.urlReg.replace(/(deviceId)/,this.data.deviceId);
            this.data.videoData.hlsUrl = this.data.videoData.urlReg.replace(/(deviceId)/,this.data.deviceId);
            this.data.videoData.rtmpUrl = this.data.videoData.urlReg.replace(/(deviceId)/,this.data.deviceId);*/

            this.data.timerHandle.heart = null;

            this.data.maidian.playFlag = false;
            this.data.maidian.startTime = 0;
            this.data.maidian.currentTime = 0;

            this.data.adDate.show = true;
            this.data.adDate.count = 4;
            this.data.adDate.timerHandle = null;
            this.data.adDate.data = [];
            this.data.adDate.ads = {};
        },
        adMaidian: function(type){
            console.log("ad maidian:"+type);
            console.log('wap_AD_' + this.data.adDate.ads.id);
            console.log('wap_channel_' + this.data.deviceId);
            switch(type){
                case 1:op='展示_';break;
                case 2:op='关闭_';break;
                case 3:op='点击_';break;
            }
            if(/(channel\?)/.test(location.hash)){
                _gaq.push(['_trackEvent','wap_AD','wap_AD_' + op + this.data.adDate.ads.id, 'wap_channel_' + this.data.deviceId]);
            }else if(/(talent\?)/.test(location.hash)){
                _gaq.push(['_trackEvent','wap_AD','wap_AD_' + op + this.data.adDate.ads.id, 'wap_talent_' + this.data.deviceId]);
            }
        },
        //关闭广告
        closeAd : function(){
            this.adMaidian(2);
            this.data.adDate.count = 0;
            this.data.adDate.show = false;
            //清除定时器
            if (!!this.data.adDate.timerHandle) {
                clearInterval(this.data.adDate.timerHandle);
                this.data.adDate.timerHandle = null;
            }
            this.toolStartPlaying();//开始播放
            this.$update();
        },
        //前往广告
        gotoAd : function(){
            this.adMaidian(3);
            this.data.adDate.count = 0;
            this.data.adDate.show = false;
            //清除定时器
            if (!!this.data.adDate.timerHandle) {
                clearInterval(this.data.adDate.timerHandle);
                this.data.adDate.timerHandle = null;
            }
            this.$update();
        },
        /***********************************************************************
         * [initPlatform 初始化广告信息]
         * @return {[void]}
         **********************************************************************/
        initAdDate:function(){
            var self = this;
            var adDate = self.data.adDate;
            // 目前仅仅考虑在这两个模块下面投放广告(过滤其它模块，不投放广告)
            if(!/m\/channel/.test(location.hash) && !/m\/event/.test(location.hash) && !/m\/talent/.test(location.hash)){
                return;
            }
            if (adDate.count === 0) {
                return;
            }
            //投放广告筛选
            function setAdDate(type){
                //type==2时，为window.liveAdDates赋值（初次应该未经过位置过滤）
                if(type==2){
                    window.liveAdDates = [];

                    //''.indexof('')=-1  'abc'.indexof('')=0
                    for (var i = 0; i < adDate.data.length; i++) {
                        // 筛选符合条件的广告，因后台数据缓存和windowd.liveAdDates缓存可能会出现数据暂时过期问题，暂不校验
                        if(!window.camAddress || !adDate.data[i].area || window.camAddress.indexOf(adDate.data[i].area)>=0){
                            window.liveAdDates.push(adDate.data[i]);
                            if(window.camAddress)
                                window.adsLocationFilter = true;//表示广告已经通过定位过滤
                        }
                    }
                }
                //当且仅当对象存在，且未被定位信息过滤时，且定位信息已经获取到了的时候，重新对windows广告进行过滤
                if(window.liveAdDates && !window.adsLocationFilter && window.camAddress){
                    var tmp = [];
                    for (var i = 0; i < window.liveAdDates.length; i++) {
                        // 筛选符合条件的广告，因后台数据缓存和windowd.liveAdDates缓存可能会出现数据暂时过期问题，暂不校验
                        if(!window.liveAdDates[i].area || window.camAddress.indexOf(window.liveAdDates[i].area)>=0){
                            tmp.push(window.liveAdDates[i]);
                        }
                    }
                    window.liveAdDates = tmp;
                    window.adsLocationFilter = true;//表示广告已经通过定位过滤
                    console.log(window.liveAdDates);
                }
                if(window.liveAdDates && window.liveAdDates.length>0){
                    //计算随机数范围
                    var randomTotal = 0;
                    for (var i = 0; i < window.liveAdDates.length; i++) {
                        randomTotal += window.liveAdDates[i].probability;
                    }
                    //生成随机数
                    var chooseRandom = Math.ceil(randomTotal*Math.random());
                    //根据随机数选择广告
                    for (var i = 0; i < window.liveAdDates.length; i++) {
                        if(chooseRandom > window.liveAdDates[i].probability){
                            chooseRandom -= window.liveAdDates[i].probability;
                        }else{
                            adDate.show = true;//显示广告
                            adDate.ads = window.liveAdDates[i];//广告数据
                            adDate.count = adDate.ads.adDuration;//广告持续时间
                            imageLoad(adDate.ads.adUrl);
                            return;
                        }
                    }
                }else{
                    adDate.show = false;
                    adDate.count = 0;
                }
            }
            // 图片加载检测
            function imageLoad(url){
                var obj = new Image();
                obj.src = url;
                obj.onload = function(){
                    self.adMaidian(1);
                    self.$update();
                    countDown();//启动定时器
                };

            }
            // 广告倒计时
            function countDown(){
                //需要考虑意外退出的情况下，定时器是否会报错
                if (adDate.timerHandle) {
                    clearInterval(adDate.timerHandle);
                    adDate.timerHandle = null;
                }
                adDate.timerHandle = setInterval(function(){
                    adDate.count--;
                    if (adDate.timerHandle  && adDate.count<=0) {
                        clearInterval(adDate.timerHandle);
                        adDate.count = 0;
                        adDate.timerHandle = null;
                    }
                },1000);
                // 定时器不存储的时候，可能导致定时任务意外中断，无法清除定时器(单页页面有影响)
                // setTimeout(function(){
                //     adDate.count--;
                //     self.$update();
                //     if(adDate.count === 0 ){
                //         return;
                //     }else{
                //         setTimeout(arguments.callee,1000);
                //     }
                // },1000);
            }
            // 交互逻辑：1、window.liveAdDates对象是否存在，存在直接使用；不存在，后台获取数据，
            //           2、对获取到的数据，根据地图api接口进行匹配，筛选符合条件的数据，并存入window.liveAdDates
            //           3、对window.liveAdDates中的数据进行概率筛选，选中正在投放广告进行投放
            if(!!window.liveAdDates){
                setAdDate(1);
            }else{
                rest.getLiveAds(function(data){
                    //如果用户允许且能获取到百度地图API定位
                    adDate.data = data.result;
                    self.$update();
                    if(!adDate.data  ||  adDate.data.length === 0){
                        // 没有广告数据
                        adDate.count=0;
                        adDate.show=false;
                        self.$update();
                        return;
                    }else{
                        setAdDate(2);
                    }
                },function(){
                    adDate.count=0;
                    adDate.show=false;
                    self.$update();
                    return;
                });
            }
        },
        /***********************************************************************
         * [initPlatform 初始化平台浏览器信息]
         * @return {[void]}
         **********************************************************************/
        initPlatform: function() {
            var ua = navigator.userAgent;
            var platForm = this.data.platForm;
            platForm.isMobile = /Mobile|MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent);
            platForm.isIOS = /iPhone|iPad/i.test(ua);
            platForm.isAndroid = /Android/i.test(ua);
            platForm.isWinphone = /Windows Phone/i.test(ua);
            platForm.isDesktop = !platForm.isMobile;
            // platForm.inSafari = /Safari/i.test(ua);
            platForm.inYixin = /Yixin/i.test(ua);
            platForm.inWeixin = /micromessenger/i.test(ua);
            platForm.inWeibo = /weibo/i.test(ua);
            platForm.inSafari = /Safari/i.test(ua);
            platForm.isIphone = /iphone/i.test(ua);
            platForm.isIpad = /ipad/i.test(ua);
            platForm.isQQBrowser = /MQQBrowser/i.test(ua);  //安卓下包括微信，QQ，QQBrowser
            platForm.isUCBrowser = /UCBrowser/i.test(ua);
            platForm.isMZBrowser = /MZ-MX/i.test(ua);
            // console.log(platForm);
            this.fixCompatibility(1); //根据ua判断，初始化隐藏某些video;
        },
        /***********************************************************************
         * aos和ios下 兼容性bugfix
         * @param       {Number}            typ             video 显示控制
         * @option                          1               隐藏video
         * @option                          2               显示video
         * @option                          3
         **********************************************************************/
        fixCompatibility: function(typ){
            var platForm = this.data.platForm;
            if(typ  == 1)
                var compatibility = "none";
            else
                var compatibility = "block";
            var videoc = document.getElementById("videoc");
            if(!videoc) return;
            if(platForm.isIphone){
                // fix QQBrowser video定位bug;
                if(platForm.isQQBrowser){
                    videoc.style.display = compatibility;
                }
            }
            if(platForm.isAndroid){
                // QQBrowser video z-index不能设置导致的相关问题
                if(platForm.isQQBrowser){
                    // 如果开启此处，会导致QQ浏览器开启全屏状态
                    // videoc.style.display = compatibility;
                }else if(platForm.isUCBrowser){
                // UCBrowser video z-index不能设置导致的相关问题
                    videoc.style.display = compatibility;
                }else{
                    // 厂商自带浏览器均大都输入chrome内核
                    // videoc.style.display = compatibility;
                    document.getElementById("vdoxxx").style.height = document.body.clientWidth*18/32 + "px";
                }
            }
            this.$update();
        },
        /**********************************************************************
         * 在线&离线切换开关.
         * @param       {Number}            typ             0:离线 1:在线.
         **********************************************************************/
        toolOnlineSwictch: function(type) {
            if(type == 1){
                this.data.deviceState.idotmsg = "在线";
                this.data.deviceState.idotimg = this.data.deviceState.idotOnlineimg;
            }else{
                this.data.deviceState.idotmsg = "离线";
                this.data.deviceState.idotimg = this.data.deviceState.idotOfflineimg;
            }
            this.$update();
        },
        /**********************************************************************
         * 播放控制的显示.
         * @param       {Number}            typ             播放控制状态.
         * @option                          -1              不能播放.
         * @option                          0               未进行播放.
         * @option                          1               尝试播放.
         * @option                          2               正在播放.
         **********************************************************************/
        toolControlStyle: function(typ) {
            var control = document.getElementById("controls");
            if(!control) return;
            if (typ != undefined) {
                switch (typ) {
                    case -1:{
                        control.style.display = 'block';
                        control.className = "control s-1";
                        this.data.control.status = -1;
                        break;
                    }
                    case 0:{
                        control.style.display = 'block';
                        control.className = "control s0";
                        this.data.control.status = 0;
                        break;
                    }
                    case 1:{
                        control.style.display = 'block';
                        control.className = "control s1";
                        this.data.control.status = 1;
                        break;
                    }
                    case 2:{
                        control.style.display = 'none';
                        control.className = "control s2";
                        this.data.control.status = 2;
                        break;
                    }
                }
            }
            if (typ == undefined) {
                if (control.className == "control s-1") {
                    return -1;
                }else if (control.className == "control s0") {
                    return 0;
                }else if (control.className == "control s1") {
                    return 1;
                }else if (control.className == "control s2") {
                    return 2;
                }
            }
        },
        /***********************************************************************
         * 显示一个通用提示并自动隐藏. 提示可显示事件为3s
         * @param   {String}                msg     通用提示的文案.
         * @return  {Void}
         **********************************************************************/
        tipshow : function(msg) {
            var n = document.getElementById("errmsg");
            // 如果是UC浏览器，提示信息需要下降一点
            var classname = this.data.platForm.isUCBrowser? "u-msg u-msg-pd" : "u-msg";
            n.className = classname;
            n.innerText = msg;
            setTimeout(function(){
                n.className = "u-msg u-dn";
                n.innerText = "";
            }, 3000);
        },
        /***********************************************************************
         * 播放器埋点
         * @param   {String}                type     1、启动 2、暂停 3、离开页面
         * @return  {Void}
         **********************************************************************/
        toolPlayMaiDian: function(type){
            var maidian = this.data.maidian;
            if(type == 1){
                maidian.playFlag = true;
                maidian.startTime = new Date().getTime();
            }else{
                // type==3时，需要验证是否点击过播放，且当前时刻处于播放状态
                var type3 = maidian.playFlag && maidian.startTime;
                if(type == 2 || type3){
                    maidian.currentTime = new Date().getTime();
                    var playTime = (maidian.currentTime - maidian.startTime)/60000;
                    if(playTime<=1){
                        var playType = 'wap_watchTime<1min';
                    }else if (playTime<=5){
                        var playType = 'wap_watchTime1-5min';
                    }else if (playTime<=10){
                        var playType = 'wap_watchTime5-10min';
                    }else if (playTime<=30){
                        var playType = 'wap_watchTime10-30min';
                    }else{
                        var playType = 'wap_watchTime>30min';
                    }
                    _gaq.push(['_trackEvent','wap_live',playType, 'watchTime']);
                    maidian.startTime = 0;// 设置为0,表示暂停之后没有开始播放
                }
            }
            this.$update();
        },
        /***********************************************************************
         * 停止播放，重新初始化播放器.
         * @param
         * 1、替换loading背景图
         * 2、置背景界面为停止播放状态
         * 3、清空错误信息
         * 3、置点击播放状态为true
         * 4、开始loading加载界面，并启动播放
         **********************************************************************/
        toolStopPlaying: function(errmsg) {
            var self = this;
            self.toolPlayMaiDian(2); // 暂停播放埋点
            self.data.control.bgimgShow=self.data.control.bgimg;
            self.toolControlStyle(0);
            self.data.videoState.clickwantplay = false;
            // self.data.videoState.lastErrormsg = "";
            self.fixCompatibility(1); // 视频停止时，检测ua并隐藏某些video;
            var video = self.$refs.vdoxxx;
            if (video) {
                if (!video.paused) {
                    video.pause();
                }
                if(self.data.videoState.lastErrormsg){
                    // 如果上一次请求失败的情况下，才重新拉数据,不需要更新播放器地址，initVideoData中如果检测私有流地址会跟换流地址
                    // self.data.videoData.playUrl = "";
                    // self.data.videoData.hlsUrl = "";
                    // self.data.videoData.rtmpUrl = "";
                    self.initVideoData();
                }
            }
            errmsg ? self.tipshow(errmsg) : 0;
            self.$update();
        },
        toolStopPlaying2: function(errmsg) {
            var self = this;
            self.toolPlayMaiDian(2); // 暂停播放埋点
            self.data.videoState.clickwantplay = false;
            // self.data.videoState.lastErrormsg = "";
            self.fixCompatibility(1); // 视频停止时，检测ua并隐藏某些video;
            var video = self.$refs.vdoxxx;
            if (video) {
                // if (!video.paused) {
                    video.pause();
                // }
                if(self.data.videoState.lastErrormsg){
                    // 如果上一次请求失败的情况下，才重新拉数据
                    // self.data.videoData.playUrl = "";
                    // self.data.videoData.hlsUrl = "";
                    // self.data.videoData.rtmpUrl = "";
                    self.initVideoData();
                }
            }
            errmsg ? self.tipshow(errmsg) : 0;
            self.$update();
        },
        /***********************************************************************
         * 启动播放
         * 1、替换loading背景图
         * 2、如果有错误信息，停止播放，弹出错误提示
         * 3、置点击播放状态为true
         * 4、开始loading加载界面，并启动播放
         **********************************************************************/
        toolStartPlaying: function(errmsg) {
            var self = this;
            self.toolPlayMaiDian(1); // 启动播放埋点参数设置
            var platForm = this.data.platForm;
            var video = self.$refs.vdoxxx;
            if(!video) return;
            self.data.videoState.clickwantplay = true;
            if (self.data.platForm.isDesktop) {
                return;
            }
            if (self.data.videoState.lastErrormsg) {
                self.toolStopPlaying(self.data.videoState.lastErrormsg);
                return;
            }
            /**
             * 此处区分两种操作系统IOS  &&  AOS，每种状态包含两种启动方式
             * 1、直接播放没有加载动画（适用于被浏览器播放器劫持，无法获取状态）
             * 2、没有被浏览器劫持，启动时候有加载loading
             */
            // self.tipshow(navigator.userAgent);
            if(platForm.isIOS){
                if(platForm.isQQBrowser || platForm.isUCBrowser){
                    if(video.paused) video.play();
                }else{
                    self.data.control.bgimgShow=self.data.control.loading_bgimg;
                    self.$update();
                    self.fixCompatibility(2); // Fix兼容性引起的video隐藏问题
                    self.toolControlStyle(1);
                    video.play();
                }
            }else{
                // self.data.control.bgimgShow=self.data.control.loading_bgimg;
                self.$update();
                self.fixCompatibility(2); // Fix兼容性引起的video隐藏问题
                self.toolControlStyle(1);
                video.play();
            }
            self.$update();
        },
        toolStartPlaying2: function(){
            // 主要用于不用自己loading样式的播放器启动，如QQ
            var self  = this;
            var video = self.$refs.vdoxxx;
            if(!video) return;
            self.toolPlayMaiDian(1); // 启动播放埋点参数设置
            self.data.videoState.clickwantplay = true;
            if (self.data.videoState.lastErrormsg) {
                self.toolStopPlaying(self.data.videoState.lastErrormsg);
                return;
            }
            video.play();
            self.$update();
        },
        getNGBIP: function(){
            var params = {
                wsurl:this.data.videoData.playUrl,//流地址
            };
            rest.getNGBIP(params,function(data){
                console.log(data);
            });
        },
        /***********************************************************************
        * [initVideoData] 初始化播放器,流地址拼接,播放器状态检测器唤起
        * @param  {[type]} typ [description]
        * @return {[type]}     [description]
        ***********************************************************************/
        initVideoData: function(typ) {
            console.log("init videoPlayer data");
            var self = this;
            if (self.data.platForm.isDesktop) {
                return;
            }
            if (self.data.videoState.bloading) {
                return;
            }
            self.data.videoState.bloading = true;
            var parms = {
                deviceId: self.data.deviceId,
            };
            console.info('url',this.data.url,this)
            util.rest(this.data.url, {
                param: this.data.param,
                method: 'post',
                onload: function(data) {
                    console.info('成功playDevice', data);
                    
                    self.toolOnlineSwictch(1);
                    self.data.videoState.lastErrormsg = "";
                    self.data.videoData.playUrl = data.playUrl;
                    self.data.videoData.hlsUrl = data.playUrl;
                    self.data.videoData.rtmpUrl = data.playUrl;
                    self.data.videoState.lastErrormsg = "";
                    /*self.data.regCameraDetail.data.deviceState.commentFlag = 1;//是否可以进行评论
                    self.data.regCameraDetail.$update();*/
                    self.$update();
                    if(typ){
                         self.ajaxHeart();//只有成功的情况下才启动心跳
                    }
                    //end
                    console.log("before checkplay  : "+ self.data.videoState.playCheck);
                    if(typ){
                        // self.ajaxHeart();
                        if(self.data.platForm.isIOS){
                            self.checkPlay_IOS();
                        }else{
                            if(self.data.platForm.isUCBrowser || self.data.platForm.inYixin || self.data.platForm.inWeibo){
                                self.checkPlay_AOS_UC(); // 适用于UC等current无效的浏览器
                            }else if(self.data.platForm.isQQBrowser){
                                self.checkPlay_AOS_QQ(); // 适用于QQBrowser等current有效的浏览器
                            }else{
                                self.checkPlay_AOS();
                            }
                        }
                    }
                    console.log("after playcheck: "+ self.data.videoState.playCheck);
                    self.data.videoState.bloading = false;
                    self.$update();
                },
                onerror: function(data) {
                    console.info('摄像机已删除',data)
                    self.toolOnlineSwictch(0);
                    if(data.code == 404){
                        self.data.videoState.lastErrormsg = "摄像机已删除";
                    }else if(data.code == 400){
                        self.data.videoState.lastErrormsg = "摄像机已离线";
                    }else if(data.code == 401){
                        self.data.videoState.lastErrormsg = "摄像机已关闭";
                    }else if(data.code == 403){
                        self.reloadPage();
                    }else{
                        self.data.videoState.lastErrormsg = "网络连接失败，请检查您的网络设置";
                    }
                    /*self.data.regCameraDetail.data.deviceState.commentFlag = 0;
                    self.data.regCameraDetail.$update();*/
                    self.$update();
                }
            });
        },
        /*********************************************************************
         * IOS 播放器状态检测器.(也适用于AOS下的chrome和自带浏览器)
         * 部分浏览器会劫持默认播放器，而造成状态不能获取
         * 对于这类情况，将播放器的状态判断全部交给浏览器播放器（QQ,UC）
         **********************************************************************/
        checkPlay_IOS: function() {
            var self = this;
            var videoState = self.data.videoState;
            var platForm = self.data.platForm;
            // 兼容性FIX if(QQBrowser||UCBrowser),不用进行播放器事件绑定，不用启动定时器
            if(platForm.isQQBrowser || platForm.isUCBrowser){
                return ;
            }
            // 为播放器绑定暂停和播放事件
            var video = self.$refs.vdoxxx;
            if(!video) return;
            video.addEventListener("pause", function(ev) {
                self.toolStopPlaying();
            });
            // video.addEventListener("play", function(ev) {
            //     self.toolStartPlaying();
            // });
            // 如果定时器存在，则先取消
            if (videoState.playCheck) {
                clearInterval(videoState.playCheck);
                videoState.playCheck = null;
            }
            videoState.playCheck = setInterval(function() {

                if (videoState.bloading) {
                    return;
                }
                // 播放时,如果有错误,则停止播放
                if (videoState.clickwantplay && videoState.lastErrormsg.length != 0) {
                    self.toolStopPlaying(videoState.lastErrormsg);
                }
                var n = self.$refs.vdoxxx;
                if(!n) return;
                var info = {
                    //0 = NETWORK_EMPTY - 音频/视频尚未初始化
                    //1 = NETWORK_IDLE - 音频/视频是活动的且已选取资源，但并未使用网络
                    //2 = NETWORK_LOADING - 浏览器正在下载数据，改状态不能判断是否异常.
                    //3 = NETWORK_NO_SOURCE - 未找到音频/视频来源，该状态一定不能播放.
                    // IPHONE该值为2的时候表示正在准备，
                    // IPHONE如果发现无法播放iphone就会转为3.×

                    // 安卓一开始为1，能播放还是1.URI返回503则还是1.（摄像机关闭）.
                    // 安卓一开始为1，播放链接有问题则为2.安卓如果一直为2说明有问题.
                    // readyState表示音频/视频元素的就绪状态：
                    // 0 =  没有关于音频/视频是否就绪的信息
                    // 1 = HAVE_METADATA - 关于音频/视频就绪的元数据
                    // 2 = HAVE_CURRENT_DATA - 关于当前播放位置的数据是可用的，但没有足够的数据来播放下一帧/毫秒
                    // 3 = HAVE_FUTURE_DATA - 当前及至少下一帧的数据是可用的
                    // 4 = HAVE_ENOUGH_DATA - 可用数据足以开始播放
                    networkState: n.networkState,
                    paused: n.paused ? true : false,
                    currentTime: n.currentTime,
                    readyState: n.readyState,
                    played: n.played
                };
                if (info.currentTime == Infinity || info.currentTime == -Infinity) {
                    info.currentTime = 0;
                }
                // 如果首次连接 设置重连事件为10s,
                if(videoState.firstConnect){
                    videoState.reconnectTime = 10;
                }else{
                    videoState.reconnectTime = 5;
                }
                // *********************播放器测试对象***************
                var videoObj = {
                    'clickwantplay':videoState.clickwantplay,
                    'paused':info.paused,
                    'currentTime':info.currentTime,
                    'readyState':info.readyState,
                    '__timewrong':n.__timewrong,
                    'currentTimeO':n.currentTimeO,
                    'canReconnect':videoState.canReconnect,
                    'firstConnect':videoState.firstConnect,
                    'reconnectCount':videoState.reconnectCount,
                    'lastErrormsg':videoState.lastErrormsg
                };
                 self.console(videoObj);
                 console.info(99999999999)
                // **************************************************
                if(videoState.clickwantplay) {
                    if (n.currentTimeO == undefined) {
                        n.currentTimeO = info.currentTime || 0;
                    }
                    // reconnectTime秒(连续)进度没动.则认为播放或网络错误.
                    if (info.currentTime == n.currentTimeO) {
                        // Fix 部分浏览器劫持播放器时将paused状态置为true
                        // if(info.paused){
                        n.play();
                        // }
                        n.__timewrong ? n.__timewrong++ : n.__timewrong = 1;
                        if (n.__timewrong == videoState.reconnectTime) {
                            if(videoState.canReconnect){
                                videoState.canReconnect = false;
                                self.toolControlStyle(1);
                                n.load(); //播放器重连
                                videoState.reconnectCount++;
                                videoState.firstConnect = false;// 表示不是首次重连
                            }else{
                                videoState.canReconnect = true;
                                videoState.lastErrormsg = "播放出错了，请尝试刷新重试一下～";
                            }
                            n.__timewrong = 0;
                            return;
                        }
                    }else {
                        n.__timewrong = 0;
                         // 重新启动播放,将是否可以重连设置为true
                        if(info.readyState == 4){
                            videoState.canReconnect = true;
                            videoState.firstConnect = false;// 表示不是首次重连
                            self.fixCompatibility(2); // Fix兼容性引起的video隐藏问题
                            if(self.data.control.status != 2){
                                self.toolControlStyle(2); // 隐藏覆盖图片,开始播放
                            }
                        }
                        if(self.data.control.status != 2 && info.currentTime){
                            self.toolControlStyle(2); // 隐藏覆盖图片,开始播放
                        }
                    }
                    n.currentTimeO = info.currentTime;
                }else{
                    // 用户点击退出全屏，系统默认调用播放器的pause事件，
                    // FIX部分APP浏览器会接管H5播放器的问题，接管后导致状态不同步.
                    n.__timewrong = 0;
                    videoState.canReconnect = true;
                    self.toolControlStyle(0);
                }
                self.$update();
            }, 1000);
        },
        /*********************************************************************
         * AOS 播放器状态检测器.(适用于AOS下的chrome和自带浏览器)
         * 可能需要针对AOS版本进行兼容，目前处理和IOS相同
         **********************************************************************/
        checkPlay_AOS: function() {
            var self = this;
            var videoState = self.data.videoState;
            var platForm = self.data.platForm;

            //为播放器绑定暂停和播放事件
            var video = self.$refs.vdoxxx;
            if(!video) return;
            video.addEventListener("pause", function(ev) {
                self.toolStopPlaying();
            });
            video.addEventListener("play", function(ev) {
                self.toolStartPlaying2();
            });
            // 如果定时器存在，则先取消
            if (videoState.playCheck) {
                clearInterval(videoState.playCheck);
                videoState.playCheck = null;
            }
            videoState.playCheck = setInterval(function() {

                if (videoState.bloading) {
                    return;
                }
                // 播放时,如果有错误,则停止播放
                if (videoState.clickwantplay && videoState.lastErrormsg.length != 0) {
                    self.toolStopPlaying(videoState.lastErrormsg);
                }
                var n = self.$refs.vdoxxx;
                if(!n) return;
                var info = {
                    networkState: n.networkState,
                    paused: n.paused ? true : false,
                    currentTime: n.currentTime,
                    readyState: n.readyState,
                    played: n.played
                };
                // 安卓下的坑.
                if (info.currentTime == Infinity || info.currentTime == -Infinity) {
                    info.currentTime = 0;
                }
                // 如果首次连接 设置重连事件为10s,
                if(videoState.firstConnect){
                    videoState.reconnectTime = 10;
                }else{
                    videoState.reconnectTime = 10;
                }
                // *********************播放器测试对象***************
                // var videoObj = {
                //     'clickwantplay':videoState.clickwantplay,
                //     'paused':info.paused,
                //     'networkState': info.networkState,
                //     'currentTime':info.currentTime,
                //     'readyState':info.readyState,
                //     '__timewrong':n.__timewrong,
                //     'currentTimeO':n.currentTimeO,
                //     'canReconnect':videoState.canReconnect,
                //     'firstConnect':videoState.firstConnect,
                //     'reconnectCount':videoState.reconnectCount,
                //     "controlStatus" : self.data.control.status
                // };
                // util.console(videoObj);
                // **************************************************
                if(videoState.clickwantplay) {
                    if (n.currentTimeO == undefined) {
                        n.currentTimeO = info.currentTime || 0;
                    }
                    // 15秒(连续)进度没动.则认为播放或网络错误.
                    if (info.currentTime == n.currentTimeO) {
                        // Fix 部分浏览器劫持播放器时将paused状态置为true
                        // if(info.paused){
                        n.play();
                        // }
                        n.__timewrong ? n.__timewrong++ : n.__timewrong = 1;
                        if (n.__timewrong == videoState.reconnectTime) {
                            // 重连一次,大于1次时候直接停止播放，两次时间共30s
                            if(videoState.canReconnect){
                                videoState.canReconnect = false;
                                self.toolControlStyle(1);
                                n.load(); //播放器重连
                                videoState.reconnectCount++;
                                videoState.firstConnect = false;// 表示不是首次重连
                            }else{
                                videoState.canReconnect = true;
                                videoState.lastErrormsg = "播放出错了，请尝试刷新重试一下～";
                            }
                            n.__timewrong = 0;
                            // n.currentTimeO = 0;
                            return;
                        }
                    }else {
                        n.__timewrong = 0;
                         // 重新启动播放
                        if(info.readyState == 4){
                            videoState.canReconnect = true;
                            videoState.firstConnect = false;// 表示不是首次重连
                            self.fixCompatibility(2); // Fix兼容性引起的video隐藏问题
                            // self.toolControlStyle(2); // 隐藏覆盖图片,开始播放
                        }
                        if(info.currentTime && n.currentTimeO && self.data.control.status != 2){
                            setTimeout(function(){
                                self.toolControlStyle(2);
                            },1000);
                        }
                    }
                    n.currentTimeO = info.currentTime;
                }else{
                    // 用户点击退出全屏，系统默认调用播放器的pause事件，
                    // FIX部分APP浏览器会接管H5播放器的问题，接管后导致状态不同步.
                    n.__timewrong = 0;
                    videoState.canReconnect = true;
                    // self.toolControlStyle(0);
                }
                self.$update();
            }, 1000);
        },
        /*********************************************************************
         * AOS 播放器状态检测器 for QQBrowser X5. 包括微信、QQ、QQBrowser
         * 1、播放器默认会放置在最顶层
         **********************************************************************/
        checkPlay_AOS_QQ : function() {
            var self = this;
            var videoState = self.data.videoState;
            var platForm = self.data.platForm;
            var video = self.$refs.vdoxxx;
            if(!video) return;
            video.addEventListener("pause", function(ev) {
                self.toolStopPlaying();
            });
            video.addEventListener("play", function(ev) {
                self.toolStartPlaying2();
            });
            if (videoState.playCheck) {
                clearInterval(videoState.playCheck);
                videoState.playCheck = null;
            }
            videoState.playCheck = setInterval(function() {

                if (videoState.bloading) {
                    return;
                }
                if (videoState.clickwantplay && videoState.lastErrormsg.length != 0) {
                    self.toolStopPlaying(videoState.lastErrormsg);
                }
                var n = self.$refs.vdoxxx;
                if(!n) return;
                var info = {
                    networkState: n.networkState,
                    paused: n.paused ? true : false,
                    currentTime: n.currentTime,
                    readyState: n.readyState,
                    played: n.played
                };
                // ******************播放器测试对象******************
                // var videoObj = {
                //     'clickwantplay':videoState.clickwantplay,
                //     'paused':info.paused,
                //     'currentTime':info.currentTime,
                //     'readyState':info.readyState,
                //     '__timewrong':n.__timewrong,
                //     'currentTimeO':n.currentTimeO,
                // };
                // util.console(videoObj);
                // **************************************************
                if (info.currentTime == Infinity || info.currentTime == -Infinity) {
                    info.currentTime = 0;  // 安卓下的坑
                }
                videoState.reconnectTime = 10;
                if(videoState.clickwantplay) {
                    if (n.currentTimeO == undefined) {
                        n.currentTimeO = info.currentTime || 0;
                    }
                    if (info.currentTime == n.currentTimeO) {
                        n.play();
                        n.__timewrong ? n.__timewrong++ : n.__timewrong = 1;
                        if (n.__timewrong == videoState.reconnectTime) {
                            n.__timewrong = 0;
                            n.load();
                            return;
                        }
                    }else {
                        n.__timewrong = 0;
                        if(info.readyState == 4){
                            self.fixCompatibility(2);
                            self.toolControlStyle(2);
                        }
                    }
                    n.currentTimeO = info.currentTime;
                }else{
                    n.__timewrong = 0;
                    self.toolControlStyle(0);
                }
                self.$update();
            }, 1000);
        },
        /*********************************************************************
         * AOS 播放器状态检测器 for UCBrowser X5.
         * 1、UC浏览器播放直播流的时候currentTime始终为0，从而导致无法判断流的开始与结束，
         * 2、播放器默认会放置在最顶层
         **********************************************************************/
        checkPlay_AOS_UC : function() {
            var self = this;
            var videoState = self.data.videoState;
            var platForm = self.data.platForm;

            //为播放器绑定暂停和播放事件
            var video = self.$refs.vdoxxx;
            if(!video) return;
            video.addEventListener("pause", function(ev) {
                self.toolStopPlaying();
            });
            video.addEventListener("play", function(ev) {
                self.toolStartPlaying();
            });
            // 如果定时器存在，则先取消
            if (videoState.playCheck) {
                clearInterval(videoState.playCheck);
                videoState.playCheck = null;
            }
            videoState.playCheck = setInterval(function() {

                if (videoState.bloading) {
                    return;
                }
                // 播放时,如果有错误,则停止播放
                if (videoState.clickwantplay && videoState.lastErrormsg.length != 0) {
                    self.toolStopPlaying(videoState.lastErrormsg);
                }
                var n = self.$refs.vdoxxx;
                if(!n) return;
                var info = {
                    networkState: n.networkState,
                    paused: n.paused ? true : false,
                    currentTime: n.currentTime,
                    readyState: n.readyState,
                    played: n.played
                };
                // 安卓下的坑.
                if (info.currentTime == Infinity || info.currentTime == -Infinity) {
                    info.currentTime = 0;
                }
                // 如果首次连接 设置重连事件为10s,
                if(videoState.firstConnect){
                    videoState.reconnectTime = 10;
                }else{
                    videoState.reconnectTime = 10;
                }
                // *********************播放器测试对象***************
                // var videoObj = {
                //     'clickwantplay':videoState.clickwantplay,
                //     'paused':info.paused,
                //     'networkState': info.networkState,
                //     'currentTime':info.currentTime,
                //     'readyState':info.readyState,
                //     '__timewrong':n.__timewrong,
                //     'currentTimeO':n.currentTimeO,
                //     'canReconnect':videoState.canReconnect,
                //     'firstConnect':videoState.firstConnect,
                //     'reconnectCount':videoState.reconnectCount,
                //     "controlStatus" : self.data.control.status
                // };
                // util.console(videoObj);
                // **************************************************
                if(videoState.clickwantplay) {
                    if (n.currentTimeO == undefined) {
                        n.currentTimeO = info.currentTime || 0;
                    }
                    if(n.paused) n.play();
                    // if (info.currentTime == n.currentTimeO) {
                    if (info.readyState != 4) {
                        n.play();
                        n.__timewrong ? n.__timewrong++ : n.__timewrong = 1;
                        if (n.__timewrong == videoState.reconnectTime) {
                            if(videoState.canReconnect){
                                videoState.canReconnect = false;
                                videoState.reconnectCount++;
                                videoState.firstConnect = false;
                            }else{
                                videoState.canReconnect = true;
                                // videoState.lastErrormsg = "播放出错了，请尝试刷新重试一下～";
                            }
                            n.__timewrong = 0;
                            return;
                        }
                    }else {
                        n.__timewrong = 0;
                        if(info.readyState == 4){
                            videoState.canReconnect = true;
                            videoState.firstConnect = false;// 表示不是首次重连
                            self.fixCompatibility(2); // Fix兼容性引起的video隐藏问题
                        }
                        if(self.data.control.status != 2){
                            self.toolControlStyle(2);
                        }
                    }
                    n.currentTimeO = info.currentTime;
                }else{
                    n.__timewrong = 0;
                    videoState.canReconnect = true;
                    self.toolControlStyle(0);
                }
                self.$update();
            }, 1000);
        },
        /***********************************************************************
         * 心跳检测: 超时播放时需要通过心跳检测来解释错误原因.
         * @return      {Void}
         **********************************************************************/
        ajaxHeart: function() {
            var self = this;
            // 如果播发检测定时器存在，则清除
            if (self.data.timerHandle.heart) {
                clearInterval(self.data.timerHandle.heart);
                self.data.timerHandle.heart = null;
            }
            self.data.timerHandle.heart = setInterval(function() {
                self.data.videoState.bhearting = true;
            }, 30000);
        },
        /***********************************************************************
         * 心跳检测异常，摄像机停止播放，清除相关数据，给出错误提示
         * @return      {Void}
         **********************************************************************/
        clearHeartdata:function(){
            var self = this;
            //主动弹一次错误提示
            self.tipshow(self.data.videoState.lastErrormsg);
            self.data.videoState.lastErrormsg = '';
            self.toolStopPlaying();//此时不会重新拉取play
            self.data.videoData.hlsUrl = "";
            //清除心跳定时器
            clearInterval(self.data.timerHandle.heart);
            self.data.timerHandle.heart = null;
            // 如果播发检测定时器存在，则清除
            if (self.data.videoState.playCheck) {
                clearInterval(self.data.videoState.playCheck);
                self.data.videoState.playCheck = null;
            }
            // 让摄像机掉到水里
            self.data.deviceState.deviceFlag = -1;
            //self.data.regCameraDetail.data.deviceState.deviceFlag = -1; // 通过reg对象进行通信
            self.data.regCameraDetail.$update();
            self.data.regCameraDetail.tabSelect(3);//自动跳转到精彩推荐
            self.$update();
        },
        /***********************************************************************
         * [reloadPage] 无权限观看(播放过程中权限变化)，reload页面
         * @return      {Void}
         **********************************************************************/
        reloadPage: function(){
            var self = this;
            var platForm = this.data.platForm;
            self.destroy();
            if(!self.data.page.test('channel?'))
                return;
            // self.tipshow("摄像机状态发生变化，无法继续观看了，2s后自动刷新当前页面！。");
            if(platForm.isAndroid && platForm.inWeixin){
                setTimeout(function(){
                    var random = new Date().getTime();
                    //1、不用reload是因为在某些安卓版本微信中，reload有几率被禁止而失效
                    //2、定时器跳转是因为可以让用户看清楚错误提示，且fix ios10最初版本，微信闪退问题
                    window.location.href=window.location.href+"&random="+random;
                },1000);
            }else{
                setTimeout(function(){
                    var random = new Date().getTime();
                        window.location.reload();
                },1000);
            }
        },
        /***********************************************************************
         * [destroy 清除播放定时器和心跳定时器 public 页面离开时候触发，]
         * @return {[void]}
         **********************************************************************/
        destroy: function () {
            this.supr(); // call the super destroy
            this.toolPlayMaiDian(3); // 暂停播放埋点
            // var playCheck = this.data.videoState.playCheck;
            // 1、通过赋值后，清除应用定时器可以清除被引用对象定时器，
            // 2、当清除定时器后，playCheck只是一个简单的数值，
            // 3、基于第二条，对PlayCheck赋值null,不会修改this.data.videoState.playCheck
            if(!!this.data.videoState.playCheck){
                clearInterval(this.data.videoState.playCheck);
                this.data.videoState.playCheck = null;
            }
            if (!!this.data.timerHandle.heart) {
                clearInterval(this.data.timerHandle.heart);
                this.data.timerHandle.heart = null;
            }
            if (!!this.data.adDate.timerHandle) {
                clearInterval(this.data.adDate.timerHandle);
                this.data.adDate.timerHandle = null;
            }
            this.data.videoData.hlsUrl = "";
            this.$update();
        },
    });
    return videoPlayer;
});
