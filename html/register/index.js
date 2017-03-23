define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/register/index.html', '../../javascript/3rd/anime.js', '../../javascript/widget/tip.js'], function(Regular, $, util, login, anime, tip) {    require('../../css/register.css');    var page = Regular.extend({        template: login,        data: {            //注册信息            user: {                email: '',                pwd: '',                pwdSecond: '',                company: '',                phone: '',                message: '',                verifyCode: ''            },            //错误信息            error: {                emailError: '',                pwdError: '',                pwdSecondError: '',                companyError: '',                phoneError: '',                messageError: '',                verifyCodeError: ''            },            timeOut: 60,//定时            show: {                sendMessage: false,                total: null,                isLoading: false,            }        },        init: function() {            this.tip = new tip();            this.tip.$inject('body');            this.initPage();        },        /**         * 发送短信验证码         */        sendMessage: function(event) {            if (this.data.show.sendMessage) return;            var self = this;            util.rest('../../message',{                param: 'test',                method: 'post',                onload: function() {                    console.info('成功');                    self.data.show.sendMessage = true;//发送成功开始计时                    self.data.timeOut = 60;                    self.timer();                },                onerror: function() {                    console.info('牺牲');                    self.tip.showError('短信发送失败，请重试');                    self.data.show.sendMessage = true;//发送成功开始计时                    self.data.timeOut = 60;                    self.timer();                }            })                        //event.origin.getAttribute('data-send')        },        /**         * 倒数计时         */        timer: function() {            var self = this;            this.__timer = setTimeout(function() {                self.data.timeOut--;                console.info(self.data.timeOut)                if (self.data.timeOut === 0) {                    clearTimeout(self.__timer);                    self.data.show.sendMessage = false;//发送成功开始计时                } else {                    self.timer();                }                self.$update();            }, 1000)        },        register: function() {            var result = this.verify();            if (result) {                this.tip.showError('result.errmsg');                return;            }            console.info('send')        },        /**         * 校验邮箱         * @param  {bool} bool true: 还需要额外跟服务器校验邮箱是否被注册         */        verifyEmail: function(bool) {            if (bool && !util.trim(this.data.user.email)) {//如果未填写且移开事件触发则不校验                this.data.error.emailError = '';                return;            }            var verifyResult = false,                self = this,                regEmail = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i; //匹配邮箱;            this.data.error.emailError = '';            if (!util.trim(this.data.user.email)) {                this.data.error.emailError = '邮箱不能为空';                verifyResult = true;            } else if (!regEmail.test(util.trim(this.data.user.email))) {                this.data.error.emailError = '邮箱格式错误';                verifyResult = true;            }            if (bool && !verifyResult) {                util.rest('../../path',{                    param: 'test',                    method: 'post',                    onload: function() {                        console.info('成功')                    },                    onerror: function() {                        console.info('牺牲')                    }                })            }            this.$update();            return verifyResult;        },        /**         * 校验密码         * @param  {bool} bool true: blur事件触发         */        verifyPwd: function(bool) {            if (bool && !util.trim(this.data.user.pwd)) {//如果未填写且移开事件触发则不校验                this.data.error.pwdError = '';                return;            }            var verifyResult = false,                reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/; //6-16位的数字、字母、特殊字符至少2种组合密码            //校验密码            this.data.error.pwdError = '';            if (!util.trim(this.data.user.pwd)) {                this.data.error.pwdError = '密码不能为空';                verifyResult = true;            } else if (util.trim(this.data.user.pwd) && util.trim(this.data.user.pwd).length != this.data.user.pwd.length) {                this.data.error.pwdError = '密码前后不能有空格';                verifyResult = true;            } else if (this.data.user.pwd.length < 6 || this.data.user.pwd.length > 16) {                this.data.error.pwdError = '请输入6-16位密码';                verifyResult = true;            } else if (!reg.test(this.data.user.pwd)) {                this.data.error.pwdError = '密码需包含字母，数字，字符中至少两种格式';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验企业名称         * @param  {bool} bool true: blur事件触发         */        verifyCompany: function(bool) {            if (bool && !util.trim(this.data.user.company)) {//如果未填写且移开事件触发则不校验                this.data.error.companyError = '';                return;            }            var verifyResult = false,                regCh = /[^\u4E00-\u9FA5]/g; //匹配非汉字            //校验企业名称            this.data.error.companyError = '';            if (!util.trim(this.data.user.company)) {                this.data.error.companyError = '企业名称不能为空';                verifyResult = true;            } else if (this.data.user.company.replace(regCh, '').length < 2) {                this.data.error.companyError = '请输入完整的企业名';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验手机          * @param  {bool} bool true: blur事件触发         */        verifyPhone: function(bool) {            if (bool && !util.trim(this.data.user.phone)) {//如果未填写且移开事件触发则不校验                this.data.error.phoneError = '';                return;            }            var verifyResult = false,                regPhone = /^1[3578]\d{9}$/; //匹配手机号            //校验手机号码            this.data.error.phoneError = '';            if (!util.trim(this.data.user.phone)) {                this.data.error.phoneError = '手机号码不能为空';                verifyResult = true;            } else if (!regPhone.test(this.data.user.phone)) {                this.data.error.phoneError = '请输入正确的手机号码';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验二次密码         * @param  {bool} bool true: blur事件触发         */        verifyPwdSecond: function(bool) {            if (bool && !util.trim(this.data.user.pwdSecond)) {//如果未填写且移开事件触发则不校验                this.data.error.pwdSecondError = '';                return;            }            //校验二次密码            this.data.error.pwdSecondError = '';            if (!util.trim(this.data.user.pwdSecond)) {                this.data.error.pwdSecondError = '确认密码不能为空';                verifyResult = true;            } else if (this.data.user.pwd !== this.data.user.pwdSecond) {                this.data.error.pwdSecondError = '密码不一致';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验短信验证码         * @param  {bool} bool true: blur事件触发         */        verifyMessage: function(bool) {            if (bool && !util.trim(this.data.user.message)) {//如果未填写且移开事件触发则不校验                this.data.error.messageError = '';                return;            }            this.data.user.messageError = '';            if (!util.trim(this.data.user.message)) {                this.data.error.messageError = '短信验证码不能为空';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验图片验证码         * @param  {bool} bool true: blur事件触发         */        verifyVerifyCode: function(bool) {            if (bool && !util.trim(this.data.user.message)) {//如果未填写且移开事件触发则不校验                this.data.error.verifyCodeError = '';                return;            }            this.data.user.verifyCode = '';            if (!util.trim(this.data.user.verifyCode)) {                this.data.error.verifyCodeError = '图片验证码不能为空';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验注册输入         */        verify: function() {            console.info(111, util.trim(this.data.user.email));            var verifyResult = false;//是否校验通过            //reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;//6-16位的数字、字母组合密码             //校验邮箱            if (this.verifyEmail()) {                verifyResult = true;            }            //校验密码            if (this.verifyPwd()) {                verifyResult = true;            }            //校验二次密码            if (this.verifyPwdSecond()) {                verifyResult = true;            }            //校验企业名称            if (this.verifyCompany()) {                verifyResult = true;            }            //校验手机号码            if (this.verifyPhone()) {                verifyResult = true;            }            //校验短信验证码            if (this.verifyMessage()) {                verifyResult = true;            }            //校验图片验证码            if (this.verifyVerifyCode()) {                verifyResult = true;            }                        if (verifyResult) {                this.$update();                return verifyResult;            } else {                return {                    email: util.trim(this.data.user.email),                    pwd: util.trim(this.data.user.pwd),                    pwdSecond: util.trim(this.data.user.pwdSecond),                    company: util.trim(this.data.user.company),                    phone: util.trim(this.data.user.phone),                    message: util.trim(this.data.user.message),                    verifyCode: util.trim(this.data.user.verifyCode)                };            }            //^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$            //^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$        },        /**         * 页面初始化         * @param  {[Number]} deviceid 设备id         * @return {[type]}         */        initPage: function() {},        showDialog: function() {            $('#dialog').removeClass('animated bounceOutUp').addClass('animated bounceInDown')        },        closeDialog: function() {            $('#dialog').removeClass('animated bounceInDown').addClass('animated bounceOutUp')        }    });    return page;});