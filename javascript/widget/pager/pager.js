define(['regularjs', 'jquery', '../../base/util', './pager.html'], function(Regular, $, util, index) {
    require('./pager.css');
    var Pager = Regular.extend({
        name: 'pager',
        template: index,
        // before init
        config: function(data) {
            var count = 8;
            var show = data.show = Math.floor(count / 2);
            data.current = data.current || 1;
            data.total = data.total || 1;
            data.jump = data.current;
            this.$watch(['current', 'total'], function(current, total) {
                if (current < 5) {
                    data.begin = 2;
                    data.end = 9;
                } else {
                    data.begin = current - show;
                    data.end = current + show;
                    if (data.begin < 2) {
                        data.begin = 2;
                    }
                    if (data.end > data.total - 1) {
                        data.end = data.total - 1;
                    }
                }
            });
        },
        nav: function(page) {
            if (!page) return;
            console.info('pagepage',page, typeof page)
            page = parseInt(page);
            var data = this.data;
            if (page < 1) return;
            if (page > data.total) return;
            if (page === data.current) return;
            data.current = page;
            this.$emit('nav', page);
        }
    })
});