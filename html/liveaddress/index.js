define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/liveaddress/index.html', '../../javascript/3rd/clipboard.js', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js', '../../html/sliderbar/index.js', '../../javascript/3rd/base64.js', '../../javascript/base/const.js', '../../javascript/3rd/cookie.js',], function(Regular, $, util, index, Clipboard, tip, dialog, sliderbar, Base64, api, cookie) {    require('../../css/liveaddress.css')    return Regular.extend({        template: '<sliderbarTpl pro = {user}>' + index + '</sliderbarTpl>',        data: {            //登陆账户密码            user: {                nick: '',                icon: '',                type: 2 //左侧导航栏模块标识            },            config: {                title: '', //标题                snapshotUrl: '', //封面图                description: '',                isEncrypt: false,                password: '', //md5播放密码                companyId: '', //简介                deviceId: '', // 设备id                cameraName: '', //设备名称                delFlag: 0, //播放状态                url: 'http://localhost:9999/play.html?id='//直播地址            },            show: {                check: false, //直播设置选中                radioCheck: false //播放密码是否有            },            error: {                titleError: '',                infoError: '',                pwdError: ''            }        },        init: function() {            this.initCtrol();            this.render();        },        /**         * 初始化控件         */        initCtrol: function() {            var self = this;            //提示框            this.tip = util.tip();            //复制            var clipboard = new Clipboard('#copyAddress');            clipboard.on('success', function(e) {                self.tip.showErrorTip('复制成功');                e.clearSelection();            });            clipboard.on('error', function(e) {                self.tip.showErrorTip('复制失败');            });        },        render: function() {            this.data.config.deviceId = Base64.decode(util.getQueryString('id'));            this.data.config.cameraName = Base64.decode(util.getQueryString('name'));            this.data.config.url = this.data.config.url + util.getQueryString('id');            console.info(this.data.config.deviceId);            util.rest(api.LIVEWEB.get, {                param: {                    deviceId: this.data.config.deviceId                },                method: 'post',                onload: function(data) {                    console.info('成功', data);                },                onerror: function(data) {                    console.info('牺牲', data);                }            })        },        play: function() {            var url = this.data.config.delFlag ? api.LIVEWEB.pause : api.LIVEWEB.play;            util.rest(url, {                param: {                    deviceId: this.data.config.deviceId                },                method: 'post',                onload: function(data) {                    console.info('成功', data);                },                onerror: function(data) {                    console.info('牺牲', data);                }            })         },        upload: function() {            document.getElementById('file').click()        },        /**         * 上传分享图片         */        imgChange: function(event) {            var fd = new FormData(),                uuid = util.uuid(),                self = this;                console.info('uuid',uuid)            fd.append('file', event.origin.files[0]);            fd.append('fileKey', uuid);            /*//创建xhr            var xhr = new XMLHttpRequest();            //fd.append("acttime", new Date().toString()); //本人喜欢在参数中添加时间戳，防止缓存（--、）            //进度条部分            xhr.upload.onprogress = function (evt) {                console.info('evt', evt.loaded)                if (evt.lengthComputable) {                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);                }            };            xhr.open("POST", api.LIVEWEB.upload, true);            xhr.send(fd);            xhr.onreadystatechange = function () {                console.info(999)                if (xhr.readyState == 4 && xhr.status == 200) {                    var result = xhr.responseText;                }            }                        return;*/            var xhrOnProgress = function(fun) {                xhrOnProgress.onprogress = fun; //绑定监听                //使用闭包实现监听绑                return function() {                    //通过$.ajaxSettings.xhr();获得XMLHttpRequest对象                    var xhr = $.ajaxSettings.xhr();                    //判断监听函数是否为函数                    if (typeof xhrOnProgress.onprogress !== 'function')                        return xhr;                    //如果有监听函数并且xhr对象支持绑定时就把监听函数绑定上去                    if (xhrOnProgress.onprogress && xhr.upload) {                        xhr.upload.onprogress = xhrOnProgress.onprogress;                    }                    return xhr;                }            }            $.ajax({                url: api.LIVEWEB.upload,                type: 'POST',                beforeSend: function(xhr) {                    if (cookie.get('token') && cookie.get('uid')) {                        xhr.setRequestHeader("token", cookie.get('token'));                        xhr.setRequestHeader("uid", cookie.get('uid'));                    }                },                xhr: xhrOnProgress(function(e) {                    console.log(9999998, e);                    var percent = e.loaded / e.total; //计算百分比                }),                cache: false,                data: fd,                processData: false,                contentType: false            }).done(function(data) {                console.info('res', data)            }).fail(function(data) {                console.info('djj', data)                self.tip.showErrorTip('失败');            });        },        /**         * 清空图片上传         */        picDel: function() {            this.data.generateData.shareData.imgUrl = '';            $('#fileUrl').val('');            this.$update();        },        verify: function() {            var reg = /^\d{1,6}$/; //不超过6位的纯数字            if (util.trim(this.data.config.title)) {                return {                    error: true,                    errmsg: '请输入标题'                }            }            if (util.trim(this.data.config.snapshotUrl)) {                return {                    error: true,                    errmsg: '请上传封面图'                }            }            if (util.trim(this.data.config.description)) {                return {                    error: true,                    errmsg: '请输入简介'                }            }            if (!util.trim(this.data.config.password)) {                return {                    error: true,                    errmsg: '密码不能为空！'                }            }            if (!reg.test(this.data.config.password)) {                return {                    error: true,                    errmsg: '请输入不超过6位的纯数字密码'                }            }            return {                title: this.data.config.title, //标题                snapshotUrl: this.data.config.snapshotUrl, //封面图                description: this.data.config.description,                isEncrypt: this.data.config.isEncrypt,                password: this.data.config.password, //md5播放密码                companyId: this.data.config.companyId, //简介                deviceId: this.data.config.deviceId // 设备id            }        },        save: function() {            this.data.error = {                titleError: '',                infoError: '',                pwdError: ''            }        }    });});