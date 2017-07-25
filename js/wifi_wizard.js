var mLastNetworkId = -1;
var mLoadingObj, mWifiListObj, mWifiItemsObj;
var connected = false;

$(document).ready(function() {
    iframeWifiSettingLoad();

});

function iframeWifiSettingLoad() {
    console.log('iframeWifiLoad:');
    $(".wifi-list").css("height", window.innerHeight / 100 * 70);
    mLoadingObj = $('#id_Loading');
    mWifiListObj = $('#id_WifiList');
    mWifiItemsObj = $('#id_WifiItems');
    // onWifiRefreshClick();
    // registerWifiEventListener();
    addWifiListItem(0) 
    hideWaiting();


}

function registerWifiEventListener() {
    $(document).on(EVENT_WIFI_LSIT, function(event, wifiList) {
        refreshWifiList(wifiList);
    });
}

function getWifiRssiIcon(rssi) {
    console.log('getWifiRssiIcon:');

    var rssiIcon = "res/signal_0.png";
    switch (rssi) {
        case 0:
            rssiIcon = "res/signal_1.png";
            break;
        case 1:
            rssiIcon = "res/signal_2.png";
            break;
        case 2:
            rssiIcon = "res/signal_3.png";
            break;
        case 3:
            rssiIcon = "res/signal_4.png";
            break;
    }
    return rssiIcon;
}

function getWifiState(state) {
    var wifiState = "";
    switch (state) {
        case proto.airsync.WifiState.ACTIVE:
            wifiState = "已连接";
            subEvent(EVENT_WIFI_CONNECTED);
            break;
        case proto.airsync.WifiState.SAVED:
            wifiState = "已保存";
            break;
        default:
            break;
    }
    return wifiState;
}

function refreshWifiList(responseData) {
    console.log('refreshWifiList:');
    hideWaiting();
    mWifiListObj.css("display", "block");
    mWifiItemsObj.empty();
    for (var index = 0; index < responseData.length; index++) {
        addWifiListItem(index + 1, responseData[index]);
    }

}



function addWifiListItem(index, wifiInfo) {
    console.log('addWifiListItem:');

    var ssid, networkId, security, rssi, state, httpCode = "";
    ssid = "test"; //wifiInfo.getSsid();
    networkId = index; //wifiInfo.getNetworkid();
    security = true; //wifiInfo.getIssecurity();
    rssi = -1; //wifiInfo.getRssi();
    state = getWifiState(proto.airsync.WifiState.SAVED); //getWifiState(wifiInfo.getState());
    //TODO: <---

    httpCode += "<div class='weui-flex wifi-item' onclick='onWifiItemClick(" + networkId + "," + security + "," + proto.airsync.WifiState.SAVED + ")'>" +
        "<div class='weui-flex__item wifi-item-desc'>";
    // //TODO: need fix to real code --->
    // ssid = wifiInfo.getSsid();
    // networkId = wifiInfo.getNetworkid();
    // security = wifiInfo.getIssecurity();
    // rssi = wifiInfo.getRssi();
    // state = getWifiState(wifiInfo.getState()); //getWifiState(proto.airsync.WifiState.INACTIVE); //
    // //TODO: <---

    // httpCode += "<div class='weui-flex wifi-item' onclick='parent.window.onWifiItemClick(" + networkId + "," + security + "," + wifiInfo.getState() + ")'>" +
    //     "<div class='weui-flex__item wifi-item-desc'>";

    if (state != "") {
        httpCode += "<p class='wifi-item-desc-ssid'>" + ssid + "</p>" +
            "<p class='wifi-item-desc-state'>" + state + "</p>";
    } else {
        httpCode += "<p class='wifi-item-index'>" + ssid + "</p>";
    }

    httpCode += "</div>" +
        "<div class='wifi-item-icon-div'>";

    if (security) {
        httpCode += "<img class='wifi-security-icon' src='res/security.png'>";
    }

    httpCode += "<img class='wifi-rssi-icon' src='" + getWifiRssiIcon(rssi) + "'>" +
        "</div>" +
        "</div>" +
        "<div class='weui-flex wifi-access-div' id='id_Access_" + networkId + "'>" +
        "<div class='weui-flex__item'>" +
        "<input class='wifi-access-input' id='id_AccessPassword_" + networkId + "' type='password' placeholder='请输入wifi密码'>" +
        "<button class='wifi-access-button btn-with-active' onclick='parent.window.onWifiAccessCancelClick(" + networkId + ")'>取消</button>" +
        "<button class='wifi-access-button btn-with-active' onclick='parent.window.onWifiAccessConnectClick(" + networkId + ")'>连接</button>" +
        "</div>" +
        "</div>" +
        "<div class='weui-flex wifi-action-div' id='id_Action_" + networkId + "'>" +
        "<div class='weui-flex__item'>" +
        "<button class='wifi-action-button btn-with-active' onclick='parent.window.onWifiActionCancelClick(" + networkId + ")'>取消</button>" +
        "</div>" +
        "<div class='weui-flex__item'>" +
        "<button class='wifi-action-button btn-with-active' onclick='parent.window.onWifiActionForgetClick(" + networkId + ")'>清除</button>" +
        "</div>" +
        "<div class='weui-flex__item'>" +
        "<button class='wifi-action-button btn-with-active' onclick='parent.window.onWifiActionConnectClick(" + networkId + ")'>连接</button>" +
        "</div>" +
        "</div>" +
        "<div style='margin-bottom: 2px'></div>" +
        "<div class='wifi-list-split-line'></div>";

    mWifiItemsObj.append(httpCode);
}

function closeAccessDiv(networkId) {
    mLastNetworkId = -1;
    $("#id_AccessPassword_" + networkId).val("");
    $("#id_Access_" + networkId).css("display", "none");
}

function onWifiAccessCancelClick(networkId) {
    closeAccessDiv(networkId);
}

function onWifiAccessConnectClick(networkId) {
    connect(networkId, $("#id_AccessPassword_" + networkId).val());
}

function closeActionDiv(networkId) {
    mLastNetworkId = -1;
    $("#id_Action_" + networkId).css("display", "none");
}

function onWifiActionCancelClick(networkId) {
    closeActionDiv(networkId);
}

function onWifiActionForgetClick(networkId) {
    forget(networkId);
    closeActionDiv(networkId);
}

function onWifiActionConnectClick(networkId) {
    connect(networkId, "");
}

function onWifiItemClick(networkId, security, state) {
    var accessObj, actionObj;
    console.log("networkId=" + networkId + " security=" + security + " state=" + state + " mLastNetworkId=" + mLastNetworkId);

    if (mLastNetworkId != -1) {
        accessObj = "#id_Access_" + mLastNetworkId;
        actionObj = "#id_Action_" + mLastNetworkId;
        $(accessObj).css("display", "none");
        $(actionObj).css("display", "none");

        if (mLastNetworkId == networkId) {
            mLastNetworkId = -1;
            return;
        }
    }

    accessObj = "#id_Access_" + networkId;
    actionObj = "#id_Action_" + networkId;

    if (state != proto.airsync.WifiState.INACTIVE) {
        $(actionObj).css("display", "flex")
    } else {
        if (security == 0) {
            connect(networkId, "");
        } else {
            $(accessObj).css("display", "flex")
        }
    }

    mLastNetworkId = networkId;
}

function showWaiting(msg) {
    console.log('msg:' + msg);
    console.log('msg:' + $(".weui-toast__content"));


    $(".weui-toast__content").text(msg);
    mLoadingObj.css("display", "block");
}

function hideWaiting() {
    mLoadingObj.css("display", "none");
}

function onWizardSpecClick() {
    window.location.assign("wifi_wizard_spec.html");
}

function onWifiRefreshClick() {
    showWaiting("Wi-Fi 扫描中");
    mWifiListObj.css("display", "none");
    connected = false;

    sendCommandBase64(getWifiScanCmd());
}

function onNextStepClick() {
    subEvent(EVENT_PROJECT_BT_CONNECTED);
}

function connect(networkId, password) {
    closeAccessDiv(networkId);
    showWaiting("Wi-Fi 连接中");
    sendCommandBase64(getWifiConnectCmd(networkId, password));
}

function forget(networkId) {
    showWaiting("Wi-Fi 清除中");
    sendCommandBase64(getWifiForgetCmd(networkId));
}

function setTouchStartListener() {
    var iframeObj = document.getElementById("iframe_filemanager");
    var btnActiveObj = iframeObj.contentWindow.document.getElementsByClassName("btn-with-active");
    for (var i = 0; i < btnActiveObj.length; i++) {
        btnActiveObj[i].addEventListener('touchstart', function() {}, false);
    }
}
