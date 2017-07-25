var debugmode = false;
var mobileIP;
var state = deviceFileManagerinit; //differentwifi init samewifi
var frame;
var intervalIsRunning;
var devicesIP;
var deviceUrl;

var testFileurl = 'http://192.168.12.33:45678/';
var testrequesturl = 'http://www.robyun.com/projector/wechat/signature?noncestr=727be54e-145a-4705-8a45-44be381f02c8&timestamp=1494331792&url=http%3A%2F%2Flocalhost%3A8080%2FtvControllerFileManager%2Ftvcontroller.html%3Fapi_path%3Dprojector%26app_id%3Dwx4659ac707a4d7397%26mode%3Ddebug'
var testrequesturl2 = 'http://192.168.12.48:45678'
var flieManagerFrameSrc = 'https://www.baidu.com/';
var flieManagerFrameNav = 'tvfilemanager.html';
var intervalId;

function iframeWirelessLoad() {
    console.log('iframeWirelessLoad:');
    frame = $('#iframe_filemanager').contents();
    frame.find('.divRetry').on('touchstart touchend', function(event) {
        if (event.type === 'touchstart') {
            frame.find('.divRetry').css({
                'background-position': '100%  0%'
            });
            return;
        }
        if (event.type === 'touchend') {
            frame.find('.divRetry').css({
                'background-position': '100%  100%'
            });
        }
    });
    //updateDebugView();
}
