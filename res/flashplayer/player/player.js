/*******************************************************************************
 * flash播放器组件.
 * @hzgongyuli
 *
 ******************************************************************************/
define([
    'regularjs',
    'jquery',
    '../../../javascript/base/util.js',
    './player.html',
    '../../../javascript/base/rest.js',
    '../../../javascript/base/const.js'
], function(Regular, $, util, template, rest, api) {
    var FlashPlayer = Regular.extend({
        template: template,

        data: {
            allocateType: '',
            deviceId: null, // 摄像头ID
            playStatus: 100,
            FlashStatus: 100,
            flashStatusFirstStop: true,
            control: {
                pausedimg: "./images/icon_paused.png",
                loadingimg: "./images/icon_loading.png",
                canPraise: true,
            },
            //  视频展示数据
            videoData: {
                playUrl: "",
                hlsUrl: "",
                rtmpUrl: "",
            },
            // 各种定时器
            timerHandle: {
                heart: null, //心跳定时器
            },
            // 播放埋点相关数据
            maidian: {
                playFlag: false, // 视频是否被播放过
                startTime: 0, // 当播放器启动触发时，获取当前时间戳
                currentTime: 0, // 暂停或者离开页面时，获取当前时间戳
            },
            //拼接公有和私有的播放链接
            playUrlObj: {
                publicRtmpUrlStr: 'rtmp://x.smartcamera.163.com/qingguo-public/',
                privateRtmpUrlStr: 'rtmp://x.smartcamera.163.com/qingguo-private/',
                rtmpHostStr: 'wsHost=x.smartcamera.163.com',
            },
            flashStatusObj: {
                lastStatus: '',
                lastTime: new Date().getTime(),
            },
            show: {
                isLoading: false,
            },
            errorMess: {
                message400: false,
                message401: false,
            },
            danmuObj: {
                firstTime: true,
                defaultType: true, //true为默认开启弹幕
            },
            //重连
            reconnectionObj: {
                timeHandle: 0,
                repeatTime: 0,
            }
        },

        initPage: function() {
            this.clearErrorTip();
            this.cameraRemove();
            this.initPlayer();
            this.cameraPlay(this.data.deviceId);
            this.initWatchFlashStatus();
        },
        destroy: function() {
            this.supr();
            this.clearTimerInterval();
        },
        exportInterface: function(Type, param) {
            switch (Type) {
                case 'CLEARERROR':
                    this.data.regularObj.clearErrorTip();
                    break;
                case 'SHOWERROR':
                    this.data.regularObj.showErrorTip(param);
                    break;
                default:
                    break;
            }
        },
        clearErrorTip: function() {
            this.exportInterface('CLEARERROR');
        },
        /**
         * 重播
         * @return {[type]}
         */
        setPlayAgain: function() {
            this.initPage(this.data.deviceId);
            this.data.danmuObj.firstTime = true;
        },

        /**
         * 初始化播放器
         * @return {[type]}
         */
        initPlayer: function() {
            this.data.playStatus = 100;
            this.data.FlashStatus = 100;
            this.data.flashStatusFirstStop = true;
            this.data.flashStatusObj.lastTime = new Date().getTime();
            this.initLoadingStatus();
        },
        /**
         * 监控播放状态
         * @return {[type]}
         */
        initWatchFlashStatus: function() {
            var self = this;
            this.$watch("playStatus", function(param) {
                var canScreenShot = false;
                //服务端接口的返回码
                if (param == 100) return;
                if (param == 200) {
                    //canScreenShot = true;
                    self.clearErrorTip();
                } else {
                    self.exportInterface('SHOWERROR', param);
                }
                //self.data.regularObj.chatModule.setFlashStatus(canScreenShot);
            });

            this.$watch("FlashStatus", function(param) {
                var canScreenShot = false;
                //flash播放器的返回码
                // flashPlayer.pause();
                if (param == 100) {
                    ////self.data.regularObj.chatModule.setFlashStatus(canScreenShot);
                    return;
                }
                if (param == 1) {
                    $('#j-loading').addClass('u-dn');
                    $('#j-error-end').addClass('u-dn');
                    //对直播预告特殊处理
                    if (self.data.allocateType && self.data.allocateType === 'event') {
                        if (self.data.regularObj.data.isPlayingRecord) {
                            //如果已经打开录像，暂停直播
                            var flashPlayer = document.getElementById("CCMediaPlayer");
                            if (flashPlayer && flashPlayer.hasOwnProperty("pause")) {
                                flashPlayer.pause();
                            }
                        }
                    }
                    //设置评论可以截图
                    canScreenShot = true;
                    ////self.data.regularObj.chatModule.setFlashStatus(canScreenShot);
                    //开始默认弹幕后，再出现状态波动不处理
                    if (!self.data.danmuObj.firstTime) return;
                    self.data.danmuObj.firstTime = false;
                    self.getCaptionType();
                    //波动一次后重连次数也设为0
                    self.data.reconnectionObj.repeatTime = 0;
                    return;
                } else if (param == 3) {
                    self.$update();
                } else if (param == 11) {
                    //开始弹幕
                    self.data.regularObj.startModuleDanmu();
                    canScreenShot = true;
                } else if (param == 10) {
                    //停止弹幕
                    self.data.regularObj.stopModuleDanmu();
                    canScreenShot = true;
                } else {
                    //重连一次
                    if (self.data.reconnectionObj.repeatTime == 0) {
                        self.data.reconnectionObj.repeatTime = 1;
                        self.data.danmuObj.firstTime = true;
                        self.setPlayAgain();
                    } else {
                        //停止弹幕并报错
                        self.data.regularObj.stopModuleDanmu();
                        self.exportInterface('SHOWERROR', 400);
                    }
                }
                ////self.data.regularObj.chatModule.setFlashStatus(canScreenShot);
            });
        },
        /**
         * 清除计时器
         * @return {[type]}
         */
        clearTimerInterval: function() {
            this.data.timerHandle.loadingVideo ? clearInterval(this.data.timerHandle.loadingVideo) : 0;
            this.data.timerHandle.heart ? clearInterval(this.data.timerHandle.heart) : 0;
        },
        /**
         * 删除摄像机
         * @return 
         */
        cameraRemove: function() {
            //todo
            console.info('todo');
            return
            var mediaPlayer = e._$get("CCMediaPlayer");
            if (mediaPlayer) {
                e._$remove('CCMediaPlayer', false);
            }
            if (!e._$get('flashContent')) {
                var node = e._$html2node('<div id=\"flashContent\"></div>');
                e._$get('j-liveplayer').appendChild(node);
            }
            this.$update();
        },
        /**
         * 初始化loading的状态
         * @param  {[type]}
         * @return {[type]}
         */
        initLoadingStatus: function() {
            //todo
            this.isLoaded = 0;
            $('#j-loading').removeClass('u-dn');
        },

        /**
         * 播放器play
         * @param  {[Number]} deviceid 设备id
         * @return {[type]}
         */
        cameraPlay: function(deviceId) {
            var self = this;
            util.rest(api.DEVICE.playDevice, {
                param: {
                    deviceId: deviceId
                },
                method: 'post',
                onload: function(data) {
                    console.info('成功playDevice', data);
                    self.data.playStatus = data.code;
                    self.data.videoData.rtmpUrl = data.rtmpUrl;
                    self.setFlashPlayer(data.rtmpUrl);
                    self.$update();
                },
                onerror: function(data) {
                    console.info('失败', data);
                }
            });
        },
        /**
         * 设置播放器
         * @param  {[Number]} deviceid 设备id
         * @return {[type]}
         */
        setFlashPlayer: function(rtmpUrl, type) {
            //rtmpUrl = "rtmp://x.smartcamera.163.com/qingguo-public/163021505003753?wsHost=x.smartcamera.163.com"
            var self = this;
            var swfVersionStr = "1.0.0";
            var xiSwfUrlStr = "playerProductInstall.swf";

            window.getFlashStatus = function(status) {
                var regData = self.data;
                if (self.data.flashStatusFirstStop) {
                    //如果是第一次播放器返回停止，则忽略
                    self.data.flashStatusFirstStop = false;
                    return;
                }
                var nowDate = new Date().getTime();
                if (regData.flashStatusObj.lastStatus == 3 && status == 0) return; //status == 3;
                if (nowDate - regData.flashStatusObj.lastTime < 100 && status == 0) return; //status == 1;

                self.data.FlashStatus = status;
                regData.flashStatusObj = {
                    'lastStatus': status,
                    'lastTime': nowDate,
                };
                self.$update();
            };

            // window.getScreenShot = function(picStr){
            //     var regData = self.data;
            //     self.data.screenShotPic = picStr;
            //     self.$update();
            // };

            var flashvars = {
                "autoplay": true,
                "rtmpFile": encodeURIComponent(rtmpUrl),
                "onPlay": function() {
                    window.getFlashStatus(1);
                },
                "onMetaData": function(meta) {
                    this.isLoaded = 1;
                },
                "onStop": function() {
                    window.getFlashStatus(0);
                },
                "onPause": function() {
                    window.getFlashStatus(3);
                },
                "ondanMu": function(data) {
                    //弹幕
                    window.getFlashStatus(data);
                },
                "onscreenShot": function(data) {
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
            if ('private' == type) {
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
            //开始播放的打点
            self.toolPlayMaiDian(1, "pc_live"); // 启动播放埋点参数设置
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
                if (data.result) {
                    //开始弹幕
                    self.data.danmuObj.defaultType = false;
                } else {
                    //关闭弹幕
                    self.data.danmuObj.defaultType = true;
                }
                self.setDefaultDanmuPlay();
                self.$update();
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
            if (flashPlayer) {
                flashPlayer.danmu(danmuObj.defaultType);
            }
        },
        /**
         * 心跳检测
         * @return {[type]}
         */
        ajaxHeart: function(type) {
            return
            var self = this;
            self.data.timerHandle.heart = setInterval(function() {
                if ('private' == type) {
                    var parms = {
                        deviceId: self.data.deviceId,
                        "playType": '', //1：公共的 ; 0：不是主人自己的 ;'':是主人自己的
                    };
                    rest.privateCameraHeart(parms, function(data) {
                        self.$update();
                    }, function(data) {
                        self.data.playStatus = data.code;
                        clearInterval(self.data.timerHandle.heart);
                        self.cameraStop(self.data.deviceId, type);
                        self.$update();
                    });
                } else {
                    var parms = {
                        deviceId: self.data.deviceId
                    };
                    rest.cameraHeart(parms, function(data) {
                        self.$update();
                    }, function(data) {
                        self.data.playStatus = data.code;
                        clearInterval(self.data.timerHandle.heart);
                        self.cameraStop(self.data.deviceId, type);
                        self.$update();
                    });
                }

            }, 30000);
        },
        /**
         * 删除摄像机
         * @param  {[Number]} deviceid 设备id
         * @return 
         */
        cameraStop: function(deviceId, type) {
            var self = this;
            var params = {
                "deviceId": deviceId,
            };
            if ('private' == type) {
                rest.privateCameraStop(params, function(data) {
                    self.clearTimerInterval();
                    self.$update();
                }, function(data) {
                    self.$update();
                });
            } else {
                rest.cameraStop(params, function(data) {
                    self.clearTimerInterval();
                    self.$update();
                }, function(data) {
                    self.$update();
                });
            }
        },
        /**
         * 播放器埋点
         * @param  {[Number]} type 埋点类型
         * @return 
         */
        toolPlayMaiDian: function(type, currentPage) {
            var maidian = this.data.maidian;
            if (type == 1) {
                maidian.playFlag = true;
                maidian.startTime = new Date().getTime();
            } else {
                // type==3时，需要验证是否点击过播放，且当前时刻处于播放状态
                var type3 = maidian.playFlag && maidian.startTime;
                if (type == 3 || type3) {
                    maidian.currentTime = new Date().getTime();
                    var playTime = (maidian.currentTime - maidian.startTime) / 60000;
                    if (playTime <= 1) {
                        var playType = 'pc_watchTime<1min';
                    } else if (playTime <= 5) {
                        var playType = 'pc_watchTime1-5min';
                    } else if (playTime <= 10) {
                        var playType = 'pc_watchTime5-10min';
                    } else if (playTime <= 30) {
                        var playType = 'pc_watchTime10-30min';
                    } else {
                        var playType = 'pc_watchTime>30min';
                    }
                    _gaq.push(['_trackEvent', currentPage, playType, 'watchTime']);
                    maidian.startTime = 0; // 设置为0,表示暂停之后没有开始播放
                }
            }
        },
    })

    return FlashPlayer;
});