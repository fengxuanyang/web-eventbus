var wechatready = false;
const WX_OPENID = 'openid';

var mydeviceid;
var mysignature;
var deviceip;
var openID = "oZHI-xKm8VCdHnq0E6K1YS6NEHaM";
var device = {
    "deviceid": "k1j23kqjkljsdf908afjlsdf0ga",
    "ticket": "gh_653ab62a19e7_08ddcee5df969ee5",
};

function inntWeChat() {
    openID = getUrlParam(WX_OPENID);
    queryWeChatSignature(getUrlParam(apiPath), mynonceStr, mytimestamp, window.location.href, function (data) {
        if (data != null) {
            mysignature = JSON.parse(data).signature;
            showResult(" mysignature:", mysignature)
            configWeChat();
        } else {
            showResult("queryWeChatSignature  error ", "data == null");
        }
    });
}


function configWeChat() {
    var wxappId = getUrlParam(appId);
    wx.config({
        beta: true,
        debug: debugmode, // 开启调试模式
        appId: wxappId,
        timestamp: mytimestamp,
        nonceStr: mynonceStr,
        signature: mysignature,
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
}

wx.ready(function () {
    wechatready = true;
    triggerEvent(wxready);
    openDevice();
    getDeviceInfo();
    registerDevicesEventListener();
    startScanWXDevice();
});


function startScanWXDevice() {
    wx.invoke('startScanWXDevice', {' connType': 'lan'}, function (res) {
        console.log('startScanWXDevice', JSON.stringify(res));
        showResult('openWXDeviceLib', JSON.stringify(res));
    });
}


function getDeviceTicket(id) {
    showResult('getDeviceTicket start', "id:" + id, "controller");
    var deviceid = id;
    wx.invoke('getWXDeviceTicket', {'deviceId': id, 'type': '2', 'connType': 'blue'}, function (res) {
        showResult('getDeviceTicket  result', JSON.stringify(res), "controller");
        if (res.err_msg == 'getWXDeviceTicket:ok') {
            device.ticket = res.ticket;
            device.deviceid = deviceid;
            showResult('getDeviceTicket  device', JSON.stringify(device), "controller");
        }
    });
}

function openDevice() {
    wx.invoke('openWXDeviceLib', {'connType': 'blue'},
        function (res) {
            if (res.err_msg == 'openWXDeviceLib:ok') {
                var result;
                if (res.bluetoothState == 'off') {
                    triggerEvent(btoff);
                    result = "请打开手机蓝牙";
                }
                ;
                if (res.bluetoothState == 'unauthorized') {
                    result = "请授权蓝牙功能";
                }
                ;
                if (res.bluetoothState == 'on') {
                    // triggerEvent(btopen);
                    result = "蓝牙已打开";
                }
                ;
            } else {
                result = "openWXDeviceLib 失败";
                triggerEvent(devicedisconnected);
            }
            showResult('openWXDeviceLib', JSON.stringify(res) + ",result:" + result);
        });
}

function getDeviceInfo() {
    showResult('getWXDeviceInfos', 'start');
    wx.invoke('getWXDeviceInfos', {'connType': 'blue'},
        function (res) {
            showResult('getWXDeviceInfos', JSON.stringify(res))
            var len = res.deviceInfos.length;
            if (len == 0) {
                triggerEvent(devicenone);
                return;
            }
            for (i = 0; i < len; i++) {
                if (res.deviceInfos[i].state === "connected") {
                    mydeviceid = res.deviceInfos[i].deviceId;
                    $("#device_state").append("deviceid: " + mydeviceid + "\r\n");
                    triggerEvent(deviceconnected);
                    getDeviceTicket(mydeviceid);
                }
            }

        });
}


function unbindDevices(callback) {
    showResult('unbindDevices', "openID:" + openID + ",ticket:" + device.ticket + ",deviceid:" + device.deviceid, "controller");
    var requesturl = "http://www.robyun.com/dev_projector/device/unbind";
    // text/html;charset=UTF-8
    var datajson = JSON.stringify({ticket: device.ticket, openid: openID, device_id: device.deviceid});
    $.ajax({
        url: requesturl,
        type: "post",
        dataType: "json",
        data: datajson,
        contentType: "application/json",
        success: function (data) {
            callback(data);
            alert('unbindDevices  result:' + JSON.stringify(data));
            showResult('unbindDevices result', JSON.stringify(data), "controller");
        },
        error: function () {
            alert('unbindDevices  error:');
            callback(null);
        }
    });
}

function connectWXDevice() {
    wx.invoke('connectWXDevice', {'deviceId': mydeviceid, 'connType': 'blue'}, function (res) {
        console.log('connectWXDevice', res);
    });
}

function sendDada(base64Str, callback) {
    var myCallback = callback;
    showResult(" sendDada start ：", (new Date().valueOf()));
    wx.invoke('sendDataToWXDevice', {'deviceId': mydeviceid, 'connType': 'blue', 'base64Data': base64Str},
        function (res) {
            myCallback(JSON.stringify(res));
            showResult("sendDada end：", (new Date().valueOf()));
            showResult("callback sendDataToWXDevice", JSON.stringify(res));
        });
    showResult("end  sendData", base64Str);

}

function registerDevicesEventListener() {
    wx.error(function (res) {
        showResult("error", JSON.stringify(res));
    });


    wx.on('onScanWXDeviceResult', function (res) {
        showResult("onScanWXDeviceResult", JSON.stringify(res));
    });

    wx.on('onWXDeviceBluetoothStateChange', function (res) {
        if (res.state == 'on') {
            triggerEvent(btopen);
            connectWXDevice();
        } else {
            triggerEvent(btoff);
        }
        showResult("onWXDeviceBluetoothStateChange", JSON.stringify(res));
    });

    wx.on('onWXDeviceBindStateChange', function (res) {
        showResult("onWXDeviceBindStateChange", JSON.stringify(res));
    });

    //设备连接状态改变 connecting 连接中， connected 连接上，disconnected 连接断开
    wx.on('onWXDeviceStateChange', function (res) {
        showResult("onWXDeviceStateChange", JSON.stringify(res));
        if (res.state == 'connecting') {
            triggerEvent(deviceconnecting);

        } else if (res.state == 'connected') {
            triggerEvent(deviceconnected);
        } else if (res.state == 'disconnected') {
            triggerEvent(devicedisconnected);
        }
    });

    wx.on('onReceiveDataFromWXDevice', function (res) {
        var responsedata = getResponseFromBase64(res.base64Data);
        if (responsedata.constructor == proto.airsync.EditFocusChangePush) {
            var event = $.Event(EVENT_EDIT_FOCUS_CHANGE);
            $(document).trigger(event, [{focusState: responsedata.getFocus(), text: responsedata.getText()}]);
            return;
        }

        if (responsedata.constructor == proto.airsync.FileManagerResponse) {
            var event = $.Event(deviceipback);
            $(document).trigger(event, [responsedata.getUrl()]);
            return;
        }
        if (responsedata.constructor == proto.airsync.WifiResponse) {
            var wifilist = responsedata.getWifiinfoList();

            for (var i = 0; i < wifilist.length; i++) {
                var wifiinfo = wifilist[i];
                showResult('wifiinfo:', wifiinfo);
            }
            subEvent(EVENT_WIFI_LSIT, wifilist);
            return;
        }

        if (responsedata.constructor == proto.airsync.IpResponse) {
            var ip = responsedata.getIp();
            subEvent(EVENT_IP_GET, ip);
            showResult('onReceiveDataFromWXDevice', 'IpResponse');
            return;
        }

    });
}


function triggerEvent(state) {
    var event = $.Event(state);
    $(document).trigger(event);
}
