/*******************************************************************************
 * 公用方法封装.
 * @hzgongyuli
 *
 ******************************************************************************/
define([
    'regularjs',
    './util.js',
    './rest.js',
], function(Regular, util, rest) {
    var tool = {
        //检测登录
        checkLogin: function() {

        },
        clearCookie: function() {},
        regularFilterInit: function() {
            var self = this;
            // 数量解析
            // Regular.filter('parseNum', function(v){
            //     if (v>9999) {
            //         v = (Math.ceil(v/1000)/10).toFixed(1) + "万";
            //     }
            //     return v;
            // });
            Regular.filter('parseNum', function(v) {
                var result = Number(v).toLocaleString();
                index = result.indexOf('.');
                if (index != -1) result = result.slice(0, index);
                return result;
            });
            //活动结束粉丝数
            Regular.filter('parseNumW', function(v) {
                if (v > 9999) {
                    v = (Math.ceil(v / 1000) / 10).toFixed(1) + "W";
                }
                return v;
            });
            // 时间格式化.
            Regular.filter('parseDate', function(v) {
                return v ? self.format(new Date(v), "yyyy-MM-dd HH:mm:ss") : "-";
            });

            // 图片地址裁剪参数
            Regular.filter('coverFile', function(v) {
                v += /\?/.test(v) ? '&resize=320x180' : '?resize=320x180';
                return v;
            });

            Regular.filter('coverFileRec', function(v) {
                v += /\?/.test(v) ? '&vframe' : '?vframe';
                return v;
            });

            Regular.filter('http2https', function(v) {
                v = /\http:/.test(v) ? v.replace('http:', 'https:') : v;
                return v;
            });

            // 输入框字数限制
            Regular.filter("formatChina", {
                get: function(origin, ls) {
                    return origin.length > ls ? origin.substring(0, ls) : origin;
                },
                set: function(dest) {
                    return dest;
                }
            });

            Regular.filter('urlConvert', function(element) {
                //todo
                return 1;
                var result;
                element = u._$escape(element);
                element = self.urlify(element);

                // element = twemoji.parse(element, {
                //     callback: function(icon, options) {
                //       return '/live/res/chat/images' + options.size + '/' + icon + '.png';
                //     },
                //     size: 72
                // });
                // element = twemoji.parse(element);
                return element;
            });

            Regular.filter('emojiConvert', function(element) {
                //todo
                return
                element = twemoji.parse(element, {
                    callback: function(icon, options) {
                        return '/live/res/chat/images/' + options.size + '/' + icon + '.png';
                    },
                    attributes: function(rawText, iconId) {
                        return {
                            title: ' :' + iconId + ':'
                        };
                    },
                    size: 72
                });
                return element;
            });
        },
        // url过滤器
        /**
         * url识别
         * @param  {String} text 需要识别的字符串
         * @return {}
         */
        urlify: function(text) {
            var urlRegex = /((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
            var ProxyReg = /http|https|Http|Https|rtsp|Rtsp/;

            return text.replace(urlRegex, function(url) {
                var html;
                if (text.match(ProxyReg)) {
                    html = '<a target="_blank" href="' + url + '">' + url + '</a>';
                } else {
                    html = '<a target="_blank" href="http://' + url + '">' + url + '</a>';
                }
                return html;
            });
        },

        getQueryIdFromUrl: function() {
            var search = '',
                paramStr = '',
                search = window.location.hash;
            paramStr = search.substring(1, search.length).split("?")[1];
            //todo
                return 1;
            var queryObj = u._$query2object(paramStr);
            var source = queryObj.source;
            var queryId = queryObj.id || queryObj.deviceid;
            return queryId;
        },
        //发送统计数据
        accessLog: function() {

        },

        gotoWap: function() {
            //pc和wap的页面对应跳转
            var re = /Android|iPhone|windows phone|ipad|BlackBerry|android|iphone|Windows Phone|iPod/i;
            if (re.test(navigator.userAgent)) {
                alert(queryStr);
                window.location.replace(queryStr);
            } else {
                this.accessLog();
            }
        },

        getDeploymentEvt: function() {
            var deploymentEvt = '';
            var domainObj = util.getDomain();
            if (location.host == domainObj.test) {
                deploymentEvt = 'ISTEST';
            } else if (location.host == domainObj.pre) {
                deploymentEvt = 'ISPRE';
            } else if (location.host == domainObj.online) {
                deploymentEvt = 'ISLINE';
            } else {
                deploymentEvt = 'ISLOCAL';
            }
            return deploymentEvt;
        },
        //设置source
        setSource: function() {
            var search = window.location.hash.split('?')[1];
            var source = u._$query2object(search).source;
        },
        //埋点与跳转
        maiDian: function(ga, da) {
            // console.log(ga);
            // console.log(da);
            //在PC上打开WAP页面，跳转为PC页
            // var re = /Android|iPhone|windows phone|ipad|BlackBerry|android|iphone|Windows Phone|iPod/i;
            // if (re.test(navigator.userAgent)) {
            //     var pathname = window.location.pathname;
            //     var pathname_redirect = pathname.replace(/(pc)/,'wap');//替换匹配到的第一个'pc'
            //     setTimeout(function(){
            //         window.location.replace(pathname_redirect+window.location.hash);
            //     },500);

            //     // setTimeout(function(){
            //     //     location.href = "/live/wap_dev/index.html#/m/square";
            //     // },100);
            //     return true;
            // }else{
            //     rest.accessLog(da);
            //     _gaq.push(ga);
            //     return false;
            // }
        },
        format: function(now, mask) {
            var d = now;
            var zeroize = function(value, length) {
                if (!length) length = 2;
                value = String(value);
                for (var i = 0, zeros = ''; i < (length - value.length); i++) {
                    zeros += '0';
                }
                return zeros + value;
            };

            return mask.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|m{1,4}|yy(?:yy)?|([hHMstT])\1?|[lLZ])\b/g, function($0) {
                switch ($0) {
                    case 'd':
                        return d.getDate();
                    case 'dd':
                        return zeroize(d.getDate());
                    case 'ddd':
                        return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][d.getDay()];
                    case 'dddd':
                        return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][d.getDay()];
                    case 'M':
                        return d.getMonth() + 1;
                    case 'MM':
                        return zeroize(d.getMonth() + 1);
                    case 'MMM':
                        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getMonth()];
                    case 'MMMM':
                        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][d.getMonth()];
                    case 'yy':
                        return String(d.getFullYear()).substr(2);
                    case 'yyyy':
                        return d.getFullYear();
                    case 'h':
                        return d.getHours() % 12 || 12;
                    case 'hh':
                        return zeroize(d.getHours() % 12 || 12);
                    case 'H':
                        return d.getHours();
                    case 'HH':
                        return zeroize(d.getHours());
                    case 'm':
                        return d.getMinutes();
                    case 'mm':
                        return zeroize(d.getMinutes());
                    case 's':
                        return d.getSeconds();
                    case 'ss':
                        return zeroize(d.getSeconds());
                    case 'l':
                        return zeroize(d.getMilliseconds(), 3);
                    case 'L':
                        var m = d.getMilliseconds();
                        if (m > 99) m = Math.round(m / 10);
                        return zeroize(m);
                    case 'tt':
                        return d.getHours() < 12 ? 'am' : 'pm';
                    case 'TT':
                        return d.getHours() < 12 ? 'AM' : 'PM';
                    case 'Z':
                        return d.toUTCString().match(/[A-Z]+$/);
                        // Return quoted strings with the surrounding quotes removed
                    default:
                        return $0.substr(1, $0.length - 2);
                }
            });
        }

    };
    return tool;
});