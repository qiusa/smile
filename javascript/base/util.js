define(['jquery'], function($) {
    var util = {
        getDomain: function() {
            var locationHost = {
                test: "qlivetest.x.163.com",
                pre: "qlivepre.x.163.com",
                online: "qlive.163.com"
            };
            return locationHost;
        },
        trim: function(str){ //删除左右两端的空格
            return str.replace(/(^\s*)|(\s*$)/g, "");
        },
        //滚动条在Y轴上的滚动距离
        getScrollTop: function() {
            var scrollTop = 0,
                bodyScrollTop = 0,
                documentScrollTop = 0;
            if (document.body) {
                bodyScrollTop = document.body.scrollTop;
            }
            if (document.documentElement) {
                documentScrollTop = document.documentElement.scrollTop;
            }
            scrollTop = (bodyScrollTop - documentScrollTop > 0) ? bodyScrollTop : documentScrollTop;
            return scrollTop;
        },
        //文档的总高度
        getScrollHeight: function() {
            var scrollHeight = 0,
                bodyScrollHeight = 0,
                documentScrollHeight = 0;
            if (document.body) {
                bodyScrollHeight = document.body.scrollHeight;
            }
            if (document.documentElement) {
                documentScrollHeight = document.documentElement.scrollHeight;
            }
            scrollHeight = (bodyScrollHeight - documentScrollHeight > 0) ? bodyScrollHeight : documentScrollHeight;
            return scrollHeight;
        },
        //浏览器视口的高度
        getWindowHeight: function() {
            var windowHeight = 0;
            if (document.compatMode == "CSS1Compat") {
                windowHeight = document.documentElement.clientHeight;
            } else {
                windowHeight = document.body.clientHeight;
            }
            return windowHeight;
        },

        /**
         * 隐藏提示.
         */
        hideMessage: function() {
            obj.doMessage({
                show: false
            });
        },
        /**
         * 显示一个提示表示有错误信息.
         * @param   {String}            message         要显示的文案.
         * @return  {Void}
         */
        showError: function(message) {
            var html = '<div class="dialog bounceOutUp" id="dialog">'
                     + '<div class="dialog-box" on-click="{this.closeDialog()}">士大夫第三方</div>'
                     + '</div>';
            obj.doMessage({
                show: true,
                message: message,
                className: "u-show-error",
                timeout: 3000
            });
        },
        /**
         * 显示一个提示表示成功信息.
         * @param   {String}            message         要显示的文案.
         * @return  {Void}
         */
        showSuccess: function(message) {
            obj.doMessage({
                show: true,
                message: message,
                className: "u-show-success",
                timeout: 3000
            });
        },
        /**
         * 显示一个提示表示过程信息.
         * @param   {String}            message         要显示的文案.
         */
        showHint: function(message) {
            obj.doMessage({
                show: true,
                message: message,
                className: "u-show-hint"
            });
        },
        /**
         * 进行一个异步请求.
         * @param   {String}        uri                 请求的地址.
         * @param   {Object}        options             请求选项.
         * @config  {Number}        options.timeout     请求超时时间.
         * @config  {Function}      options.onload      加载成功后的回调.
         * @config  {Function}      options.onerror     加载失败后的回调.
         * @config  {Function}      options.onend       加载结束后的回调.
         * @return  {Void}
         */
        rest: function(uri, options) {
            var fld = options.onload,
                fer = options.onerror;
            if (options.method && options.method.toLowerCase() == "get") {
                options.param.tm = new Date().getTime();
            }
            $.ajax({
                url: uri,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                type: options.method || 'post',
                data: options.method.toLowerCase() == 'post' ? JSON.stringify(options.param) : options.param
            }).done(function(data) {
                console.info('成功', data, options)
                if (!data && typeof data === undefined) {
                    console.error('数据错误！');
                    return;
                }
                // 这里直接判断状态，如果非200则触发onerror.
                if (data.code != 200) {
                    console.error('获取数据失败！',data);
                    fer ? fer.call(this, data) : 0;
                } else {
                    fld ? fld.call(this, data) : 0;
                }
                options.onend ? options.onend.call(this, data) : 0;
            }).fail(function(data) {
                console.error('获取数据失败，请刷新重试！');
                console.info(data)
                fer ? fer.call(this, data || {}) : 0;
                options.onend ? options.onend.call(this, data || {}) : 0;
            });
        },
        /**
         * 获取url链接带的参数
         * @param  {string} name 参数名
         */
        getQueryString: function(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return (r[2]);
            return null;
        },
        /**
         * 对一个LIST中的完全相同的条目进行合并.
         * 并将合并后的条目中的某个属性值更新为合并的总数.
         * @param   {Array}     list        要合并相同项的数组.
         * @param   {String}    key         条目中的该属性名会在合并后累加.
         * @param   {String}    ignore      条目中的该属性名就算不同也会被忽略.
         *                                  取最小值.
         * @param   {String}    _s          遍历时的临时标识.
         * @return  {Array}     newList     合并处理后的新的数组.
         */
        listPlus: function(list, key, ignore, _s) {
            _s ? 0 : _s = "_s";
            var newList = [];
            for (var i = 0, j = list.length; i < j; ++i) {
                var listi = list[i];
                if (listi[_s]) {
                    continue;
                }
                var bbasekey = !listi.orders.status == 0 ? true : false;
                // 如果是未付款的不进行key的相加.
                if (bbasekey) {
                    listi[key] = 1;
                }
                var iig = listi[ignore];
                var _currentItems = JSON.stringify(listi);
                for (var k = i + 1, g = list.length; k < g; ++k) {
                    var listk = list[k];
                    if (listk[_s]) {
                        continue;
                    }
                    var kig = listk[ignore];
                    if (bbasekey) {
                        listk[key] = 1;
                    }
                    listk[ignore] = iig;
                    var items = JSON.stringify(listk);
                    listk[ignore] = kig;
                    if (items == _currentItems) {
                        listk[_s] = true;
                        if (bbasekey) {
                            listi[key]++;
                        }
                        if (kig < listi[ignore]) {
                            listi[ignore] = kig;
                        }
                    }
                }
                newList.push(listi);
            }
            return newList;
        },
        /**
         * 异步方法瀑布流执行.
         * util.falls(function(next){
         *      next();
         * }, function(next){
         *      next();
         * }, function(err){
         *      err ? dosomething : 0;
         * });
         * 
         * @param   {Args}      funs            一系列顺序执行的方法.
         *                      function(next){}
         *                      通过next参数控制顺序流执行.
         *                      若存在一个方法调用next的时候传递错误信息
         *                      则直接执行最后一个方法.
         * 
         */
        falls: function() {
            var funs = arguments;
            var lth = funs.length;
            var f1 = arguments[0];
            var fend = arguments[lth - 1];
            var i = 0;
            var fnext = function(err) {
                if (err) {
                    fend(err);
                    return;
                }
                i++;
                i < lth ? funs[i](i == lth - 1 ? null : fnext) : 0;
            };
            f1(fnext);
        }
    };
    return util;
})