define(['regularjs', 'jquery', '../../javascript/base/util', '../../html/resetpwdsuccess/index.html', '../../javascript/widget/tip.js', '../../javascript/widget/dialog.js'], function(Regular, $, util, index, tip, dialog) {    require('../../css/resetpwdsuccess.css')    var index = Regular.extend({        template: index,        data: {        },        init: function() {            //提示框            this.tip = new tip();            this.tip.$inject('body');        }    });    return index;});