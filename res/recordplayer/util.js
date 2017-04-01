/*******************************************************************************
 * 录像播放器util.
 * @hzgongyuli
 *
 ******************************************************************************/
define([
    'base/element',
    'base/util',
    '{pro}base/util.js'
], function(e, u, util, p){
    var util  = {
        data : {
            recordPlayerSet:{
                parentWidth:1020,
                parentTop:246,
                playerWidth:760,
                playerHeight:426,
            },
        },
        /**
         * [getRecordPlayerPosition 获取录像播放器的位置]
         * @return {[type]} [位置对象]
         */
        getRecordPlayerPosition:function(playerConfig){
            var positon = {};
            var scrollx = 0,
                scrolly = 0;
            var recordPlayerSet = this.data.recordPlayerSet;
            if(document.body.scrollTop){ //非标准写法,chrome能识别
                scrollLeft=document.body.scrollLeft;
                scrollTop=document.body.scrollTop;
            }
            else{ //标准写法
                scrollLeft=document.documentElement.scrollLeft;
                scrollTop=document.documentElement.scrollTop;
            }
            var parentTop = playerConfig? playerConfig.parentTop : recordPlayerSet.parentTop;
            positon.top = (scrollTop + (document.documentElement.clientHeight - recordPlayerSet.playerHeight) / 2 - parentTop) ;
            positon.left = (scrollLeft + (recordPlayerSet.parentWidth - recordPlayerSet.playerWidth) / 2) ;
            return positon;
        },
        
        appendProcessBar:function(){
            if(!document.querySelector(".vjs-bar-progress")){
                var barProcess = document.createElement("div");
                barProcess.className = "vjs-bar-progress";
                document.querySelector(".vjs-progress-holder").appendChild(barProcess);
            }
        },

        setLoadingNone:function(){
            document.querySelector(".vjs-loading-spinner").setAttribute("class", "u-player-dn"); 
        },
    };
    return util;
});






























