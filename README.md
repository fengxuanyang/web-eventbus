##eventbus 实现event 广播

在js中，经常使用这样的方式进行event广播
function triggerEvent(state) {
    var event = $.Event(state);
    $(document).trigger(event);
}

$(document).on(EVENT_WIFI_DISCONNECTED, function () {
        netStatus &= (~WIFI_STATUS_OK);
        if (currentFrame != FRAME_WIFI) {
            switchFrame(FRAME_WIFI_SETTING);
        } else {
            $('.weui-dialog__bd').text("投影仪网络连接失败");
            mWarningDlg.fadeIn(100);
       }
});

