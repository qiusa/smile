define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/resetpwdphone/index.html', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js', '../../html/loginnav/index.js'], function(Regular, $, util, index, tip, dialog) {    require('../../css/resetpwdphone.css')    return Regular.extend({        template: '<loginNav>' + index + '</loginNav>',        data: {            reset: {                account:'',                other: false//另一种渠道            }        },        init: function() {            //提示框            this.tip = new tip();            this.tip.$inject('body');            //获取url带的参数            this.data.reset.account = util.getQueryString('account');            this.data.reset.other = util.getQueryString('other');            this.$update();        },        /**         * 下一步按钮点击         */        sendPhone: function() {            var self = this;            if (!self.data.reset.account) {                self.tip.showError('无效链接');                return;            }            //发送重置密码手机验证码请求            util.rest('../phone', {                param: 'data',                method: 'post',                onload: function() {                    console.info('成功');                    if (data && typeof data != undefined) {                        //跳转带参数                        window.location.href = './resetpwdcode.html?type=phone&account=' + self.data.reset.account;                    }                    //各类错误todo                },                onerror: function() {                    console.info('牺牲');                    window.location.href = './resetpwdcode.html?type=phone&account=error' + self.data.reset.account;                }            })        },        /**         * 浏览器后退         */        goBack: function() {            history.back();        }    });});