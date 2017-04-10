define(['jquery'], function($) {
    /**
     * 所有内部调用的接口
     */
    var api = {
        USER: {
            'getAccountInfo': './qyapi/getAccountInfo', //账户信息
            'login': './qyapi/login', //账户登陆
            'logout': './qyapi/logout', //账户登出
            'checkIfEmailExists': './qyapi/checkIfEmailExists', //账户email是否存在
            'register': './qyapi/register', //账户注册
            'getImageCode': './qyapi/getImageCode', //获取图形验证码
            'getSmsCode': './qyapi/getSmsCode', //获取短信验证码
            'startResetPassword': './qyapi/startResetPassword', //重置密码step1
            'sendResetPasswordVerifyCode': './qyapi/sendResetPasswordVerifyCode', //重置密码step2
            'resetPasswordVerifyCode': './qyapi/resetPasswordVerifyCode', //重置密码step3
            'setNewPassword': './qyapi/setNewPassword', //设置新密码

            'getAlertInfo': './qyapi/getAlertInfo', //余额预警信息
            'setAlertBalance': './qyapi/setAlertBalance', //余额预警阈值设置
            'setAlertMobile': './qyapi/setAlertMobile', //余额预警手机设置
            'removeAlertMobile': './qyapi/removeAlertMobile', //删除余额预警手机设置
            'setAlertEmail': './qyapi/setAlertEmail' //余额预警邮件设置
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
        }
    };
    return api;
});