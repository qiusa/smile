define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/register/index.html', '../../javascript/3rd/anime.js', '../../javascript/widget/tip.js'], function(Regular, $, util, login, anime, tip) {    require('../../css/register.css');    var page = Regular.extend({        template: login,        data: {            //注册信息            user: {                email: '',                pwd: '',                pwdSecond: '',                company: '',                phone: '',                message: '',                verifyCode: '',            },            verify: {                verifyImg: ''//图片兑换码            },            //错误信息            error: {                emailError: '',                pwdError: '',                pwdSecondError: '',                companyError: '',                phoneError: '',                messageError: '',                verifyCodeError: ''            },            show: {                check: false,                sendMsg: '获取验证码',                timeOut: 0 //定时            }        },        init: function() {            this.initCtrol();        },        /**         * 初始化控件         */        initCtrol: function() {            //提示框            this.tip = new tip();            this.tip.$inject('body');        },        /**         * 发送短信验证码         */        sendCode: function() {            if (this.data.show.timeOut) return;            var self = this;            util.rest('../../message', {                param: 'test',                method: 'post',                onload: function() {                    console.info('成功');                    self.data.show.sendMsg = '重新发送';                    self.data.show.timeOut = 60;                    self.timer();                },                onerror: function() {                    console.info('牺牲');                    self.tip.showError('短信发送失败，请重试');                    //todo                    self.data.show.sendMsg = '重新发送';                    self.data.show.timeOut = 60;                    self.timer();                }            });        },        /**         * 倒数计时         */        timer: function() {            var self = this;            self.__timer = setTimeout(function() {                self.data.show.timeOut--;                console.info(self.data.show.timeOut)                if (self.data.show.timeOut === 0) {                    clearTimeout(self.__timer);                    self.data.show.sendMsg = false; //发送成功开始计时                } else {                    self.timer();                }                self.$update();            }, 1000);        },        /**         * 获取图片验证码         * @return {[type]} [description]         */        getVerifyImg: function() {            var self = this;            //发送登录请求            util.rest('../getVerifyImg', {                param: 'data',                method: 'post',                onload: function(data) {                    console.info('成功');                    if (data && typeof data != undefined) {                        self.getVerifyImgSuccess(data);                        self.$update();                    }                },                onerror: function(data) {                    console.info('牺牲');                    self.getVerifyImgSuccess(data);                    self.tip.showError('获取验证失败，请点击重试');                }            })        },        getVerifyImgSuccess: function(data) {            console.info(99)            this.data.verifyImg = data;        },        /**         * 注册事件         */        register: function() {            var result = this.verify();            if (result) {                this.tip.showError('result.errmsg');                return;            }            console.info('send')        },        /**         * 校验邮箱         * @param  {bool} bool true: 还需要额外跟服务器校验邮箱是否被注册         */        verifyEmail: function(bool) {            if (bool && !util.trim(this.data.user.email)) { //如果未填写且移开事件触发则不校验                this.data.error.emailError = '';                return;            }            var verifyResult = false,                self = this;            this.data.error.emailError = '';            if (!util.trim(this.data.user.email)) {                this.data.error.emailError = '邮箱不能为空';                verifyResult = true;            } else if (util.verify('email', this.data.user.email)) {                this.data.error.emailError = '邮箱格式错误';                verifyResult = true;            }            if (bool && !verifyResult) {                util.rest('../../path', {                    param: 'test',                    method: 'post',                    onload: function() {                        console.info('成功')                    },                    onerror: function() {                        console.info('牺牲')                    }                })            }            this.$update();            return verifyResult;        },        /**         * 校验密码         * @param  {bool} bool true: blur事件触发         */        verifyPwd: function(bool) {            if (bool && !util.trim(this.data.user.pwd)) { //如果未填写且移开事件触发则不校验                this.data.error.pwdError = '';                return;            }            var verifyResult = false;            //校验密码            this.data.error.pwdError = '';            if (!util.trim(this.data.user.pwd)) {                this.data.error.pwdError = '密码不能为空';                verifyResult = true;            } else if (util.trim(this.data.user.pwd) && util.trim(this.data.user.pwd).length != this.data.user.pwd.length) {                this.data.error.pwdError = '密码前后不能有空格';                verifyResult = true;            } else if (this.data.user.pwd.length < 6 || this.data.user.pwd.length > 16) {                this.data.error.pwdError = '请输入6-16位密码';                verifyResult = true;            } else if (util.verify('pwd', this.data.user.pwd)) {                this.data.error.pwdError = '密码需包含字母，数字，字符中至少两种格式';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验企业名称         * @param  {bool} bool true: blur事件触发         */        verifyCompany: function(bool) {            if (bool && !util.trim(this.data.user.company)) { //如果未填写且移开事件触发则不校验                this.data.error.companyError = '';                return;            }            var verifyResult = false,                regCh = /[^\u4E00-\u9FA5]/g; //匹配非汉字            //校验企业名称            this.data.error.companyError = '';            if (!util.trim(this.data.user.company)) {                this.data.error.companyError = '企业名称不能为空';                verifyResult = true;            } else if (this.data.user.company.replace(regCh, '').length < 2) {                this.data.error.companyError = '请输入完整的企业名';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验手机          * @param  {bool} bool true: blur事件触发         */        verifyPhone: function(bool) {            if (bool && !util.trim(this.data.user.phone)) { //如果未填写且移开事件触发则不校验                this.data.error.phoneError = '';                return;            }            var verifyResult = false;            //校验手机号码            this.data.error.phoneError = '';            if (!util.trim(this.data.user.phone)) {                this.data.error.phoneError = '手机号码不能为空';                verifyResult = true;            } else if (util.verify('phone', this.data.user.phone)) {                this.data.error.phoneError = '请输入正确的手机号码';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验二次密码         * @param  {bool} bool true: blur事件触发         */        verifyPwdSecond: function(bool) {            if (bool && !util.trim(this.data.user.pwdSecond)) { //如果未填写且移开事件触发则不校验                this.data.error.pwdSecondError = '';                return;            }            //校验二次密码            this.data.error.pwdSecondError = '';            if (!util.trim(this.data.user.pwdSecond)) {                this.data.error.pwdSecondError = '确认密码不能为空';                verifyResult = true;            } else if (this.data.user.pwd !== this.data.user.pwdSecond) {                this.data.error.pwdSecondError = '密码不一致';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验短信验证码         * @param  {bool} bool true: blur事件触发         */        verifyMessage: function(bool) {            if (bool && !util.trim(this.data.user.message)) { //如果未填写且移开事件触发则不校验                this.data.error.messageError = '';                return;            }            this.data.user.messageError = '';            if (!util.trim(this.data.user.message)) {                this.data.error.messageError = '短信验证码不能为空';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验图片验证码         * @param  {bool} bool true: blur事件触发         */        verifyVerifyCode: function(bool) {            if (bool && !util.trim(this.data.user.message)) { //如果未填写且移开事件触发则不校验                this.data.error.verifyCodeError = '';                return;            }            if (!util.trim(this.data.user.verifyCode)) {                this.data.error.verifyCodeError = '图片验证码不能为空';                verifyResult = true;            }            this.$update();            return verifyResult;        },        /**         * 校验注册输入         */        verify: function() {            console.info(111, util.trim(this.data.user.email));            var verifyResult = false; //是否校验通过            //reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;//6-16位的数字、字母组合密码             //校验邮箱            if (this.verifyEmail()) {                verifyResult = true;            }            //校验密码            if (this.verifyPwd()) {                verifyResult = true;            }            //校验二次密码            if (this.verifyPwdSecond()) {                verifyResult = true;            }            //校验企业名称            if (this.verifyCompany()) {                verifyResult = true;            }            //校验手机号码            if (this.verifyPhone()) {                verifyResult = true;            }            //校验短信验证码            if (this.verifyMessage()) {                verifyResult = true;            }            //校验图片验证码            if (this.verifyVerifyCode()) {                verifyResult = true;            }            if (verifyResult) {                this.$update();                return verifyResult;            } else {                return {                    email: util.trim(this.data.user.email),                    pwd: util.trim(this.data.user.pwd),                    pwdSecond: util.trim(this.data.user.pwdSecond),                    company: util.trim(this.data.user.company),                    phone: util.trim(this.data.user.phone),                    message: util.trim(this.data.user.message),                    verifyCode: util.trim(this.data.user.verifyCode)                };            }        }    });    return page;});