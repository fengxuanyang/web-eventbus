var wechatready = false,
    bleconnected = false;

var mydeviceid;
var mysignature;
var deviceip;
var projectorAgency = {};
projectorAgency.getProjectorAgency = {
    myRepsonseCallback: {},
    wechatJsapi: {
        configWeChat: function(mySignature) {
            showResult('configWeChat', mySignature);
            var wxappId = getUrlParam(appId);
            wx.config({
                beta: true,
                debug: true, // 开启调试模式
                appId: wxappId,
                timestamp: mytimestamp,
                nonceStr: mynonceStr,
                signature: mySignature,
                jsApiList: [
                    'checkJsApi',
                    'getNetworkType',
                    'openWXDeviceLib',
                    'closeWXDeviceLib',
                    'getWXDeviceInfos',
                    'sendDataToWXDevice',
                    'startScanWXDevice',
                    'stopScanWXDevice',
                    'connectWXDevice',
                    'disconnectWXDevice',
                    'getWXDeviceTicket',

                    'onWXDeviceBindStateChange',
                    'onWXDeviceStateChange',
                    'onReceiveDataFromWXDevice',
                    'onScanWXDeviceResult',
                    'onWXDeviceBluetoothStateChange',
                ]
            });
        },
        
        getDeviceInfo: function() {
            showResult('getWXDeviceInfos', 'start');
            wx.invoke('getWXDeviceInfos', { 'connType': 'blue' },
                function(res) {
                    showResult('getWXDeviceInfos', JSON.stringify(res))
                    var len = res.deviceInfos.length;
                    if (len == 0) {
                        eventBus.getEventBus.broadcast(devicenone);
                        return;
                    }
                    for (i = 0; i < len; i++) {
                        if (res.deviceInfos[i].state === "connected") {
                            mydeviceid = res.deviceInfos[i].deviceId;
                            $("#device_state").append("deviceid: " + mydeviceid + "\r\n");
                            eventBus.getEventBus.broadcast(deviceconnected);
                            return;
                        }
                    }
                    eventBus.getEventBus.broadcast(devicedisconnected);
                });
        },

        connectWXDevice: function() {
            wx.invoke('connectWXDevice', { 'deviceId': mydeviceid, 'connType': 'blue' }, function(res) {
                console.log('connectWXDevice', res);
            });
        },

        startScanWXDevice: function() {
            wx.invoke('startScanWXDevice', { ' connType': 'lan' }, function(res) {
                console.log('startScanWXDevice', JSON.stringify(res));
                showResult('openWXDeviceLib', JSON.stringify(res));
            });
        },

        sendDada: function(base64Str, callback) {
            showResult('sendDada', base64Str);
            var myCallback = callback;
            wx.invoke('sendDataToWXDevice', { 'deviceId': mydeviceid, 'connType': 'blue', 'base64Data': base64Str },
                function(res) {
                    myCallback(JSON.stringify(res));
                    showResult("callback sendDataToWXDevice", JSON.stringify(res));
                });
            showResult("end  sendData", base64Str);
        },

        registerDevicesEventListener: function() {
            wx.error(function(res) {
                showResult("error", JSON.stringify(res));
                eventBus.getEventBus.broadcast(deviceerror);
            });
            wx.on('onWXDeviceBluetoothStateChange', function(res) {
                if (res.state == 'on') {
                    projectorAgency.getProjectorAgency.wechatJsapi.connectWXDevice();
                } else {
                    eventBus.getEventBus.broadcast(btoff);
                }
                showResult("onWXDeviceBluetoothStateChange", JSON.stringify(res));
            });

            //设备连接状态改变 connecting 连接中， connected 连接上，disconnected 连接断开
            wx.on('onWXDeviceStateChange', function(res) {
                showResult("onWXDeviceStateChange", JSON.stringify(res));
                if (res.state == 'connecting') {
                    eventBus.getEventBus.broadcast(deviceconnecting);

                } else if (res.state == 'connected') {
                    eventBus.getEventBus.broadcast(deviceconnected);
                } else if (res.state == 'disconnected') {
                    eventBus.getEventBus.broadcast(devicedisconnected);
                }
            });

            wx.on('onReceiveDataFromWXDevice', function(res) {
                var responsedata = getResponseFromBase64(res.base64Data);
                showResult("onReceiveDataFromWXDevice", JSON.stringify(res));
                projectorAgency.getProjectorAgency.myRepsonseCallback(responsedata);
            });
        },

        openDevice: function() {
            showResult('openDevice');
            wx.invoke('openWXDeviceLib', { 'connType': 'blue' },
                function(res) {
                    if (res.err_msg == 'openWXDeviceLib:ok') {
                        var result;
                        if (res.bluetoothState == 'off') {
                            eventBus.getEventBus.broadcast(btoff);
                            result = "请打开手机蓝牙";
                        };
                        if (res.bluetoothState == 'unauthorized') {
                            eventBus.getEventBus.broadcast(btoff);
                            result = "请授权蓝牙功能";
                        };
                        if (res.bluetoothState == 'on') {
                            result = "蓝牙已打开";
                        };
                    } else {
                        result = "openWXDeviceLib 失败";
                        eventBus.getEventBus.broadcast(devicedisconnected);
                    }
                    showResult('openWXDeviceLib', JSON.stringify(res) + ",result:" + result);
                });
        },

        inntWeChat: function() {
            showResult('inntWeChat');
            eventBus.getEventBus.broadcast(wxready);
            queryWeChatSignature(getUrlParam(apiPath), mynonceStr, mytimestamp, window.location.href, function(data) {
                showResult('queryWeChatSignature data:', data);
                if (data != null) {
                    var signature = JSON.parse(data).signature;
                    showResult(" signature:", signature);
                    projectorAgency.getProjectorAgency.wechatJsapi.configWeChat(signature);
                } else {
                    showResult("queryWeChatSignature  error ", "data == null");
                }
            });
        },
    },

    initAgency: function(repsonseCallback) {
        showResult('initAgency');
        this.myRepsonseCallback = repsonseCallback;
        this.wechatJsapi.inntWeChat();
    },

    /**
     *send the cmd encoded ,After Encoded by protobuffer
     */
    sendCommand: function(protobufcmd, callback) {
        showResult('sendCommand', protobufcmd);
        var cmd64 = bytesToBase64(protobufcmd);
        this.wechatJsapi.sendDada(cmd64, callback);
    },

    connectProjector: function() {
        showResult('connectProjector');
    },
}



wx.ready(function() {
    eventBus.getEventBus.broadcast(wxready);
    projectorAgency.getProjectorAgency.wechatJsapi.openDevice();
    projectorAgency.getProjectorAgency.wechatJsapi.getDeviceInfo();
    projectorAgency.getProjectorAgency.wechatJsapi.registerDevicesEventListener();
    projectorAgency.getProjectorAgency.wechatJsapi.startScanWXDevice();
});
