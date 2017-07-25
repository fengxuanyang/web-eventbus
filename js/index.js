//module status check
const BT_CHECK_WELL = 0x001;
const WIFI_CHECK_WELL = 0x010;
const DEVICE_IN_SAME_WIFI = 0x100;
//   
var currentStatus;

//module status check
const STATUS_ORIGINAL = 0x000;

const BT_STATUS_OK = 0x001;
const WIFI_STATUS_OK = 0x010;
const DEVICE_IN_ROOM_OK = 0x100;
var myCheck = BT_STATUS_OK;
var currentStatus = STATUS_ORIGINAL;

const CONTROLLER_CHECK = BT_STATUS_OK;
const WIRELESS_STORE_CHECK = BT_STATUS_OK | WIFI_STATUS_OK | DEVICE_IN_ROOM_OK;
const AIRSYNC_CHECK = BT_STATUS_OK | WIFI_STATUS_OK | DEVICE_IN_ROOM_OK;

const MODULE_CONTROLLER = 'tvcontroller';
const MODULE_WIRELESS_STORE = 'wireless_store';
const MODULE_AIRSYNC = 'sync_display';

const NAV_BT = 'nav_bt';
const NAV_WIFI = 'nav_wifi';
const NAV_WIFI_SETTING = 'nav_wifi_setting';

var currentModule;
var menuVontroller, menuWirelessStore, menuAsyncDisplay, topPullTab, topMenu, frameWrap;
var topMenuTop;
var topMenuHeight;
$(document).ready(function () {
    menuVontroller = $("#menu_controller");
    menuWirelessStore = $("#menu_wireless_store");
    menuAsyncDisplay = $("#menu_async_display");
    frameWrap = $('.iframe-wrap');
    topPullTab = $("#top_pull_tab");
    subscribeEvent();

    menuVontroller.on('click', function (event) {
        eventBus.getEventBus.broadcast(btoff, "fxy");
        switchTopMenu();

    });
    menuWirelessStore.on('click', function (event) {
        mobilewifioff.msg = "fxy";
        eventBus.getEventBus.broadcast(mobilewifioff);
        switchTopMenu();

    });
    menuAsyncDisplay.on('click', function (event) {
        eventBus.getEventBus.broadcast(pingdevicefail);
        switchTopMenu();
    });


    topPullTab.on('click', function (event) {
        switchTopMenu();
    });

//init module
    currentModule = getUrlParam("module");
    switch (currentModule) {
        case MODULE_CONTROLLER:
            myCheck = CONTROLLER_CHECK;
            break;
        case MODULE_WIRELESS_STORE:
            myCheck = WIRELESS_STORE_CHECK;
            break;
        case MODULE_AIRSYNC:
            myCheck = AIRSYNC_CHECK;
            break;
        default:
            myCheck = CONTROLLER_CHECK;
            break;
    }
    showResult("currentModule myCheck", myCheck);
    inntWeChat();
});

function subscribeEvent() {
    showResult("subscribeEvent");

    //for bt
    eventBus.getEventBus.subscribe(btoff, function (msg) {
        showResult("btoff::msg:", msg);

        switchNavPage(NAV_BT);
    });
    //for device
    eventBus.getEventBus.subscribe(deviceconnected, function () {
        currentStatus |= BT_STATUS_OK;
        checkCurrentStatus();

    });
    eventBus.getEventBus.subscribe(devicedisconnected, function () {
        currentStatus &= (~BT_STATUS_OK);
    });

    eventBus.getEventBus.subscribe(devicenone, function () {
        currentStatus = STATUS_ORIGINAL;
    });
    eventBus.getEventBus.subscribe(deviceconnecterror, function () {
        currentStatus &= (~BT_STATUS_OK);
    });

    //for mobile wifi
    eventBus.getEventBus.subscribe(mobilewifioff, function (msg) {
        showResult("mobilewifioff", msg);
        currentStatus &= (~WIFI_STATUS_OK);
        switchNavPage(NAV_WIFI);
    });

    //for mobile wifi
    eventBus.getEventBus.subscribe(projectorwifioff, function () {
        currentStatus &= (~WIFI_STATUS_OK);
        switchNavPage(NAV_WIFI_SETTING);

    });

    //for in same host
    eventBus.getEventBus.subscribe(pingdevicefail, function () {
        switchNavPage(NAV_WIFI_SETTING);
    });
}

function switchTopMenu() {
    if (!topMenu) {
        topMenu = $("#id_top_menu");
    }
    if (!topMenuHeight) {
        topMenuHeight = topMenu.find(".weui-navbar").height();
    }
    topMenuTop = topMenu.position().top;
    topMenu.animate({
            'top': (topMenuTop === 0) ? (0 - topMenuHeight) : 0
        },
        300,
        function () {
        });
}

function switchNavPage(navpage) {
    console.log("switchNavPage:" + (navpage === NAV_BT));
    $("#nav_page_bt").css('display', (navpage === NAV_BT) ? 'block' : 'none');
    $("#nav_page_wifisetting").css('display', (navpage === NAV_WIFI_SETTING) ? 'block' : 'none');
    $("#nav_page_wifi").css('display', (navpage === NAV_WIFI) ? 'block' : 'none');
}

function initModule() {


}


function checkCurrentStatus() {
    //1.check  wether myCheck contaions BT  2.check  current status  of BT
    if (((myCheck & BT_STATUS_OK) === BT_STATUS_OK) && ((currentStatus & BT_STATUS_OK) !== BT_STATUS_OK)) {
        switchNavPage(NAV_BT);
        return;
    }

    if (((myCheck & WIFI_STATUS_OK) === WIFI_STATUS_OK) && ((currentStatus & WIFI_STATUS_OK) !== WIFI_STATUS_OK)) {
        switchNavPage(NAV_WIFI);
        return;
    }

    if (((myCheck & DEVICE_IN_ROOM_OK) === DEVICE_IN_ROOM_OK) && ((currentStatus & DEVICE_IN_ROOM_OK) !== DEVICE_IN_ROOM_OK)) {
        switchNavPage(NAV_WIFI_SETTING);
        return;
    }

    handleModuleUI(currentModule);
}

var currentFrame;

function handleModuleUI(module) {
    console.log(module);
    currentFrame = module;
    // $('.iFrameWrap').attr('margin-left', '-100%');
    frameWrap.animate({
            'margin-left': '100%'
        },
        1,
        function () {
        });
    frameWrap.empty();
    var url;
    var loadFunction;
    var name;
    switch (module) {
        case MODULE_CONTROLLER:
            name = "controller";
            loadFunction = "onload='iframeControllerLoad()'";
            url = 'controller_frame.html';
            break;
        case MODULE_WIRELESS_STORE:
            name = "wireless";
            url = "http://" + projectorIP + ":45678";
            //url = "http://192.168.12.47:45678";
            loadFunction = "";
            break;
        case MODULE_AIRSYNC:
            url = 'airplay_frame.html';
            loadFunction = "onload='iframeAirPlayLoad()'";
            name = "airplay";
            break;
        default:
            name = "controller";
            loadFunction = "onload='iframeControllerLoad()'";
            url = 'controller_frame.html';
            break;

    }
    var frameTag = "<iframe id='iframe_filemanager'" + loadFunction + " name='" + name + "' src='" + url + "'  frameborder='no' style='width:100%;height:100%;;border-width:0 ;background-color: white'  ></iframe>";
    frameWrap.append(frameTag);
    frameWrap.animate({
            'margin-left': '0%'
        },
        1000,
        function () {
        });
}

function showLoadingToast() {
    if (!loadingToast) {
        loadingToast = $("#loading_toast");
    }
    var msg;
    arguments[0] ? msg = arguments[0] : msg = "连接中";
    loadingToast.find(".weui-toast_content").text(msg);
    loadingToast.fadeIn();

}

function hideLoadingToast() {
    if (!loadingToast) {
        loadingToast = $("#loading_toast");
    }
    loadingToast.fadeOut("100");
}
