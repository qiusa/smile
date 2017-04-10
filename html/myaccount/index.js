/** * 我的账户页面 */define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/myaccount/index.html', '../../javascript/3rd/anime.js', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js', '../../html/sliderbar/index.js'], function(Regular, $, util, index, anime, tip, dialog, sliderbar) {    require('../../css/myaccount.css')    return Regular.extend({        template: '<sliderbarTpl pro = {user}>' + index + '</sliderbarTpl>',        data: {            //登陆账户密码            user: {                nick: '游客考拉',                icon: '',                type: 5 //左侧导航栏模块标识            }        },        init: function() {            this.initCtrol();        },        /**         * 初始化控件         * @return {[type]} [description]         */        initCtrol: function() {            //提示框2            this.tip = new tip();            this.tip.$inject('body');        },        /**         * 修改手机号         */        setPhone: function() {            var self = this,                phoneList = [12312, 22222, 3333, 22, 34]; //手机号码列表            //弹出框            var setPhoneDialog = new dialog({                data: {                    pro: {                        id: 'setPhone',                        single: false,                        singleCenter: true, //一个居中按钮                        title: '添加手机号',                        confirmBtnText: '下一步',                        confirmCallback: function() {                            console.info(222, this);                            setPhoneDialog.sendAddPhone(this);                        },                        reset: {                            addPhone: '', //增加的手机号码                            verifyCode: '', //验证码                            timeOut: 0, //发送                            sendMsg: '获取验证码' //文案                        }                    }                },                template: '<diglogTpl pro={pro}>\                                <p class="add-dialog-text">请输入新的手机号码：</p>\                                <div class="add-dialog-box">\                                    <input type="text" class="add-dialog-input" r-model={pro.reset.addPhone} placeholder="请输入手机">\                                </div>\                                <div class="add-dialog-code-box u-cb">\                                    <input type="text" class="code-input u-ftl" placeholder="请输入收到的验证码" r-model={pro.reset.verifyCode}>\                                    <span id="sendPhoneCode" class="verify-btn u-white-btn u-ftl" on-click={this.sendCode()}>{#if pro.reset.timeOut}{pro.reset.sendMsg}（{pro.reset.timeOut}）{#else}{pro.reset.sendMsg}{/if}</span>\                                </div>\                                </diglogTpl>',                /**                 * 获取验证码                 */                sendCode: function() {                    var self = this;                    if (self.data.pro.reset.timeOut) return;                    self.data.pro.reset.sendMsg = '重新发送';                    //发送验证码请求                    util.rest('../sendCode', {                        param: 'data',                        method: 'post',                        onload: function(data) {                            console.info('成功');                            if (data && typeof data != undefined) {                                self.data.pro.reset.timeOut = 60;                                self.timer();                                self.$update();                            }                        },                        onerror: function(data) {                            console.info('牺牲');                            self.data.pro.reset.timeOut = 60;                            self.timer();                            self.$update();                        }                    });                },                /**                 * 倒数计时                 */                timer: function() {                    var self = this;                    if (!document.getElementById('sendPhoneCode')) { //如果弹出框已销毁则停止定时                        clearTimeout(self.__timer);                        return;                    }                    this.__timer = setTimeout(function() {                        self.data.pro.reset.timeOut--;                        console.info(self.data.pro.reset.timeOut)                        if (self.data.pro.reset.timeOut === 0) {                            clearTimeout(self.__timer);                        } else {                            self.timer();                        }                        self.$update();                    }, 1000);                },                /**                 * 添加手机号发送请求                 * @param  {Obj} obj setPhoneDialog对象                 */                sendAddPhone: function(obj) {                    if (!obj.pro.reset.addPhone) {                        self.tip.showTip('手机号不能为空');                        obj.isClose = false;                        return;                    }                    if (util.verify('phone', obj.pro.reset.addPhone)) {                        self.tip.showTip('手机号不合法');                        obj.isClose = false;                        return;                    }                    if (!obj.pro.reset.verifyCode) {                        self.tip.showTip('验证码不能为空');                        obj.isClose = false;                        return;                    }                    obj.isClose = true;                    //发送添加手机号请求                    util.rest('../addphone', {                        param: 'data',                        method: 'post',                        onload: function(data) {                            console.info('成功');                            if (data && typeof data != undefined) {                                setPhoneDialog.addPhoneSuccess(data, obj.pro.reset.addPhone);                            }                        },                        onerror: function(data) {                            console.info('牺牲');                            //todo                            setPhoneDialog.addPhoneSuccess(data, obj.pro.reset.addPhone);                        }                    });                },                /**                 * 添加号码成功                 * @param  {JSON} data    添加成功回调                 * @param  {String} phone 需要添加的手机号码                 */                addPhoneSuccess: function(data, phone) {                    var hideName = util.hideName(phone, 3, 2, 8),                        addPhoneSuccessDialog = new dialog({                            data: {                                pro: {                                    id: 'addPhoneSuccess',                                    singleCenter: true, //一个居中按钮                                    title: '添加手机号',                                    confirmBtnText: '确定',                                    confirmCallback: function() {                                        console.info(this);                                    }                                }                            },                            template: '<diglogTpl pro={pro}>\                                    <span class="success-icon"></span>\                                    <p class="success-text2">已成功添加手机号：<span class="success-text3">' + hideName + '</span></p>\                                </diglogTpl>'                        });                    addPhoneSuccessDialog.$inject('body');                }            });            setPhoneDialog.$inject('body');        }    });});