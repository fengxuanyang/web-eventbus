###eventbus实现event 广播
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

但是实际使用中发现
###遇到问题：
在输入法显示的情况下， $(document).trigger(event);发送广播...会发现一个奇怪的现象：输入法界面隐藏了
###类似情况：
在输入法显示的情况下。点击输入框以外的界面，也会出现类似的现象
可见 $(document).trigger(event) 会引起界面的响应，
其实仔细想想也不难，毕竟 $(document).trigger(event);是可以模仿click事件的。所以1和2是同样的问题
为了屏蔽这个问题，需要自己实现一个通讯通道：在原来的基础上增加了eventbus
