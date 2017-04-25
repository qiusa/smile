/** * 我的摄像机-云储存查看 */define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/mycloud/index.html', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js', '../../html/sliderbar/index.js', '../../javascript/widget/pager/pager.js', '../../javascript/widget/videoPlay.js', '../../javascript/base/const.js', '../../javascript/widget/playFlash/index.js'], function(Regular, $, util, index, tip, dialog, sliderbar, pager, videoPlay, api, playFlash) {    require('../../css/mycloud.css');    var app = Regular.extend({        template: '<sliderbarTpl pro = {user}>' + index + '</sliderbarTpl>',        data: {            //登陆账户密码            user: {                nick: '',                icon: '',                type: 2 //左侧导航栏模块标识            },            show: {                nav: 1,                myRecordList: { //我的摄像机列表                    record: [],                    more: true, //是否还有更多                    loadStatus: false, //下拉加载状态                    noRecord: false,                    noPower: false                },                query: {                    deviceId: '',                    start: 0,                    end: 0,                    limit: 40,                    offset: 0                },                renderListDay: '',                recordListPerHour: []            },            config: {                switchRun: 0, //运行开关                switchNight: 0, //夜视模式                switchVoice: 0, //声音开关                switchPic: 0, //画面清晰度                switchRotate: 0, //画面颠倒                deviceId: '', // 设备id                cameraName: '' //设备名称            },            renderConfig: {                deviceDetail: {} //单个设备信息            }        },        init: function() {            this.initCtrol();            this.getData();            this.bind();            this.initPlay();        },        /**         * 初始化控件         * @return {} [description]         */        initCtrol: function() {            //提示框            this.tip = util.tip();        },        /**         * 插入直播         */        initPlay: function() {            if (!this.playHere && window.location.hash == '#cloud') {                var param = {                    deviceId: this.data.config.deviceId                };                console.info('===',param)                this.data.show.nav = 2;                this.playHere = new playFlash({                    param: param                });                this.playHere.$inject(this.$refs.playHere);            }        },        getData: function() {            this.data.config.deviceId = Base64.decode(util.getQueryString('id'));            this.data.config.cameraName = Base64.decode(util.getQueryString('name'));            this.data.show.query.deviceId = this.data.config.deviceId;            this.getDeviceDetail();            console.info('领导', window.location.hash);            this.getMyRecord();        },        /**         *获取单个设备信息         */        getDeviceDetail: function() {            var self = this;            util.rest(api.DEVICE.getDeviceConfig, {                param: {                    deviceId: this.data.config.deviceId                },                method: 'post',                onload: function(data) {                    console.info('成功getDeviceConfig', data);                    /* config: {                        switchRun: 0, //运行开关                        switchNight: 0, //夜视模式                        switchVoice: 0, //声音开关                        switchPic: 0, //画面清晰度                        switchRotate: 0, //画面颠倒                        deviceId: '', // 设备id                        cameraName: '' //设备名称                    },*/                    self.data.config.switchRun = data.deviceSwitch || 0;                    self.data.config.switchNight = data.nightVisionSwitch || 0;                    self.data.config.switchVoice = data.audioSwitch || 0;                    self.data.config.switchPic = data.clarity || 0;                    self.data.config.switchRotate = data.rotateSwitch || 0;                    self.data.config.switch = data.uploadSwitch || 0; //云存储开关                    self.data.config.recordPkg = data.recordPkg;                    self.$update();                },                onerror: function(data) {                    console.info('失败', data);                    self.tip.showErrorTip(data.message || '操作失败，请稍后重试')                }            });        },        /**         * 播放摄像机（直播地址）         */        getPlay: function() {            return;            var self = this;            util.rest(api.DEVICE.playDevice, {                param: {                    deviceId: this.data.config.deviceId                },                method: 'post',                onload: function(data) {                    console.info('成功playDevice', data);                    self.$update();                },                onerror: function(data) {                    console.info('失败', data);                    self.tip.showErrorTip(data.message || '操作失败，请稍后重试')                }            });        },        /**         * [获取我的录像]         * @return {[type]} [null]         */        getMyRecord: function() {            var self = this;            util.rest(api.DEVICE.deviceRecords, {                param: this.data.show.query,                method: 'post',                onload: function(data) {                    console.info('成功getMyRecord', data,self.data.show.myRecordList);                    self.data.show.myRecordList.record = data.result;                    self.renderList(data.result);                },                onerror: function(data) {                    console.info('失败', data);                    if (data.code == 405) {                        self.data.show.myRecordList.noPower = true;                        self.$update();                    } else if (data.code == 403) {                        self.data.show.myRecordList.noPower = true;                        self.$update();                    }                }            });        },        /**         * 绑定事件         */        bind: function() {            var self = this;            function scrollHandler() {                //首页下拉刷新                var isBottom = util.getScrollTop() + util.getWindowHeight() > util.getScrollHeight() - 500;                if (self.data.show.nav == 2 && isBottom) {                    console.info('克隆空间', self.data);                    // 显示loading,向服务器发起请求                    if (self.data.show.myRecordList.loadStatus) {                        self.data.show.query.offset = Number(self.data.show.query.offset) + self.data.show.query.limit;                        util.rest(api.DEVICE.deviceRecords, {                            param: self.data.show.query,                            method: 'post',                            onload: function(data) {                                console.info('成功', data)                                if (data.result && data.result.length == 0) {                                    self.data.show.myRecordList.more = false;                                    self.data.show.myRecordList.loadStatus = false;                                    return;                                }                                Array.prototype.push.apply(self.data.show.myRecordList.record, data.result);                                self.renderList(data.result);                                self.$update();                            },                            onerror: function(data) {                                console.info('失败', data)                                data = self.data.testData;                                Array.prototype.push.apply(self.data.show.myRecordList.record, data.result);                                self.renderList(data.result);                                self.$update();                                return;                                //网络超时                                if (data.code == 403) {                                    self.data.show.myRecordList.noPower = true;                                }                                self.data.show.myRecordList.loadStatus = false;                                self.$update();                                self.tip.showErrorTip('失败，请稍后重试');                            }                        });                    }                }            }            // 函数节流            function throttle(method, context) {                clearTimeout(method.tId);                method.tId = setTimeout(function() {                    method.call(context);                }, 50);            }            // 窗口滚动时触发            window.onscroll = function() {                // UI 先显示，不进入节流函数中                var isBottom = util.getScrollTop() + util.getWindowHeight() > util.getScrollHeight() - 500;                if (self.data.show.nav == 2 && isBottom) {                    //判断是否有更多摄像机                    if (self.data.show.myRecordList.more && !self.data.show.myRecordList.noPower) {                        self.data.show.myRecordList.loadStatus = true;                        self.$update();                    }                }                throttle(scrollHandler, window);            };        },        /**         * 播放云录像         * @param  {String} url 录像地址         */        renderVideo: function(url) {            var video = new videoPlay({                data: {                    url: url                }            });            video.$inject('body');        },        /**         * [渲染录像列表]         * @param  {[type]} list [录像列表]         * @return {[type]}      [null]         */        renderList: function(list) {            var self = this;            if (list.length == 0) {                self.data.show.myRecordList.noRecord = true;                this.$update();                return;            }            $.each(list, function(index, element) {                var myRecord = element;                var recordListPerHour = self.data.show.recordListPerHour;                var len = recordListPerHour.length;                if (self.data.show.renderListDay == myRecord.yearAndMonth) {                    recordListPerHour[len - 1].valueList.push(myRecord);                } else {                    self.data.show.renderListDay = myRecord.yearAndMonth;                    //默认展开                    var recordInHourObj = {                        valueList: [],                        isHold: false,                        yearAndMonth: myRecord.yearAndMonth                    };                    recordInHourObj.valueList.push(myRecord);                    self.data.show.recordListPerHour.push(recordInHourObj);                }            });            self.$update();        },        /**         * 导航切换         * @param  {Number} index 点击的导航序号         */        nav: function(index) {            this.data.show.nav = index;            console.info('nav')            window.location.hash = index == 1 ? 'set' : 'cloud';            this.$update();            this.initPlay();        },        /**         * 收起展开         */        showCloud: function(event, num) {            if (Regular.dom.hasClass(event.origin.parentElement.parentElement, 'cloud-show')) {                Regular.dom.delClass(event.origin.parentElement.parentElement, 'cloud-show');                event.origin.parentElement.nextElementSibling.style.height = 0;            } else {                Regular.dom.addClass(event.origin.parentElement.parentElement, 'cloud-show');                event.origin.parentElement.nextElementSibling.style.height = num = Math.ceil(num / 4) * 138 + 'px';            }        },        /**         * 操作显示列表         */        onShow: function(event) {            Regular.dom.addClass(event.origin, 'live');        },        /**         * 操作隐藏列表         */        onHide: function(event) {            Regular.dom.delClass(event.origin, 'live');        },        /**         * 设置摄像机属性         * SwitchType枚举定义：         *            1:摄像机开关(0为关闭，1为开启)         *            2:报警开关(0为关闭，1为开启)         *            3:云录像开关(0为关闭，1为开启)         *            4:状态灯开关(0为关闭，1为开启)         *            5:音频开关(0为关闭，1为开启)         *            6:画面翻转(摄像头图像旋转180度。0为恢复，1为旋转。设置旋转后实时视频、录像、告警均需倒置)         *            7:自动夜视开关(0为关闭，1为自动切换，2为强制开启)         *            8:曝光开关(0:自动(默认) 1:暗区优先 2:亮区优先)         *            9:音量开关 (0:高(默认) 1:中 2:         *            10:清晰度 (0:高(默认) 1:中 2:低)         */        setDeviceConfig: function() {            var self = this;            if (self.data.show.load) {                return;            }            //弹出框            var confirmDialog = new dialog({                data: {                    pro: {                        id: 'confirmDialog',                        single: false,                        title: '是否要保存本次设置？',                        height: 'auto',                        confirmBtnText: '确定',                        confirmCallback: function() {                            console.info(999, self.data.show)                            self.data.show.load = true;                            self.$update();                            util.rest(api.DEVICE.setDeviceConfig, {                                param: {                                    deviceId: self.data.config.deviceId,                                    switches: [{                                        "switchType": 1,                                        "switchValue": self.data.config.switchRun                                    }, {                                        "switchType": 7,                                        "switchValue": self.data.config.switchNight                                    }, {                                        "switchType": 5,                                        "switchValue": self.data.config.switchVoice                                    }, {                                        "switchType": 10,                                        "switchValue": self.data.config.switchPic                                    }, {                                        "switchType": 6,                                        "switchValue": self.data.config.switchRotate                                    }]                                },                                method: 'post',                                onload: function(data) {                                    console.info('成功', data);                                    self.data.show.load = false;                                    self.$update();                                    self.tip.showSuccessTip('设置成功');                                },                                onerror: function(data) {                                    console.info('牺牲', data);                                    self.data.show.load = false;                                    self.$update();                                    self.tip.showErrorTip('设置失败，请稍后重试');                                }                            });                        },                        cancelBtnText: '取消',                        cancelCallback: function() {}                    }                },                template: '<diglogTpl pro={pro}>\                                <p class="u-pdt18"></p>\                            </diglogTpl>'            });            confirmDialog.$inject('body');        },        /**         * 开关云存储         */        uploadSwitch: function(value) {            var self = this;            util.rest(api.DEVICE.setDeviceConfig, {                param: {                    deviceId: self.data.config.deviceId,                    switches: [{                        "switchType": 3,                        "switchValue": value                    }]                },                method: 'post',                onload: function(data) {                    console.info('成功', data);                    self.data.config.switch = value;                    self.$update();                    self.tip.showSuccessTip('设置成功');                },                onerror: function(data) {                    console.info('牺牲', data);                    self.tip.showErrorTip('设置失败，请稍后重试');                }            });        },        /**         * 显示弹窗服务购买协议         */        showAgreement: function() {            //弹出框            var agreementDialog = new dialog({                data: {                    pro: {                        id: 'agreementDialog',                        single: false,                        title: '',                        width: '642px',                        height: 'auto',                        noBtn: false                    }                },                template: '<diglogTpl pro={pro}>\                                <div class="buy-agreement">\                                    <h2 class="title">收费标准及说明</h2>\                                    <p class="text">尊敬的青果用户：</p>\                                    <p class="text">云存储为单独付费项目，收费标准及服务说明如下</p>\                                    <table class="price-say">\                                        <thead>\                                            <th>服务内容</th>\                                            <th>价格</th>\                                            <th>期限</th>\                                        </thead>\                                        <tbody>\                                            <tr>\                                                <td>7天循环云存储</td>\                                                <td>109元/台</td>\                                                <td>1年</td>\                                            </tr>\                                            <tr>\                                                <td>30天循环云存储</td>\                                                <td>289元/台</td>\                                                <td>1年</td>\                                            </tr>\                                        </tbody>\                                    </table>\                                    <h2 class="title">服务说明：</h2>\                                    <p class="text"> 青果云存储服务，可实时侦测识别摄制过程中的动态画面，并将动态画面以录像形式安全地存储在网易云端。</p>\                                    <p class="text">青果同时提供7天/30天的循环录制两种服务，方便管理者随时回溯、查看和下载近7天/30天的动态录像。</p>\                                    <h2 class="title title2">欢迎洽询客服，按需选择7天或30天云存储服务：</h2>\                                    <p class="text">电话：0571-89852694</p>\                                    <p class="text">Q Q：237087854</p>\                                    <p class="text">感谢您对青果的支持和信赖，我们竭诚为您提供更贴心的服务，谢谢！</p>\                                </div>\                            </diglogTpl>'            });            agreementDialog.$inject('body');        }    });    // 时间格式化.    app.filter('parseDate', function(v) {        return v ? util.getFormatDate(v) : "-";    });    app.filter('parseHour', function(v) {        return v ? util.getFormatDate(v, true) : "-";    });    app.filter('parseMonthDayHour', function(v) {        var year = '',            month = '',            day = '',            strShow = '';        if (!v) {            v = "-";            return;        }        day = v.substring(v.length - 4, v.length - 2);        month = v.substring(v.length - 6, v.length - 4);        year = v.substring(0, v.length - 6);        strShow = year + '年' + month + '月' + day + '日';        return v ? strShow : "-";    });    app.filter('parseTimeSection', function(v) {        var year = '',            month = '',            day = '',            strShow = '';        if (!v) {            v = "-";            return;        }        hour = v.substring(v.length - 2, v.length);        strShow = hour + ':00-' + (parseInt(hour) + 1) + ':00';        return v ? strShow : "-";    });    app.filter('coverFileRec', function(v) {        v += /\?/.test(v) ? '&vframe' : '?vframe';        return v;    });    // 图片地址裁剪参数    app.filter('coverFile', function(v) {        v += /\?/.test(v) ? '&resize=162x87' : '?resize=162x87';        return v;    });    app.filter('http2https', function(v) {        v = /\http:/.test(v) ? v.replace('http:', 'https:') : '';        return v;    });    return app;});