define(['regularjs', 'jquery', '../../base/util', './pager.html'], function(Regular, $, util, index) {
    require('./pager.css');
    var Pager = Regular.extend({
        name: 'pager',
        template: index,
        // before init
        config: function(data) {
            data.current = data.current || 1;
            data.jump = '';//跳转
            data.next = 0;
            data.begin = 1;
            data.end = data.total || 1;
            data.total = data.total || 1;
            this.$watch(['current', 'total'], function(current, total) {
                console.info(current, total)

                return
                data.begin = current - show;
                data.end = current + show;
                if (data.begin < 2) data.begin = 2;
                if (data.end > data.total - 1) data.end = data.total - 1;
                if (current - data.begin <= 1) data.end = data.end + show + data.begin - current;
                if (data.end - current <= 1) data.begin = data.begin - show - current + data.end;
                /*data.begin = current - show;
                data.end = current + show;
                if (data.begin < 2) data.begin = 2;
                if (data.end > data.total - 1) data.end = data.total - 1;
                if (current - data.begin <= 1) data.end = data.end + show + data.begin - current;
                if (data.end - current <= 1) data.begin = data.begin - show - current + data.end;*/
            });
        },
        nav: function(page) {
            var data = this.data;
            console.info(data.total,data.next)
            if (page == 'next') {
                if (data.total > (data.next + 1) * 10) {
                    data.begin = (data.next + 1) * 10 + 1;
                    data.end = (data.next + 2) * 10 > data.total ? data.total : (data.next + 2) * 10;
                    data.next++;
                }
            }
            if (page == 'prev') {
                if (data.next > 0) {
                    data.begin = (data.next - 1) * 10 + 1;
                    data.end = data.next * 10;
                    data.next--;
                }
            }
        },
        jump: function(page) {
            if (!page) return;
            var data = this.data;
            if (page < 1) return;
            if (page > data.total) return;
            if (page === data.current) return;
            if (page < data.next * 10 || page > (data.next + 1) * 10) {
                data.next = Math.floor(page/10);
                data.begin = data.next * 10 + 1;
                data.end = (data.next + 1) * 10 > data.total ? data.total : (data.next + 1) * 10;
            }
            data.current = page;
            console.info('pagepage',page,data)
            this.$emit('jump', page);
        }
    })
});