/*******************************************************************************
 * 公用方法封装.
 * @hzgongyuli
 *
 ******************************************************************************/
define([
    'base/util',
    '{pro}base/util.js',
    'util/cache/cookie',
    'util/ajax/xdr',
    'util/ajax/rest',
    '../rest.js',
], function(u, util, cookie, upload, j, rest, p){
    var tool = {
        //检测登录
        checkLogin:function() {
            //return;
            var loginObj = {
                isLogin:0,
                id:'',
                nickName:'',
                loginType:''
            };

            if(cookie._$cookie('QINGGUO_LOGIN')){
                //有cookie已经登录
                loginObj.isLogin = 1;
                loginObj.id = cookie._$cookie('QINGGUO_LOGIN').split('|')[0];
                loginObj.nickName = decodeURI(cookie._$cookie('QINGGUO_LOGIN').split('|')[1]);
                loginObj.loginType = cookie._$cookie('QINGGUO_LOGIN').split('|')[2];
                loginObj.headPicUrl = decodeURI(cookie._$cookie('QINGGUO_LOGIN').split('|')[3]);
            }else{
                rest.checkLogin(function(data){
                    var id,
                        nickName,
                        loginType;
                    var result = data.result;
                    if (data.code==200) {
                        id= result.id;
                        loginType = result.platform;

                        if(result.userName){
                            nickName = result.userName;
                        }else if(result.phoneNumber){
                            nickName = result.phoneNumber;
                        }else if(result.userAccount){
                            nickName = result.userAccount;
                        }
                        //写cookie
                        var _cookie = cookie._$cookie('QINGGUO_LOGIN',{
                            value: id + '|' + encodeURI(nickName) + '|' + loginType + '|' + encodeURI(result.headPicUrl) ,
                            path:'/',
                            expires:30
                        });
                    }
                    loginObj.isLogin = 1;
                    loginObj.id = id;
                    loginObj.nickName = nickName;
                    loginObj.loginType = loginType;
                    loginObj.headPicUrl = result.headPicUrl;
                },function(data){

                });
            }
            return loginObj;
        },
        clearCookie:function() {
            cookie._$cookie('QINGGUO_LOGIN',{path:'/',expires:-1});
        },
        regularFilterInit:function() {
            var self = this;
            // 数量解析
            // Regular.filter('parseNum', function(v){
            //     if (v>9999) {
            //         v = (Math.ceil(v/1000)/10).toFixed(1) + "万";
            //     }
            //     return v;
            // });
            Regular.filter('parseNum', function(v){
                var result=Number(v).toLocaleString();
                    index=result.indexOf('.');
                if(index!=-1) result=result.slice(0, index);
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
                return v ? u._$format(new Date(v), "yyyy-MM-dd HH:mm:ss") : "-";
            });

            // 图片地址裁剪参数
            Regular.filter('coverFile', function(v){
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
                get : function(origin, ls){
                    return origin.length > ls ? origin.substring(0, ls) : origin;
                },
                set : function(dest){
                    return dest;
                }
            });

            Regular.filter('urlConvert', function(element){
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

            Regular.filter('emojiConvert', function(element){
                element = twemoji.parse(element, {
                    callback: function(icon, options) {
                      return '/live/res/chat/images/' + options.size + '/' + icon + '.png';
                    },
                    attributes: function (rawText, iconId) {
                        return {title: ' :' + iconId + ':'};
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
            var urlRegex =/((?:(http|https|Http|Https|rtsp|Rtsp):\/\/(?:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,64}(?:\:(?:[a-zA-Z0-9\$\-\_\.\+\!\*\'\(\)\,\;\?\&\=]|(?:\%[a-fA-F0-9]{2})){1,25})?\@)?)?((?:(?:[a-zA-Z0-9][a-zA-Z0-9\-]{0,64}\.)+(?:(?:aero|arpa|asia|a[cdefgilmnoqrstuwxz])|(?:biz|b[abdefghijmnorstvwyz])|(?:cat|com|coop|c[acdfghiklmnoruvxyz])|d[ejkmoz]|(?:edu|e[cegrstu])|f[ijkmor]|(?:gov|g[abdefghilmnpqrstuwy])|h[kmnrtu]|(?:info|int|i[delmnoqrst])|(?:jobs|j[emop])|k[eghimnrwyz]|l[abcikrstuvy]|(?:mil|mobi|museum|m[acdghklmnopqrstuvwxyz])|(?:name|net|n[acefgilopruz])|(?:org|om)|(?:pro|p[aefghklmnrstwy])|qa|r[eouw]|s[abcdeghijklmnortuvyz]|(?:tel|travel|t[cdfghjklmnoprtvwz])|u[agkmsyz]|v[aceginu]|w[fs]|y[etu]|z[amw]))|(?:(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9])\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[1-9]|0)\.(?:25[0-5]|2[0-4][0-9]|[0-1][0-9]{2}|[1-9][0-9]|[0-9])))(?:\:\d{1,5})?)(\/(?:(?:[a-zA-Z0-9\;\/\?\:\@\&\=\#\~\-\.\+\!\*\'\(\)\,\_])|(?:\%[a-fA-F0-9]{2}))*)?(?:\b|$)/gi;
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
            paramStr = search.substring(1,search.length).split("?")[1];
            var queryObj = u._$query2object(paramStr);
            var source = queryObj.source;
            var queryId = queryObj.id || queryObj.deviceid;
            return queryId;
        },
        //发送统计数据
        accessLog : function() {
            var queryId = this.getQueryIdFromUrl();
            //获取source
            search = window.location.hash;
            paramStr = search.substring(1,search.length).split("?")[1];
            var queryObj = u._$query2object(paramStr);
            var source = queryObj.source;
            //服务端数据
            if (cookie._$cookie("QINGGUO_ACCESS_SOURCE")) {
            if (source) {
                cookie._$cookie("QINGGUO_ACCESS_SOURCE",{value:source,path:'/',expires:1});
                }
            }
            else{
                source = source||"noSource";
                cookie._$cookie("QINGGUO_ACCESS_SOURCE",{value:source,path:'/',expires:1});
            }
            var param = {
                "accessDevice":"pc",
                "visitPage":"event_"+queryId,
                "accessSource":cookie._$cookie("QINGGUO_ACCESS_SOURCE")
            };
            _gaq.push(['_trackEvent','event','pc_event_'+queryId+'_?' + param.accessSource,'pc_event']);
            rest.accessLog(param);
        },

        gotoWap: function() {
            //pc和wap的页面对应跳转
            var re = /Android|iPhone|windows phone|ipad|BlackBerry|android|iphone|Windows Phone|iPod/i;
            if (re.test(navigator.userAgent)) {
                alert(queryStr);
                window.location.replace(queryStr);
            }else{
                this.accessLog();
            }
        },

        getDeploymentEvt:function(){
            var deploymentEvt = '';
            var domainObj = util.getDomain();
            if(location.host == domainObj.test){
                deploymentEvt = 'ISTEST';
            }else if(location.host == domainObj.pre){
                deploymentEvt = 'ISPRE';
            }else if(location.host == domainObj.online){
                deploymentEvt = 'ISLINE';
            }else{
                deploymentEvt = 'ISLOCAL';
            }
            return deploymentEvt;
        },
        //设置source
        setSource:function(){
            var search = window.location.hash.split('?')[1];
            var source = u._$query2object(search).source;
            if (cookie._$cookie("QINGGUO_ACCESS_SOURCE")) {
                if (source) {
                    cookie._$cookie("QINGGUO_ACCESS_SOURCE", { value: source,path: '/', expires: 1});
                }
            } else {
                source = source || "noSource";
                cookie._$cookie("QINGGUO_ACCESS_SOURCE", { value: source,path: '/',expires: 1});
            }
        },
        //埋点与跳转
        maiDian:function(ga,da){
            // console.log(ga);
            // console.log(da);
            //在PC上打开WAP页面，跳转为PC页
            var re = /Android|iPhone|windows phone|ipad|BlackBerry|android|iphone|Windows Phone|iPod/i;
            if (re.test(navigator.userAgent)) {
                var pathname = window.location.pathname;
                var pathname_redirect = pathname.replace(/(pc)/,'wap');//替换匹配到的第一个'pc'
                setTimeout(function(){
                    window.location.replace(pathname_redirect+window.location.hash);
                },500);

                // setTimeout(function(){
                //     location.href = "/live/wap_dev/index.html#/m/square";
                // },100);
                return true;
            }else{
                rest.accessLog(da);
                _gaq.push(ga);
                return false;
            }
        }

    };
    p = tool;
    return p;
});






























