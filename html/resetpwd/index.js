define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/resetpwd/index.html', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js', '../../javascript/base/const.js', '../../javascript/3rd/cookie.js', '../../javascript/3rd/base64.js', '../../html/loginnav/index.js'], function(Regular, $, util, index, tip, dialog, api, cookie, Base64) {    require('../../css/resetpwd.css')    return Regular.extend({        template: '<loginNav>' + index + '</loginNav>',        data: {            //登陆账户密码            reset: {                account: '',//帐号                verifyCode: ''//图片验证码            },            info: {                verifyImg: '',            },            show: {                imgCodeUrl: api.USER.getImageCode + '?t=' + new Date().getTime()//图片验证码地址            },            error: {                accountError: '',//账号错误                verifyError: ''//验证码错误            }        },        init: function() {            this.initCtrol();        },        /**         * 初始化控件         */        initCtrol: function() {            //提示框            this.tip = util.tip();        },        /**         * 获取图片验证码         * @return {[type]} [description]         */        getVerifyImg: function() {            this.data.show.imgCodeUrl = api.USER.getImageCode + '?t=' + new Date().getTime();            this.$update();        },        /**         * 下一步按钮点击         */        stepClick: function() {            console.info(888);            var result = this.verify(),                self = this,                data = {};            this.data.error = {                accountError: '',//账号错误                verifyError: ''//验证码错误            }            if (result.error) {                if (result.type == 1) {                    self.data.error.accountError = result.errmsg;                } else {                    self.data.error.verifyError = result.errmsg;                }                return;            }            if (result.type == 'mobile') {                data.mobile = result.account;            } else {                data.email = result.account;            }            data.imagecode = result.code;            console.info('send1', data);            //发送重置密码请求            util.rest(api.USER.startResetPassword, {                param: data,                method: 'post',                onload: function(data) {                    console.info('成功',data);                    cookie.set({                        etmp: Base64.encode(data.email),//邮箱                        mtmp: Base64.encode(data.mobile)//手机号                    });                    //跳转带参数                    if (result.type == 'email') {                        window.location.href = './resetpwdemail.html?type=email';                    } else {                        window.location.href = './resetpwdphone.html?type=mobile';                    }                    //各类错误todo                },                onerror: function(data) {                    console.info('牺牲',data);                    if (data.code == 8) {                        self.data.error.verifyError = '图片验证码错误';                        self.data.show.imgCodeUrl = api.USER.getImageCode + '?t=' + new Date().getTime();                        self.$update();                    } else if (data.code == 13) {                        self.data.error.verifyError = '用户不存在';                        self.$update();                    } else {                        self.tip.showErrorTip(data.message || '操作失败，请稍后重试');                    }                }            })        },        /**         * 校验账号密码输入         */        verify: function() {            var regPhone = /^1[3578]\d{9}$/, //匹配手机号                regEmail = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i; //匹配邮箱;            if (!util.trim(this.data.reset.account)) {                return {                    error: true,                    type: 1,                    errmsg: '请输入注册企业的邮箱地址或手机号码'                }            }            if (!regPhone.test(this.data.reset.account) && !regEmail.test(this.data.reset.account)) {                return {                    error: true,                    type: 1,                    errmsg: '注册企业的邮箱地址或手机号码有误'                }            }            if (!util.trim(this.data.reset.verifyCode)) {                return {                    error: true,                    type: 2,                    errmsg: '请输入图片验证码'                }            }            return {                account: this.data.reset.account,                code: this.data.reset.verifyCode,                type: regPhone.test(this.data.reset.account) ? 'mobile' : 'email'            };        }    });});