define(['regularjs', 'jquery', '../../base/util', './pager.html'], function(Regular, $, util, index) {
    require('./pager.css');
    return Regular.extend({
        template: index,
        data: {
            totalPage: 10, //总页数
            showItems: 5, // 显示出来的页数，如: 1 ... 34[5]67 ... 10
            showPrev: true, // 是否显示“上一页”
            showNext: true, // 是否显示“下一页”
            showJump: true, // 是否显示“跳转”
            initPage: 1, //初始页
            currentPage: 1, //当前页
            callback: function() {}
        },
        init: function() {
            this.$watch("currentPage", function(newValue, oldValue) {
                console.info("user.name changed from ", oldValue, " to ", newValue);
                this.callback(newValue);
            })
        },
        callback: function(newValue) {
            console.info('call')
        }
    });
});