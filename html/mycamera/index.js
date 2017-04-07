/** * 我的摄像机页面 */define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/mycamera/index.html', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js', '../../html/sliderbar/index.js', '../../javascript/widget/pager/pager.js'], function(Regular, $, util, index, tip, dialog, sliderbar, pager) {    require('../../css/mycamera.css');    return Regular.extend({        template: '<sliderbarTpl pro = {user}>' + index + '</sliderbarTpl>',        data: {            //登陆账户密码            user: {                nick: '游客考拉',                icon: '',                type: 2//左侧导航栏模块标识            },            showParams:{                show:2,                checkboxAll: false,//是否选中全部            },                         dataList: [{                checkbox: false,                id: 'qsd1223',                name: '面对疾风吧',                status: false,                isPlay: true,                night: true,                voice: true,                resolution: '流畅',                cloud: true            },{                id: 'eeee1223',                name: '断剑重铸之日',                status: false,                isPlay: false,                night: true,                voice: true,                resolution: '流畅',                cloud: true            }]        },        init: function() {            this.initCtrol();            this.initWatch();            this.initEvent();        },        /**         * 初始化控件         * @return {} [description]         */        initCtrol: function() {            //提示框            this.tip = new tip();            this.tip.$inject('body');            var self = this;            setTimeout(function() {                //分页控件                var pager = Regular.extend({                    template: "{list.length}:{current}\         <pager total={Math.ceil(list.length/20)} current={current} on-nav={this.changePage($event)}/>",                    changePage: function(page) {                        console.info(self);                        self.renderPage(page);                    }                })                pager = new pager({                    data: {                        list: new Array(221),                        current: 1                    }                }).$inject('#pager');            }, 0);        },        /**         * 监听事件         */        initWatch: function() {            this.$watch('showParams.checkboxAll', function(oldValue, newValue) {                if (newValue == undefined) return;//变化值为undefined为无效触发                for(var i = 0;i < this.data.dataList.length; i++) {                    this.data.dataList[i].checkbox = newValue ? false : true;                }            });        },        initEvent: function() {            //下拉框点击事件            $(document).on('click', function(event) {                $('.j-select').removeClass('live');                if($(event.target).hasClass('j-select')) {                    $(event.target).addClass('live');                }            });        },        renderPage: function(page) {            this.data.pageNumber = page;            this.$update();            console.info(this);        },        /**         * 操作显示列表         */        onShow: function(event) {            Regular.dom.addClass(event.origin, 'live');        },        /**         * 操作隐藏列表         */        onHide: function(event) {            Regular.dom.delClass(event.origin, 'live');        },        /**         * 选中设备         */        check: function(index) {            console.info('index',index)            this.data.dataList[index].checkbox = this.data.dataList[index].checkbox ? false : true;            this.$update();        },        /**         * 编辑设备名称         */        edit: function(event) {            console.info(event)            event.origin.style.display = 'none';            event.origin.nextElementSibling.style.display = 'block';        },        /**         * 隐藏编辑设备名称         */        hide: function(event) {            console.info(222)            event.origin.parentElement.style.display = 'none';            event.origin.parentElement.previousElementSibling.style.display = 'block';        },        addPhoneVerify: function(data) {            var addPhoneVerifyDialog = new dialog({                data: {                    pro: {                        id: 'addPhoneVerify',                        single: false,                        singleCenter: true,//一个居中按钮                        title: '添加手机号',                        confirmBtnText: '下一步',                        confirmCallback: function() {                            console.info(this)                            self.addPhoneVerify(this.addPhone);                        },                        cancelBtnText: '取消',                        cancelCallback: function() {},                        isAnimate: true,//是否有动画                        isFull: false,//是否添加溢出 == 5                        addPhone: '',//增加的手机号码                        message: ''//删除的手机号码                    }                },                template: '<diglogTpl pro={pro}>\                                <span>添加手机号</span>\                                <input type="text" r-model={pro.addPhone} />\                                <input type="text" r-model={pro.message}/>\                            </diglogTpl>'            });            addPhoneVerifyDialog.$inject('body');            console.info(this.dialog)        },        modifyDialog: function() {            var self = this;            //弹出框            this.dialog = new dialog({                data: {                    pro: {                        id: 'modifyDialog',                        single: false,                        singleCenter: true,//一个居中按钮                        title: '添加手机号',                        confirmBtnText: '下一步',                        confirmCallback: function() {                            console.info(this)                            this.isAnimate = false;                            self.addPhoneVerify(this.addPhone);                        },                        cancelBtnText: '取消',                        cancelCallback: function() {},                        isAnimate: true,//是否有动画                        isFull: false,//是否添加溢出 == 5                        phoneList: [12312,22222],//手机号码列表                        addPhone: '',//增加的手机号码                        delPhone: ''//删除的手机号码                    }                },                template: '<diglogTpl pro={pro}>\                                <span>已添加的手机号（最多可添加5个）：</span>\                                {#list pro.phoneList as item}\                                <dl data-index={iten_index}>\                                    <dt>{item}</dt>\                                    <dd on-click={this.delPhone()}>x</dd>\                                </dl>\                                {/list}\                            </diglogTpl>'            });            this.dialog.$inject('body');            console.info(this.dialog)        }    });});