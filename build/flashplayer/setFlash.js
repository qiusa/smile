/*******************************************************************************
 * flash播放器初始化.
 * @hzgongyuli
 *
 ******************************************************************************/
define([
    'jquery',
    '../../javascript/base/util.js',
    '../../javascript/base/rest.js'
], function($, util, rest){
    var flashObj = new Object();
    flashObj = {
        data : {
            deviceId: null,// 摄像头ID
            playStatus:100,
            FlashStatus:1,
            flashStatusFirstStop:true,
            //  视频展示数据
            videoData :{
                playUrl:"",
                hlsUrl:"",
                rtmpUrl:"",
            },
            // 各种定时器
            timerHandle: {
                heart:null,//心跳定时器
            },
            // 播放埋点相关数据
            maidian:{
                playFlag: false, // 视频是否被播放过
                startTime: 0, // 当播放器启动触发时，获取当前时间戳
                currentTime: 0, // 暂停或者离开页面时，获取当前时间戳
            },
            //拼接公有和私有的播放链接
            playUrlObj:{
                publicRtmpUrlStr:'rtmp://x.smartcamera.163.com/qingguo-public/',
                privateRtmpUrlStr:'rtmp://x.smartcamera.163.com/qingguo-private/',
                rtmpHostStr:'wsHost=x.smartcamera.163.com',
            },
            flashStatusObj:{
                lastStatus:'',
                lastTime:new Date().getTime(),
            },
            danmuObj:{
                defaultType:true,//true为默认开启弹幕
            }
        },
        setReg:function(reg){
            this.reg = reg;
        },
        /**
         * 初始化播放器
         * @return {[type]}
         */
        initPlayer:function(){
            //相当于初始化playstatus状态
            this.reg.data.playStatus = 100;
            this.data.flashStatusFirstStop = true;
            this.data.flashStatusObj.lastTime = new Date().getTime();
            this.clearTimerInterval();
            this.cameraRemove();
            this.initLoadingStatus();
        },
        /**
         * 清除计时器
         * @return {[type]}
         */
        clearTimerInterval: function() {
            this.data.playStatusTimer ? clearInterval(this.data.playStatusTimer) : 0;
            this.data.loadingStatusTimer ? clearInterval(this.data.loadingStatusTimer) : 0;
        },
        /**
         * 删除摄像机
         * @return
         */
        cameraRemove: function() {
            //todo
            e._$remove('CCMediaPlayer',false);
            if(!e._$get('flashContent')){
                var node = e._$html2node('<div id=\"flashContent\"></div>');
                e._$get('j-liveplayer').appendChild(node);
            }
            this.reg.$update();
        },
        /**
         * 初始化loading的状态
         * @param  {[type]}
         * @return {[type]}
         */
        initLoadingStatus : function() {
            this.isLoaded = 0;
            e._$delClassName('j-loading','u-dn');
        },
        /**
         * 更新设备信息
         * @param  {[Number]} deviceid 设备id
         * @return {[type]}
         */
        refreshCameraDetail : function(deviceId,type) {
            this.data.deviceId = deviceId;
             var mediaPlayer = e._$get("CCMediaPlayer");
             if(mediaPlayer){
                this.cameraRemove();
                this.initVideo(deviceId,type);
             }else{
                this.initVideo(deviceId,type);
             }
        },
        /**
         * 初始化播放器
         * @param  {[Number]} deviceid 设备id
         * @return {[type]}
         */
        initVideo : function(deviceId,type){
            var self = this;
            var playUrlObj = this.data.playUrlObj;
            var parms = {
                deviceId : deviceId
            };
            if('private' == type){
                rest.privateCameraPlay(parms,function(data){
                    if(data.rtmpSign){
                        //私有播放
                       self.data.videoData.rtmpUrl = playUrlObj.privateRtmpUrlStr + deviceId
                                                    +'?timestamp='+ data.timestamp
                                                    +'&sign='+data.rtmpSign
                                                    + '&'+playUrlObj.rtmpHostStr;
                    }else{
                        //公有播放
                        self.data.videoData.rtmpUrl = playUrlObj.publicRtmpUrlStr + deviceId
                                                    + '?'+playUrlObj.rtmpHostStr;
                    }
                    self.reg.data.playStatus = data.code;
                    self.setFlashPlayer(self.data.videoData.rtmpUrl,type);
                    self.reg.$update();
                },function(data){
                    // 400:服务器异常 3001：摄像头已关闭 3000: 摄像机离线
                    self.reg.data.playStatus = data.code;
                    self.reg.$update();
                });
            }else{
                rest.cameraPlay(parms,function(data){
                    //不管公有私有只判断是否有rtmpsign
                    if(data.rtmpSign){
                        //私有播放
                       self.data.videoData.rtmpUrl = playUrlObj.privateRtmpUrlStr + deviceId
                                                    +'?timestamp='+ data.timestamp
                                                    +'&sign='+data.rtmpSign
                                                    + '&'+playUrlObj.rtmpHostStr;
                    }else{
                        //公有播放
                        self.data.videoData.rtmpUrl = playUrlObj.publicRtmpUrlStr + deviceId
                                                    + '?'+playUrlObj.rtmpHostStr;
                    }
                    self.reg.data.playStatus = data.code;
                    self.setFlashPlayer(self.data.videoData.rtmpUrl);
                    self.reg.$update();
                },function(data){
                    // 400:摄像头已离线  401:摄像头已关闭（变为私有摄像头）
                    self.reg.data.playStatus = data.code;
                    self.reg.$update();
                });
            }
        },
        /**
         * 设置播放器
         * @param  {[Number]} deviceid 设备id
         * @return {[type]}
         */
        setFlashPlayer : function(rtmpUrl,type){
            //rtmpUrl = "rtmp://x.smartcamera.163.com/qingguo-public/163021505003753?wsHost=x.smartcamera.163.com"
            var self = this;
            var swfVersionStr = "1.0.0";
            var xiSwfUrlStr = "playerProductInstall.swf";

            // this.playStatusTimer = setTimeout(function(options){
            //     var value = playStatus;
            //     if(value == 0){
            //         self.reg.data.playStatus = 400;
            //     }else if(value == 1){
            //         self.reg.data.playStatus = 200;
            //     }else if(value == 3){
            //         //暂停状态，打点
            //         _gaq.push(['_trackEvent','pc_live','pc_pause','pause']);
            //     }
            // },1000);

            // this.loadingStatusTimer= setInterval(function(options){
            //     if(this.isLoaded == 1){
            //         e._$addClassName("j-loading","u-dn");
            //         clearInterval(self.loadingStatusTimer);
            //     }
            // },10);

            window.getFlashStatus = function(status){
                var regData = self.data;
                if(self.data.flashStatusFirstStop){
                    //如果是第一次播放器返回停止，则忽略
                    self.data.flashStatusFirstStop = false;
                    return;
                }
                var nowDate = new Date().getTime();
                if(regData.flashStatusObj.lastStatus == 3 && status == 0) return; //status == 3;
                if(nowDate - regData.flashStatusObj.lastTime < 100 && status == 0) return;  //status == 1;

                self.reg.data.FlashStatus = status;
                regData.flashStatusObj = {
                    'lastStatus':status,
                    'lastTime':nowDate,
                };

                self.reg.$update();
            };

            // window.getScreenShot = function(picStr){
            //     var regData = self.data;
            //     self.reg.data.screenShotPic = picStr;
            //     self.reg.$update();
            // };

            var flashvars = {
                "autoplay": true,
                "rtmpFile":encodeURIComponent(rtmpUrl),
                "onPlay" : function() {
                    playStatus = 1;
                    window.getFlashStatus(1);
                },
                "onMetaData" : function(meta) {
                    this.isLoaded = 1;
                },
                "onStop" : function() {
                    playStatus = 0;
                    window.getFlashStatus(0);
                },
                "onPause" : function() {
                    playStatus = 3;
                    window.getFlashStatus(3);
                },
                "ondanMu" : function(data) {
                    //弹幕
                    window.getFlashStatus(data);
                },
                "onscreenShot" : function(data) {
                    //截图
                    window.getScreenShot(data);
                },
            };
            var params = {};
            params.quality = "high";
            params.wmode = "opaque";
            params.allowscriptaccess = "sameDomain";
            params.allowfullscreen = "true";
            var attributes = {};
            attributes.id = "CCMediaPlayer";
            attributes.name = "CCMediaPlayer";
            attributes.align = "middle";
            var swfStr = "flashplayer/CCMediaPlayer.swf";
            if('private' == type){
                swfStr = "flashplayer/CCMediaPlayer_private.swf";
            }
            swfobject.embedSWF(
                swfStr, "flashContent",
                "100%", "100%",
                swfVersionStr, xiSwfUrlStr,
                flashvars, params, attributes);
            // JavaScript enabled so display the flashContent div in case it is not replaced with a swf object.
            swfobject.createCSS("#flashContent", "display:block;text-align:left;");
            //开启心跳
            self.ajaxHeart(type);
            //self.getCaptionType();
            //开始播放的打点
            self.toolPlayMaiDian(1,"pc_live"); // 启动播放埋点参数设置
        },
        /**
         * 获取弹幕的类型
         * @return {[type]}
         */
        getCaptionType: function() {
            var self = this;
            var parms = {};
            rest.getCaptionType(parms, function(data) {
                var d = data;
                if(data.result){
                    //开始弹幕
                    self.data.danmuObj.defaultType = false;
                }else{
                    self.data.danmuObj.defaultType = true;
                }
                self.setDefaultDanmuPlay();
                self.reg.$update();
            }, function(data) {

            });
        },
        /**
         * 开始弹幕
         * @return {[type]}
         */
        setDefaultDanmuPlay: function() {
            var danmuObj = this.data.danmuObj;
            var flashPlayer = document.getElementById("CCMediaPlayer");
            if (flashPlayer){
                flashPlayer.danmu(danmuObj.defaultType);
            }
        },
        /**
         * 心跳检测
         * @return {[type]}
         */
        ajaxHeart: function(type) {
            var self = this;
            self.data.timerHandle.heart = setInterval(function() {
                if('private' == type){
                    var parms = {
                        deviceId: self.data.deviceId,
                        "playType":'',//1：公共的 ; 0：不是主人自己的 ;'':是主人自己的
                    };
                    rest.privateCameraHeart(parms, function(data) {
                        self.reg.$update();
                    }, function(data) {
                        self.reg.data.playStatus = data.code;
                        clearInterval(self.data.timerHandle.heart);
                        self.cameraStop(self.data.deviceId,type);
                        self.reg.$update();
                    });
                }else{
                    var parms = {
                        deviceId: self.data.deviceId
                    };
                    rest.cameraHeart(parms, function(data) {
                        self.reg.$update();
                    }, function(data) {
                        self.reg.data.playStatus = data.code;
                        clearInterval(self.data.timerHandle.heart);
                        self.cameraStop(self.data.deviceId,type);
                        self.reg.$update();
                    });
                }

            }, 30000);
        },
        /**
         * 删除摄像机
         * @param  {[Number]} deviceid 设备id
         * @return
         */
        cameraStop:function(deviceId,type){
            var self = this;
            var params = {
                "deviceId": deviceId,
            };
            if('private' == type){
                rest.privateCameraStop(params,function(data){
                    self.clearTimerInterval();
                    self.$update();
                },function(data) {
                    self.$update();
                });
            }else{
                rest.cameraStop(params,function(data){
                    self.clearTimerInterval();
                    self.$update();
                },function(data) {
                    self.$update();
                });
            }
        },
        /**
         * 播放器埋点
         * @param  {[Number]} type 埋点类型
         * @return
         */
        toolPlayMaiDian: function(type,currentPage){
            var maidian = this.data.maidian;
            if(type == 1){
                maidian.playFlag = true;
                maidian.startTime = new Date().getTime();
            }else{
                // type==3时，需要验证是否点击过播放，且当前时刻处于播放状态
                var type3 = maidian.playFlag && maidian.startTime;
                if(type == 3 || type3){
                    maidian.currentTime = new Date().getTime();
                    var playTime = (maidian.currentTime - maidian.startTime)/60000;
                    if(playTime<=1){
                        var playType = 'pc_watchTime<1min';
                    }else if (playTime<=5){
                        var playType = 'pc_watchTime1-5min';
                    }else if (playTime<=10){
                        var playType = 'pc_watchTime5-10min';
                    }else if (playTime<=30){
                        var playType = 'pc_watchTime10-30min';
                    }else{
                        var playType = 'pc_watchTime>30min';
                    }
                    _gaq.push(['_trackEvent',currentPage, playType, 'watchTime']);
                    maidian.startTime = 0;// 设置为0,表示暂停之后没有开始播放
                }
            }
        },
    };
    return flashObj;
});






























