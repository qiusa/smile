/** * 数据统计页面 */define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/datastatistics/index.html', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js', '../../javascript/widget/pager/pager.js', '../../html/sliderbar/index.js', 'echarts'], function(Regular, $, util, index, tip, dialog, pager, sliderbar, echarts) {    require('../../css/datastatistics.css');    return Regular.extend({        template: '<sliderbarTpl pro = {user}>' + index + '</sliderbarTpl>',        data: {            //登陆账户密码            user: {                nick: '游客考拉',                icon: '',                type: 3//左侧导航栏模块标识            },            navIndex: 1,            pageNumber: 1,            dataList: [{                a: 2,                b: 33            }, {                a: 211,                b: 31113            }, {                a: 3332,                b: 33333            }, {                a: 211,                b: 323            }, {                a: 2,                b: 393            }],            chart: {                title: {                    text: 'ECharts 入门示例12'                },                tooltip: {                    trigger: 'axis'                },                xAxis: {                    data: ["衬衫1", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]                },                yAxis: {                    type: 'value',                    axisLabel: {                        formatter: '{value} °C'                    }                },                series: [{                    name: '销量',                    type: 'bar',                    data: [5, 20, 36, 10, 10, 20]                }]            }        },        init: function() {            this.initCtrol();            this.render();        },        /**         * 初始化控件         */        initCtrol: function() {            //提示框            this.tip = new tip();            this.tip.$inject('body');            var self = this;            setTimeout(function() {                self.initData();            }, 0);        },        /**         * 初始化时间选择器         * @param  {obj} stime 选择时间范围         */        initData: function(stime) {            stime = stime ? stime : moment().subtract(6, 'day'); //若无传入则默认显示最近一周            console.info(moment())            //日历控件            $('#timeConfig').daterangepicker({                "locale": {                    "format": 'YYYY-MM-DD'                },                "autoApply": true,                "startDate": stime,                "endDate": moment(),                "opens": "center"            }, function(start, end, label) {                console.log(start, 'New date range selected: ' + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD') + ' (predefined range: ' + label);            });        },        /**         * 渲染页面         * @return {[type]} [description]         */        render: function() {            var self = this;            setTimeout(function() {                //分页控件                var pager = Regular.extend({                    template: "{list.length}:{current}\         <pager total={Math.floor(list.length/20)} current={current} on-nav={this.changePage($event)}/>",                    changePage: function(page) {                        console.info(self);                        self.renderPage(page);                    }                })                pager = new pager({                    data: {                        list: new Array(300),                        current: 10                    }                }).$inject('#pager');                //渲染图表                self.initChart();            }, 0);        },        renderPage: function(page) {            this.data.pageNumber = page;            this.$update();            console.info(this);        },        /**         * 时间选择         * @param  {string} range 选择范围         */        selectTime: function(range) {            if (range == 'week') {                this.data.navIndex = 1;                this.initData(moment().subtract(6, 'day'))                this.renderChart('uuu', true);            } else if (range == 'month') {                this.data.navIndex = 2;                this.initData(moment().subtract(1, 'month'))                this.renderChart('aaa', false);            }        },        /**         * 渲染数据         */        initChart: function() {            var self = this;            setTimeout(function() { //延时执行 否则取不到节点                self.myChart = echarts.init(document.getElementById('chart'));                self.options = {                    title: {                        text: 'demo'                    },                    tooltip: {                        trigger: 'axis'                    },                    xAxis: {                        data: ["衬衫1", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]                    },                    yAxis: {                        type: 'value',                        axisLabel: {                            formatter: '{value}'                        }                    },                    series: [{                        name: '销量',                        type: 'line',                        data: []                    }]                };                self.myChart.showLoading({                    text: '正在努力的读取数据中...', //loading话术                });                self.renderChart('../getchart');            }, 0)        },        /**         * 渲染图表         * @param  {String} url  请求图表数据地址         * @param  {[type]} bool [测试用的]         */        renderChart: function(url, bool) {            var self = this;            util.rest(url, {                param: 'data',                method: 'post',                onload: function(data) {                    console.info('成功');                    if (data && typeof data != undefined) {                        //停止动画载入提示                        self.myChart.hideLoading();                        self.options.title = {                            text: '流量一周统计'                        }                        self.options.xAxis = {                            data: ["湿光光", "时光", "食堂", "石头", "师徒", "是他"]                        }                        self.options.series = [{                            name: '有图',                            type: 'line',                            data: [15, 20, 46, 110, 10, 210]                        }]                        console.info('哦破', self.options);                        // 绘制图表                        self.myChart.setOption(self.options);                    }                },                onerror: function(data) {                    console.info('牺牲');                    self.tip.showError(url + '失败，请重试');                    //停止动画载入提示                    self.myChart.hideLoading();                    //todo                    if (bool) {                        self.options.title = {                            text: '流量一周统计'                        }                        self.options.xAxis = {                            data: ["湿光光", "时光", "食堂", "石头", "师徒", "是他"]                        }                        self.options.series = [{                            name: '有图',                            type: 'line',                            data: [15, 20, 46, 110, 10, 210]                        }]                    } else {                        self.options.title = {                            title: {                                text: '金额一周统计'                            }                        }                        self.options.xAxis = {                            data: ["湿光金额光", "时金额光", "食堂金额", "石金额头", "金额师徒", "是金额他"]                        }                        self.options.series = [{                            name: '有金额图',                            type: 'line',                            data: [25, 220, 246, 10, 120, 20]                        }];                    }                    console.info('哦破', self.options)                        // 绘制图表                    self.myChart.setOption(self.options);                }            })        },        /**         * 操作显示列表         */        onShow: function(event) {            Regular.dom.addClass(event.origin, 'live');        },        /**         * 操作隐藏列表         */        onHide: function(event) {            Regular.dom.delClass(event.origin, 'live');        }    });});