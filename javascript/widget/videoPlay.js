/** * 操作提示浮层 */define(['regularjs', '../3rd/anime.js', '../base/util.js', '../../javascript/3rd/recordplayer/video.js'], function(Regular, anime, util, VideoJS) {    require('../../javascript/3rd/recordplayer/video-js.css');    require('../../css/videoPlay.css');    return Regular.extend({        data: {            id: 'one',            url:'',            title: 'video',            confirmCallback: function() {},            cancelCallback: function() {},            isAnimate: true, //是否有动画            isAnimateStart: true,//是否有开始动画（优先级大于isAnimate）            isClose: true, //回调成功后是否关闭弹窗            play:{                isLastRecord: true,//是否是最后一个视频                playEnd: false//是否播放结束            }        },        template: '<div class="m-video-play">\                        <div class="m-over" id="over{id}"></div>\                        <div class="video-play-main" id="videoPlay{id}">\                            <h2 class="video-play-head">\                                <span class="title"><span class="c1">查看云录像片段</span>{title}</span>\                                <i class="video-close-icon" on-click={this.close()}></i>\                            </h2>\                            <div class="video-play-body">\                                <video id="videoPlay" class="video-js vjs-default-skin"  controls preload="auto" width="760" height="426" poster="" data-setup="">\                                    <source src="" type="video/mp4"/>\                                </video>\                            </div>\                            <div class="video-end" r-hide={!play.playEnd}>\                                <a class="video-repeat" href="javascript:void(0);" on-click={this.recordPlayerRepeat()}></a>\                                <a class="video-next" href="javascript:void(0);" on-click={this.recordPlayerNext()}></a>\                            </div>\                        </div>\                    </div>',        config: function(data) {            //初始化配置            this.data.play = {                isLastRecord: true,//是否是最后一个视频                playEnd: false//是否播放结束            }            /*for (var key in this.data) {                console.info(key,this.data.pro.hasOwnProperty(key));                if (this.data.pro.hasOwnProperty(key)) {                    this.data[key] = this.data.pro[key];                }            }            //noBtn这个参数可在外面动态控制            if (typeof this.data.pro.noBtn != 'boolean') {                this.data.pro.noBtn = true;            }*/            console.info('this.da111ta', this.data)        },        init: function() {            var self = this;            setTimeout(function() {                self.videoRender();                self.show();            }, 0); //延时触发 否则无效果        },        videoRender: function() {            console.info('节点',$('#videoPlay'))            var self = this;            console.info(99991,this.myPlayer)            this.myPlayer = null;            this.myPlayer = VideoJS('videoPlay');            VideoJS("videoPlay").ready(function(){                console.info('73行',self.data.url);                //recPlyerUtil.appendProcessBar();                self.myPlayer.src(self.data.url);                                self.myPlayer.play();                self.myPlayer.addEvent("ended", function(){                    /*if(index == play.list.length-1){                        self.data.play.isLastRecord = true;                    }else{                        self.data.play.isLastRecord = false;                    }*/                    self.data.play.playEnd = true;                    self.$update();                });            });        },        /**         * 重播         */        recordPlayerRepeat: function() {            this.data.play.playEnd = false;            this.myPlayer.play();            this.$update();        },        /**         * 下一个播放         */        recordPlayerNext: function() {            console.info('ppoop')            return            var self = this;            var play = this.data.play;            play.playEnd = false;            play.currentIndex ++ ;            var index = play.currentIndex;            if(index == play.list.length){                play.isLastRecord = true;            }            var nextRecordObj = play.list[index];            if(!nextRecordObj) return;            play.yearAndMonth = nextRecordObj.yearAndMonth;            play.from = nextRecordObj.from;            play.to = nextRecordObj.to;            //已播            e._$addClassName('j-'+play.yearAndMonth+'-'+ play.currentIndex,'u-hadPlay');            this.myPlayer = VideoJS('videoPlay');            VideoJS("videoPlay").ready(function(){                // if(!document.querySelector(".vjs-bar-progress")){                //     var barProcess = document.createElement("div");                //     barProcess.className = "vjs-bar-progress";                //     document.querySelector(".vjs-progress-holder").appendChild(barProcess);                // }                recPlyerUtil.appendProcessBar();                self.myPlayer.src(nextRecordObj.url);                self.myPlayer.play();                self.myPlayer.addEvent("ended", function(){                    if(index == play.list.length-1){                        play.isLastRecord = true;                    }else{                        play.isLastRecord = false;                    }                    play.playEnd = true;                    self.$update();                });            });        },        cancelCallback: function() {            this.data.cancelCallback && this.data.cancelCallback();            this.close();        },        confirmCallback: function() {            this.data.confirmCallback && this.data.confirmCallback();            if (this.data.isClose) {                this.close();            }        },        show: function() {            if (this.data.isAnimate && this.data.isAnimateStart) {                this.anmiateIn(1000);            } else {                document.getElementById('videoPlay' + this.data.id).style.webkitTransform = 'translateY(150px)';                document.getElementById('videoPlay' + this.data.id).style.mozTransform = 'translateY(150px)';                document.getElementById('videoPlay' + this.data.id).style.msTransform = 'translateY(150px)';                document.getElementById('videoPlay' + this.data.id).style.oTransform = 'translateY(150px)';                document.getElementById('videoPlay' + this.data.id).style.transform = 'translateY(150px)';                document.getElementById('over' + this.data.id).style.opacity = 0.6;            }        },        close: function() {            console.info('l靠靠靠', this.data.pro);            console.info(this.data.isAnimate)            if (this.data.isAnimate) {                this.anmiateOut();            } else {                this.myPlayer && this.myPlayer.destroy();                this.destroy();            }        },        /**         * 动画效果         */        anmiateIn: function(duration) {            console.info('如果存在就重新开始动画',duration);            var relativeOffset = anime.timeline();            relativeOffset                .add({                    targets: '#videoPlay' + this.data.id,                    easing: 'easeOutQuint',                    opacity: 1,                    offset: 0,                    translateY: 150                })                .add({                    targets: '#over' + this.data.id,                    easing: 'easeOutQuint',                    offset: 0,                    opacity: 0.6                });        },        /**         * 动画效果         */        anmiateOut: function() {            var self = this;            var relativeOffset = anime.timeline();            console.info(9992)            relativeOffset                .add({                    targets: '#over' + this.data.id,                    easing: 'easeOutQuint',                    offset: 0,                    opacity: 0,                    complete: function() {                        console.log('anime.easings')                        self.destroy(); //结束动画后销毁                    }                })                .add({                    targets: '#videoPlay' + this.data.id,                    easing: 'easeOutQuint',                    offset: 0, //开始时间轴                    translateY: 50,                    opacity: 0,                    complete: function() {                        console.log(anime.easings)                        self.myPlayer && self.myPlayer.destroy();                        self.destroy(); //结束动画后销毁                    }                })        }    });});