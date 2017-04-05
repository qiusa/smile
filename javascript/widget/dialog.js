/** * 操作提示浮层 */define(['regularjs', '../3rd/anime.js', '../base/util.js'], function(Regular, anime, util) {    require('../../css/dialog.css');    var diglogTpl = Regular.extend({        name: 'diglogTpl',        data: {            id: 'test',            single: false,            singleCenter: false, //一个居中按钮            noBtn: true, //是否有按钮            title: '弹窗',            confirmBtnText: '下一步',            confirmCallback: function() {},            cancelBtnText: '取消',            cancelCallback: function() {},            width: 480,//宽度            height: 390,//高度            isAnimate: true, //是否有动画            isAnimateStart: true,//是否有开始动画（优先级大于isAnimate）            //noBtn: false, //是否有按钮            isClose: true //回调成功后是否关闭弹窗        },        template: '<div class="m-dialog">\                        <div class="m-over" id="over{id}"></div>\                        <div class="dialog-main" id="dialog{id}" style="width: {width}px;height: {height}px;">\                            <h2 class="dialog-head">\                                <span class="title">{title}</span>\                                <i class="icon-close" on-click={this.close()}></i>\                            </h2>\                            <div>{#include this.$body}</div>\                            {#if !singleCenter}\                            <div class="btn-group" r-hide={!pro.noBtn}>\                                {#if !single}<button class="btn btn-cancel" on-click={this.cancelCallback()}>{cancelBtnText}</button>{/if}\                                <button class="btn btn-ok" on-click={this.confirmCallback($event)}>{confirmBtnText}</button>\                            </div>\                            {#else}\                            <div class="btn-group" r-hide={!pro.noBtn}>\                                <button class="btn btn-center" on-click={this.confirmCallback($event)}>{confirmBtnText}</button>\                            </div>\                            {/if}\                        </div>\                    </div>',        config: function() {            for (var key in this.data) {                console.info(key,this.data.pro.hasOwnProperty(key))                if (this.data.pro.hasOwnProperty(key)) {                    this.data[key] = this.data.pro[key];                }            }            //noBtn这个参数可在外面动态控制            if (typeof this.data.pro.noBtn != 'boolean') {                this.data.pro.noBtn = true;            }            console.info('this.da222ta', this.data)        },        init: function() {            var self = this;            console.info('1111如果存在就重新开始动画');            setTimeout(function() {                self.show();            }, 0); //延时触发 否则无效果        },        cancelCallback: function() {            this.data.cancelCallback && this.data.cancelCallback();            this.close();            //this.destroy();        },        confirmCallback: function() {            this.data.confirmCallback && this.data.confirmCallback();            if (this.data.isClose) {                this.close();            }            //this.destroy();        },        show: function() {            //document.getElementById('dialog' + this.data.id).style.display = 'block';            if (this.data.isAnimate && this.data.isAnimateStart) {                this.anmiateIn(1000);            } else {                document.getElementById('dialog' + this.data.id).style.webkitTransform = 'translateY(150px)';                document.getElementById('dialog' + this.data.id).style.mozTransform = 'translateY(150px)';                document.getElementById('dialog' + this.data.id).style.msTransform = 'translateY(150px)';                document.getElementById('dialog' + this.data.id).style.oTransform = 'translateY(150px)';                document.getElementById('dialog' + this.data.id).style.transform = 'translateY(150px)';                document.getElementById('over' + this.data.id).style.opacity = 0.5;            }        },        close: function() {            console.info('l靠靠靠', this.data.pro)            if (this.data.isAnimate) {                this.anmiateOut();            } else {                this.destroy();            }        },        /**         * 动画效果         */        anmiateIn: function(duration) {            console.info('如果存在就重新开始动画',duration);            var relativeOffset = anime.timeline();            relativeOffset                .add({                    targets: '#dialog' + this.data.id,                    easing: 'easeOutQuint',                    opacity: 1,                    offset: 0,                    translateY: 150                })                .add({                    targets: '#over' + this.data.id,                    easing: 'easeOutQuint',                    offset: 0,                    opacity: 0.5                });        },        /**         * 动画效果         */        anmiateOut: function() {            var self = this;            var relativeOffset = anime.timeline();            relativeOffset                .add({                    targets: '#over' + this.data.id,                    easing: 'easeOutQuint',                    offset: 0,                    opacity: 0,                    complete: function() {                        console.log('anime.easings')                        self.destroy(); //结束动画后销毁                    }                })                .add({                    targets: '#dialog' + this.data.id,                    easing: 'easeOutQuint',                    offset: 0, //开始时间轴                    translateY: 50,                    opacity: 0,                    complete: function() {                        console.log(anime.easings)                        self.destroy(); //结束动画后销毁                    }                })        }    });    var dialog = Regular.extend({        name: 'Dialog',        template: '',        init: function() {            this.$update();            var self = this;            /*setTimeout(function() {                self.anmiateIn();            }, 0);//延时触发 否则无效果*/        },        delPhone: function() {            console.info('del')        }    });    return dialog;});