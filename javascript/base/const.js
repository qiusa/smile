define(['jquery'], function($) {
    /**
     * 所有内部调用的接口
     */
    var api = {
        USER: {
            'getAccountInfo': './qyapi/user/getAccountInfo', //账户信息
            'login': './qyapi/user/login', //账户登陆
            'logout': './qyapi/user/logout', //账户登出
            'checkIfEmailExists': './qyapi/user/checkIfEmailExists', //账户email是否存在
            'register': './qyapi/user/register', //账户注册
            'getImageCode': './qyapi/user/getImageCode', //获取图形验证码
            'getSmsCode': './qyapi/user/getSmsCode', //获取短信验证码
            'startResetPassword': './qyapi/user/startResetPassword', //重置密码step1
            'sendVerifyCode': './qyapi/user/sendVerifyCode', //重置密码step2
            'verifyCode': './qyapi/user/verifyCode', //重置密码step3
            'setNewPassword': './qyapi/user/setNewPassword', //设置新密码

            'getAlertInfo': './qyapi/user/getAlertInfo', //余额预警信息
            'setAlertBalance': './qyapi/user/setAlertBalance', //余额预警阈值设置
            'setAlertMobile': './qyapi/user/setAlertMobile', //余额预警手机设置
            'removeAlertMobile': './qyapi/user/removeAlertMobile', //删除余额预警手机设置
            'setAlertEmail': './qyapi/user/setAlertEmail', //余额预警邮件设置
            'removeAlertEmail': './qyapi/user/removeAlertEmail' //删除余额预警手机设置
        },
        DEVICE: {
            'deleteDevice': './qyapi/device/deleteDevice', //删除设备
            'setDeviceName': './qyapi/device/setDeviceName', //设置设备名称
            'deviceList': './qyapi/device/deviceList', //获取用户设备列表
            'deviceDetail': './qyapi/device/deviceDetail', //获取单个设备信息
            'setDeviceConfig': './qyapi/device/setDeviceConfig', //设置摄像机属性
            'getDeviceConfig': './qyapi/device/getDeviceConfig', //获取摄像机属性
            'playDevice': './qyapi/device/playDevice', //播放摄像机
            'stopPlay': './qyapi/device/stopPlay', //停止播放摄像机
            'deviceRecords': './qyapi/device/deviceRecords', //获取设备录像记录
            'deleteRecords': './qyapi/device/deleteRecords', //删除录像记录
        },
        COMPANY: {
            'stats': './qyapi/company/stats', //企业信息详情
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats', //
            'stats': './qyapi/company/stats' //
        }
    };
    return api;
});