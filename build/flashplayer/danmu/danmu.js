define(['text!./danmu.html',
        'text!./index.css',
    'base/element',
    'base/event',
    'util/cache/cookie'], function(template, _css, _e, v, _j , _p) {

    var FlashDanmu = Regular.extend({
        template: template,
        data : {
            danmuObj:{
                firstTime:true,
                danmuHasStart:false,
            },
        },

        /**
         * [初始化弹幕]
         * @return {[type]} [description]
         */
        initDanmu:function(obj){
            this.stopDanmu();
            this.chatModule = obj;
            $("#danmu").danmu({
                left:0,
                top:0,
                height:"90%",
                width:"100%",
                speed:10000,
                opacity:1,
                font_size_small:16,
                font_size_big:24,
                top_botton_danmu_time:6000
            });
        },
        destroy: function () {
            this.supr(); 
        },
        /**
         * [开始弹幕]
         * @return {[type]} [description]
         */
        startDanmu:function(){
            $('#danmu').danmu('danmuInit');
            $('#danmu').danmu('danmuStart');
            //$('#danmu').danmu('danmuResume');
            if(this.data.regularObj.data.cameraData && this.data.regularObj.data.cameraData.cameraDetail
                && this.data.regularObj.data.cameraData.cameraDetail.showCaptionType === 1){
                //实时模式
                this.data.regularObj.chatModule.sendDanmu();
            }else{
                //循环模式
                this.data.regularObj.chatModule.startDanmu(1);
                this.data.regularObj.chatModule.sendDanmu();
            }
        },
        /**
         * [结束弹幕]
         * @return {[type]} [description]
         */
        stopDanmu:function(){
            //$('#danmu').danmu('danmuStop');
            this.data.regularObj.chatModule.stopDanmu(1);
        },
    });

    return FlashDanmu;
});