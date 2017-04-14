/** * 账户总览页面 */define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/accountoverview/index.html', '../../javascript/widget/tip.js', '../../javascript/base/const.js', '../../html/sliderbar/index.js', 'echarts'], function(Regular, $, util, index, tip, api, sliderbar, echarts) {    require('../../css/accountoverview.css');    return Regular.extend({        template: '<sliderbarTpl pro = {user}>' + index + '</sliderbarTpl>',        data: {            //登陆账户密码            user: {                nick: '游客考拉a',                icon: '',                type: 1 //左侧导航栏模块标识            },            config: {                data: ''            },            show: {                loadMsg: '加载中...'            },            chart: {                title: {                    text: 'ECharts 入门示例12'                },                tooltip: {                    trigger: 'axis'                },                xAxis: {                    data: ["衬衫1", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]                },                yAxis: {                    type: 'value',                    axisLabel: {                        formatter: '{value} °C'                    }                },                series: [{                    name: '销量',                    type: 'bar',                    data: [5, 20, 36, 10, 10, 20]                }]            }        },        init: function() {            this.initCtrol();            this.render();        },        /**         * 初始化控件         * @return {[type]} [description]         */        initCtrol: function() {            //提示框            this.tip = util.tip();        },        /**         * 渲染数据         */        render: function() {            var self = this;            setTimeout(function() { //延时执行 否则取不到节点                self.myChart = echarts.init(document.getElementById('chart'));                self.options = {                    title: {                        text: 'demo'                    },                    tooltip: {                        trigger: 'axis'                    },                    xAxis: {                        data: ["衬衫1", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]                    },                    yAxis: {                        type: 'value',                        axisLabel: {                            formatter: '{value}'                        }                    },                    series: [{                        name: '销量',                        type: 'line',                        data: []                    }]                };                self.myChart.showLoading({                    text: '正在努力的读取数据中...', //loading话术                });                self.renderChart('../getchart');            }, 0)        },        renderChart: function(url, bool) {            var self = this,                param = {withInfo: true};            util.rest(api.COMPANY.stats, {                param: param,                method: 'post',                onload: function(data) {                    console.info('成功', data);                    self.data.show.loadMsg = false;                    self.data.config.data = data;                    self.$update();                    if (data && typeof data != undefined) {                        //停止动画载入提示                        self.myChart.hideLoading();                        self.options.title = {                            text: '流量一周统计'                        }                        self.options.xAxis = {                            data: ["湿光光", "时光", "食堂", "石头", "师徒", "是他"]                        }                        self.options.series = [{                            name: '有图',                            type: 'line',                            data: [15, 20, 46, 110, 10, 210]                        }]                        console.info('哦破', self.options);                        // 绘制图表                        self.myChart.setOption(self.options);                    }                },                onerror: function(data) {                    console.info('牺牲',data);                    //self.tip.showError('失败，请重试');                    //停止动画载入提示                    self.myChart.hideLoading();                    self.data.show.loadMsg = '加载失败，请刷新浏览器';                    self.$update();                }            })        },        /**         * 操作显示列表         */        onShow: function(event) {            Regular.dom.addClass(event.origin, 'live');        },        /**         * 操作隐藏列表         */        onHide: function(event) {            Regular.dom.delClass(event.origin, 'live');        },        change: function(value) {            this.renderChart('uuu', value);        }    });});