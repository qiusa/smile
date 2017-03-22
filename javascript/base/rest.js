/*******************************************************************************
 * 数据层封装.
 * @hzyangyang2015,@hzwangxinyu
 *
 ******************************************************************************/
define([
    './util.js',
], function(util) {
    var rest = {
        screenshot: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/fgadmin/webChat/pic", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //关注和取消关注
        followCamera: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/fgadmin/focus", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取我的关注列表
        getfollowList: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/fgadmin/followersList", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        // 发送验证信息
        sendVerifyMsg: function(data, onload, onerror, onend) {
            var param = JSON.parse(JSON.stringify(data));
            util.rest("/live/fgadmin/sendVerifyMsg", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取热门搜索词
        getHotsearch: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/hotsearch/list", {
                method: "get",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取联想搜索词
        getRelationSearch: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/relationSearch", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取搜索结果
        getSearch: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/search", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },

        //发送统计数据
        accessLog: function(data, onload, onerror, onend) {
            var param = JSON.parse(JSON.stringify(data));
            util.rest("/log/saveAccessLog", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getActivityChatList: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/webChat/activityChatList", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        sendacitvityChat: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/webChat/activityChat", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getChatList: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/webChat/chatList", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        sendChat: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/webChat/chat", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getIndexList: function(data, onload, onerror, onend) {
            var param = JSON.parse(JSON.stringify(data));
            util.rest("/live/square/index", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getFocusList: function(data, onload, onerror, onend) {
            util.rest("/live/fgadmin/followersList", {
                method: "post",
                param: data,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getMenuList: function(onload, onerror, onend) {
            /**
             * @interface   获取首页菜单列表接口√
             *
             *
             **/
            var param = {};
            util.rest("/live/menu/getMenuList", {
                method: "get",
                param: param,
                sync: true,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getTagList: function(onload, onerror, onend) {
            /**
             * @interface   获取首页菜单列表接口√
             *
             *
             **/
            var param = {};
            util.rest("/live/square/tagList", {
                method: "get",
                param: param,
                sync: true,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getMarketActivityList: function(onload, onerror, onend) {
            /**
             * @interface   获取首页专题列表接口√ activityType 1 为主题活动，2为 投票活动
             *
             *
             **/
            var param = {};
            util.rest("/live/square/market/activity/list?activityType=1&cancel=0", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getHeadPic: function(onload, onerror, onend) {
            /**
             * @interface   获取首页轮播列表接口√
             *
             *
             **/
            var param = {
                picType: 0
            };
            util.rest("/live/square/headpic/list", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        cameraDetail: function(data, onload, onerror, onend) {
            /**
             * @interface   获取单个公共摄像头详细信息接口√
             *
             *
             **/
            var param = data;
            console.log(param);
            util.rest("/live/square/cameraDetail", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        privateCameraDetail: function(data, onload, onerror, onend) {
            /**
             * @interface   获取单个公共摄像头详细信息接口√
             *
             *
             **/
            var param = data;
            console.log(param);
            util.rest("/live/fgadmin/camera/refresh", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        cameraPlay: function(data, onload, onerror, onend) {
            /**
             * @interface   公共摄像头播放接口√
             *
             *
             **/
            var param = data;
            util.rest("/live/square/camera/play", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        privateCameraPlay: function(data, onload, onerror, onend) {
            /**
             * @interface   公共摄像头播放接口√
             *
             *
             **/
            var param = data;
            util.rest("/live/fgadmin/camera/play", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        cameraStop: function(data, onload, onerror, onend) {
            /**
             * @interface   公共摄像头播放接口√
             *
             *
             **/
            var param = data;
            util.rest("/live/square/camera/stop", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        privateCameraStop: function(data, onload, onerror, onend) {
            /**
             * @interface   公共摄像头播放接口√
             *
             *
             **/
            var param = data;
            util.rest("/live/fgadmin/camera/stop", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        cameraHeart: function(data, onload, onerror, onend) {
            /**
             * @interface   公共摄像头播放心跳检测接口√
             *
             *
             **/
            var param = data;
            util.rest("/live/square/camera/heart", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        privateCameraHeart: function(data, onload, onerror, onend) {
            /**
             * @interface   公共摄像头播放心跳检测接口√
             *
             *
             **/
            var param = data;
            util.rest("/live/fgadmin/camera/heart", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        changeRelates: function(data, onload, onerror, onend) {
            /**
             * @interface   更新相关推荐接口√
             *
             *
             **/
            var param = data;
            util.rest("/live/square/camera/changeRelates", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        cameraPraise: function(data, onload, onerror, onend) {
            /**
             * @interface   公共摄像头点赞接口√
             *
             *
             **/
            var param = data;
            util.rest("/live/square/camera/praise", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        getMenuList: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/tagList", {
                method: "get",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            })
        },
        //获取活动预告列表
        getLiveActivityList: function(data, onload, onerror, onend) {
            //var param = JSON.parse(JSON.stringify(data));
            var param = data;
            util.rest("/live/square/liveActivity/list", {
                method: "get",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            })
        },
        //获取活动预告页详细页
        getLiveActivityDetail: function(data, onload, onerror, onend) {
            //var param = JSON.parse(JSON.stringify(data));
            var param = data;
            util.rest("/live/square/liveActivity/detail", {
                method: "get",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            })
        },
        //获取活动摄像机主人相关推荐
        getLiveActRelateCamera: function(data, onload, onerror, onend) {
            //var param = JSON.parse(JSON.stringify(data));
            var param = data;
            util.rest("/live/square/liveActivity/relateCamera", {
                method: "get",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            })
        },
        //活动点赞
        liveActivityPraise: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/liveActivity/praise", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //活动热门片段
        getHotRecord: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/liveActivityRecord/list", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取私人摄像机
        getMyCameraList: function(onload, onerror, onend) {
            var param = {};
            util.rest("/live/fgadmin/camera/list", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取分组信息
        getGroup: function(onload, onerror, onend) {
            var param = {};
            util.rest("/live/fgadmin/group/list", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取摄像机列表，groupId传0代表未分组列表，传groupId代表分组下的摄像机列表
        getCameraList: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/fgadmin/group/cameraList", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //添加或修改摄像机分组
        updateCameraList: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/fgadmin/group/modify", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //删除摄像机分组
        removeCameraGroup: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/fgadmin/group/remove", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取私人录像
        getMyRecord: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/fgadmin/record/list", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取弹幕类型
        getCaptionType: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/getCaptionType", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //检查登录
        checkLogin: function(onload, onerror, onend) {
            // 已经注释.
            var param = {};
            util.rest("/fgadmin/checkLogin", {
                method: "get",
                param: param,
                sync: true,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend,
            });
        },
        //用户登出
        logout: function(onload, onerror, onend) {
            // 已经注释.
            var param = {};
            util.rest("/fgadmin/logout", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //用户登录(暂时不删除,用作后续注释模板)
        login: function(data, onload, onerror, onend) {
            /**
             * @interface   登录相关-进行登录√
             * 先将密码进行md5._$md52hex(password)
             * 再使用preEncryptData再将返回的结果进行
             * var keys = et.encrypt(password, result.pubKey, result.modulus, result.nonce)
             * 然后
             * secKey:encodeURIComponent(keys.encSecKey)
             * password:keys.encText
             * loginToken:encodeURIComponent(result.loginToken)
             *
             * @module      common
             * @uri         /common/fgadmin/login
             * @method      post
             * @contentType json
             * @param       {Number}        phoneArea       手机区号 例如：86
             * @param       {Number}        phoneNumber     登录手机号
             * @param       {String}        captcha         验证码
             * @param       {String}        secKey          钥匙
             * @param       {String}        password        md5后的密码
             * @param       {String}        loginToken      Token值
             * @return      {Object}        re              返回数据
             * @property    {Number}        re..code        200表示请求成功
             * @property    {Object}        re..result      返回的对象
             **/
            var param = JSON.parse(JSON.stringify(data));
            util.rest("/common/fgadmin/login", {
                method: "post",
                param: param,
                sync: true,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //
        //活动热门片段
        getoliveActivity: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/oliveActivity/list", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //达人活动获取活动详情
        getTalentActivityDetail: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/talentActivity/detail", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取精彩片段
        getLiveVideotapeList: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/liveActivityRecord/list", {
                method: "get",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //公共摄像头观看数+1
        cameraView: function(data, onload, onerror, onend) {
            var param = data;
            util.rest("/live/square/camera/view", {
                method: "post",
                param: param,
                timeout: 30000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //获取专题列表
        getActivityList: function(data, onload, onerror, onend) {
            //var param = JSON.parse(JSON.stringify(data));
            var param = data;
            util.rest("/live/square/activityManager/list", {
                method: "get",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //修改摄像机名称
        modifyCameraName: function(data, onload, onerror, onend) {
            //var param = JSON.parse(JSON.stringify(data));
            var param = data;
            util.rest("/live/fgadmin/camera/setCameraName", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
        //搜索主人摄像机
        searchCameraByName: function(data, onload, onerror, onend) {
            //var param = JSON.parse(JSON.stringify(data));
            var param = data;
            util.rest("/live/fgadmin/camera/searchOwnerCameras", {
                method: "post",
                param: param,
                timeout: 3000,
                onload: onload,
                onerror: onerror,
                onend: onend
            });
        },
    };
    return rest;
});
