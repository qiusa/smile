define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/page/page.html', '../../javascript/3rd/anime.js', '../../res/flashplayer/setFlash.js', '../../res/flashplayer/player/player.js', '../../javascript/base/common.js', '../../javascript/base/rest.js'], function(Regular, $, util, index, anime, setFlash, flashPlayer, tool, rest) {    tool.regularFilterInit(); //注册过滤事件    return Regular.extend({        template: index,        title: "直播",        data: {            share: {                shareValue: '',                flashShare: '',                uniShare: '',                urlShare: '',                sStatus: '',                fStatus: '',                tStauts: '',                QQshareHref: '',                WeiboShareHref: ''            },            img: {                defaultbg: "/live/res/pc/common/load.png",                load: "/live/res/pc/common/loading.gif",                addsbg: "/live/res/pc/square/adds-list-bg2.jpg",            },            deviceId: null, // 摄像头ID            playStatus: 100,            FlashStatus: 100,            //播放按钮、加载控制            control: {                pausedimg: "/live/res/pc/icon_paused.png",                loadingimg: "/live/res/pc/icon_loading.png",                canPraise: true,            },            // 用户相关数据            userData: {                isLogin: false,                userName: '',                userId: '',                protrait: "/live/res/wap/channel/default_protrait.png", //头像默认地址,如果请求成功，则用请求的图片            },            // 摄像头数据            cameraData: {},            // 摄像头相关信息            deviceState: {                deviceFlag: 1, // 1正常在线，2离线 -1摄像头失效            },            verifyData: {                userSelf: false,                uid: '', //用户id,未登录情况下没有                needVerify: 0, //0不需验证，1需验证                status: -1, //0 为发送验证，1已发送验证，2验证通过                open: false, //是否打开发送弹框                msg: '', //验证信息                grayChat: false, //是否置灰评论tab,包括所有需要验证的情况                isFocus: false, //是否收藏                verifyimg: "/live/res/pc/common/verify.png",            },            show: {                total: null,                isLoading: false,            },            // 更换换一批推荐            load: {                count: 0,                playEndCount: 0,                time: 1, //换一批的次数                playEndTime: 1, //播放结束换一批次数                playList: [],                playEndList: [],                lastRelates: "",                playEndlastRelates: "",                offset: 0,            },            errorMess: {                message400: false,                message401: false,            },        },        init: function() {            this.initPage()        },        /**         * 页面初始化         * @param  {[Number]} deviceid 设备id         * @return {[type]}         */        initPage: function(deviceId) {            console.info('deviceId', deviceId);            //deviceId = 163021505003894;            deviceId = 163021505004114;            if (!deviceId) {                console.error('无deviceId')                    //location.replace("#/m/square");                return;            }            var self = this;            this.data.deviceId = deviceId;            this.setCameraView(deviceId); //会发送请求            this.getCameraDetail(deviceId);        },        /**         * 重播         * @return {[type]}         */        setPlayAgain: function() {            this.flashplayerModule.setPlayAgain(this.data.deviceId);        },        /**         * [摄像机播放数+1]         * @param {[type]} deviceId [description]         */        setCameraView: function(deviceId) {            console.info('restrest', rest)            rest.cameraView({                'deviceId': deviceId            }, function(data) {});        },        /**         * 获取摄像机信息         * @param  {[Number]} deviceid 设备id         * @return {[type]}         */        getCameraDetail: function(deviceId) {            // 获取摄像头详细信息            var self = this;            var params = {                deviceId: deviceId,                relateNum: 4,            };            //获取单个公共摄像头详细信息接口√            rest.cameraDetail(params, function(data) {                self.data.cameraData = data.result;                // 相关推荐列表                self.data.load.playList = data.result.relateList;                self.data.load.count = self.data.load.playList.length;                self.data.load.lastRelates = self.setLastRelates(data.result.relateList); //获取相关推荐已有deviceId字符串                //错误页面的相关推荐                self.data.load.playEndList = data.result.relateList.slice(0, 3);                self.data.load.playEndCount = self.data.load.playEndList.length;                self.data.load.playEndlastRelates = self.setLastRelates(data.result.relateList.slice(0, 3));                // 验证相关                if (data.uid) {                    self.data.verifyData.uid = data.uid;                }                console.info('验证', data)                if (data.result.cameraDetail) {                    document.title = "未知直播 - " + data.result.cameraDetail.name;                    // 头像和默认头像设置                    if (data.result.cameraDetail.headPicUrl) {                        self.data.userData.protrait = data.result.cameraDetail.headPicUrl;                    }                    self.cameraVerify();                } else {                    self.showErrorTip(400);                    return;                }                self.$update();            }, function(data) {                location.replace("#/404");                self.$update();            });        },        /**         * [是否需要验证，不需要验证时候（判断是否初始化播放器和聊天]         * @return {[type]} [description]         * needVerify:是否需要验证，1为需要，0为不需要         * focusStatus:是否已经关注，0未关注，1已关注         * verifyStatus:观看需验证申请状态 0或空表示未申请过，1表示申请过 2表示主人已经同意(实际不需要验证为2状态，该状态下focusStatus自动为1)         */        cameraVerify: function() {            var self = this;            var cameraDetail = self.data.cameraData.cameraDetail;            if (self.data.verifyData.uid == cameraDetail.ownerId) {                self.data.verifyData.userSelf = true;                self.data.verifyData.isFocus = true;            } else {                self.data.verifyData.isFocus = cameraDetail.focusStatus ? true : false;            }            self.data.verifyData.needVerify = cameraDetail.needVerify;            if (self.data.verifyData.needVerify && !self.data.verifyData.isFocus && !self.data.verifyData.userSelf) {                if (cameraDetail.verifyStatus) {                    self.data.verifyData.status = 1;                } else {                    self.data.verifyData.status = 0;                }                self.data.verifyData.grayChat = true; //评论置灰            } else {                // (不需要验证或者已经关注过的不需要任何验证)                self.initVideoPlayer(); //初始化传player模块            }            self.$update();        },        /**         * [打开验证信息弹框]         * @return {[type]} [description]         */        goVerify: function() {            var self = this;            //埋点            if (self.data.verifyData.status == 0) {                //pc_申请观看埋点                _gaq.push(['_trackEvent', 'pc_live', 'pc_申请观看', 'pc_shareapplication']);            } else if (self.data.verifyData.status == 1) {                //pc_重新发送验证申请埋点                _gaq.push(['_trackEvent', 'pc_live', 'pc_重新发送验证申请', 'pc_shareapplication']);            }            if (!self.data.userData.isLogin) {                //pc登录方式                var loginModule = new Sign({                    data: {                        callBack: self.followCam                    }                });                loginModule.$inject(document.getElementById("mask"));                loginModule.ursLogin();            } else {                // 动态更新权限信息 ,请求摄像机信息                self.data.verifyData.open = true;            }        },        // checkLogin: function(){        //     var self = this;        //     var loginObj = tool.checkLogin();        //     if(loginObj && loginObj.isLogin){        //        self.data.userData.isLogin = true;        //        self.data.userData.userId = loginObj.id;        //        self.data.userData.userName = loginObj.nickName;        //     }else{        //         self.data.userData.isLogin = false;        //     }        // },        /**         * [发送验证信息]         * @return {[type]} [description]         */        sendVerify: function() {            var self = this;            //埋点            if (self.data.verifyData.status == 0) {                // pc_发送埋点                _gaq.push(['_trackEvent', 'pc_live', 'pc_发送', 'pc_shareapplication']);            } else if (self.data.verifyData.status == 1) {                //pc_重新发送埋点                _gaq.push(['_trackEvent', 'pc_live', 'pc_重新发送', 'pc_shareapplication']);            }            // if(self.data.verifyData.msg.length<=0){            //     util.showError('验证信息不能为空');            // }            if (self.data.verifyData.msg.length > 20) {                util.showError('验证信息不能超过20个字符');            } else {                var params = {                    deviceId: self.data.deviceId,                    message: self.data.verifyData.msg,                };                rest.sendVerifyMsg(params, function(data) {                    if (data.code == 200) {                        util.showSuccess("验证消息发送成功");                        setTimeout(function() {                            self.data.verifyData.msg = '';                            self.data.verifyData.open = false;                            self.data.verifyData.status = 1;                            self.$update();                        }, 100);                    } else if (data.code == 202 || data.code == 407) {                        window.location.reload();                    }                    self.$update();                }, function(data) {                    // 202 已经有权限                    // 407 摄像头切换私有，刷新页面，不能拉取数据                    if (data.code == 202 || data.code == 407) {                        window.location.reload();                    } else {                        util.showError('验证信息发送失败');                    }                });            }            self.$update();        },        /**         * [取消发送验证]         * @return {[type]} [description]         */        cancelVerify: function() {            this.data.verifyData.msg = '';            this.data.verifyData.open = false;        },        /**         * [收藏/取消收藏摄像机]         * @return {[type]} [description]         */        cameraFocusPanel: function() {            //pc_tag_收藏埋点   统计收藏tag的点击率            _gaq.push(['_trackEvent', 'pc_live', 'pc_click_收藏', '']);            var self = this;            if (self.data.verifyData.userSelf || self.data.deviceState.deviceFlag == -1) {                util.showError("自己的直播摄像机不能取消收藏哦~");                return; //1.用户自己无法取消收藏  2.私人摄像机不给收藏            }            if ((self.data.verifyData.needVerify && !self.data.verifyData.isFocus) || !self.data.userData.isLogin) {                self.goVerify(); //如果需要验证或者未登录，走验证流程            } else {                self.followCamera();            }        },        /**         * [收藏]         * @return {[type]} [description]         */        followCamera: function() {            var self = this;            var focusStatus = self.data.verifyData.isFocus ? -1 : 0;            var params = {                deviceId: self.data.deviceId,                focusStatus: focusStatus            };            rest.followCamera(params, function(data) {                if (data.code == 200) {                    if (self.data.verifyData.isFocus) {                        self.data.cameraData.cameraDetail.focusNumber--;                        util.showSuccess("取消收藏");                    } else {                        self.data.cameraData.cameraDetail.focusNumber++;;                        util.showSuccess("收藏成功");                    }                    self.data.verifyData.isFocus = !self.data.verifyData.isFocus;                    if (self.data.verifyData.needVerify && !self.data.verifyData.isFocus) {                        // util.showError("摄像机状态发生变化，无法继续观看了，需要验证后才能观看。");                        window.location.reload();                    }                }                self.$update();            }, function(data) {                if (data.code == 403) {                    self.data.userData.isLogin = false;                    self.$update();                    self.goVerify(); //如果需要验证或者未登录，走登录验证流程                } else {                    util.showError("操作失败，请稍后重试");                }                self.$update();            });        },        /**         * [播放器和弹幕模块初始化]         * @return {[type]} [description]         */        initVideoPlayer: function() {            var self = this;            //实例一个播放器            var flashplayerModule = new flashPlayer({                data: {                    deviceId: self.data.deviceId,                    regularObj: self,                }            });            flashplayerModule.$inject(document.getElementById("j-flashplayer"));            flashplayerModule.initPage();            self.flashplayerModule = flashplayerModule;            // //实例一个弹幕            // var flashdanmuModule = new flashDanmu({            //     data: {            //         deviceId: self.data.deviceId,            //         regularObj: self,            //     }            // });            // flashdanmuModule.$inject(document.getElementById("j-danmu"));            // flashdanmuModule.initDanmu(self.chatModule);            // self.flashdanmuModule = flashdanmuModule;        },        /**         * [销毁模块]         * @return {[type]} [description]         */        destroyModules: function() {            if (!!this.flashplayerModule) {                this.flashplayerModule.toolPlayMaiDian(3, "pc_live"); // 暂停播放埋点                this.flashplayerModule.destroy();            }            if (!!this.chatModule) {                this.chatModule.destroy();            }            if (!!this.flashdanmuModule) {                this.flashdanmuModule.destroy();            }        },        /**         * 获取相关推荐已有deviceId字符串         * @param {[list]} lastRelateList 相关推荐数组         */        setLastRelates: function(lastRelateList) {            var self = this;            var listStr = '';            lastRelateList.forEach(function(obj) {                listStr += obj.deviceId;                listStr += ',';            })            return listStr.substring(0, listStr.length - 1);        },        /**         * [显示错误]         * @param  {[type]} errorType [description]         * @return {[type]}           [description]         * 400:摄像头已离线(摄像机主人关闭直播)  401:摄像头已关闭（变为私有摄像头） 403观看需验证无权限 404 摄像机不存在或非公共         */        showErrorTip: function(errorType) {            console.error('errorType',errorType)            var errorStr = '';            if (errorType == 400) {                this.data.errorMess.message400 = true;                this.data.errorMess.message401 = false;            } else if (errorType == 401) {                this.data.errorMess.message401 = true;                this.data.errorMess.message400 = false;            } else if (errorType == 403) {                // this.data.errorMess.message400 = true;                // this.data.errorMess.message401 = false;                location.reload();                return;            } else {                this.data.errorMess.message401 = true;                this.data.errorMess.message400 = false;            }            $('#j-error-end').removeClass('u-dn');            this.$update();        },        /**         * [清除错误]         * @return {[type]} [description]         */        clearErrorTip: function() {            $('#j-error-end').addClass('u-dn');            this.$update();        },        /**         * 播放错误页面的相关推荐，页面点击事件         * @param  {[type]}         * @return {[type]}         */        changeRelatesPlayEnd: function(deviceId) {            var self = this;            //loading效果            this.data.show.isLoading = false;            this.$update();            setTimeout(function() {                self.data.show.isLoading = true;                self.$update();            }, 100);            this.$update();            var self = this;            var params = {                "deviceId": deviceId,                "ownerId": '', //非必传，有就传                "relateNum": 3,                "lastRelates": this.data.load.playEndlastRelates, //上一次获取的相关推荐列表                "offset": this.data.load.playEndTime * 3,            };            this.data.load.playEndTime++;            rest.changeRelates(params, function(data) {                self.data.load.playEndlastRelates = '';                self.data.load.playEndList = data.result;                self.data.load.count = data.result.length;                data.result.forEach(function(obj) {                    self.data.load.playEndlastRelates += obj.deviceId;                    self.data.load.playEndlastRelates += ',';                })                self.$update();            }, function(data) {                self.$update();            });        },        /**         * 播放器底部相关推荐         * @param  {[type]}         * @return {[type]}         */        changeRelates: function(deviceId) {            var self = this;            var params = {                "deviceId": deviceId,                "ownerId": '', //非必传，有就传                "relateNum": 4,                "lastRelates": this.data.load.lastRelates, //上一次获取的相关推荐列表                "offset": this.data.load.time * 4,            };            this.data.load.time++;            rest.changeRelates(params, function(data) {                self.data.load.lastRelates = '';                self.data.load.playList = data.result;                self.data.load.count = data.result.length;                data.result.forEach(function(obj) {                    self.data.load.lastRelates += obj.deviceId;                    self.data.load.lastRelates += ',';                })                self.$update();            }, function(data) {                //请求失败，构造摄像头信息                self.$update();            });        }    });});