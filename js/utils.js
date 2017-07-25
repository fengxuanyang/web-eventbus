/** Convert Base64 data to a string */
var toBinaryTable = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, 0, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
];
var base64Pad = '=';
var b64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
var logSrc = "<div class ='weui_cell' style='position:fixed; bottom:0%;width:100%;z-index:999'>" +
    "<div id='logdiv'>" +
    "<textarea class='weui_textarea logtext' placeholder=日志' rows='5' style='width:100%;background-color:#e4e4e4'></textarea>" +
    "</div>" +
    "</div>";
var isios;
var debugMode;
$(document).ready(function() {
    var ua = navigator.userAgent.toLowerCase();
    isios = ((ua.indexOf("iphone") != -1) || (ua.indexOf("ipad") != -1));
    debugMode = ("debug" == getUrlParam("mode"));
});

function string2Base64(rawString) {
    if (rawString.length == 0) {
        return "";
    }
    var result = "";
    // 给末尾添加的字符,先计算出后面的字符
    var d3 = rawString.length % 3;
    var endChar = "";
    if (d3 == 1) {
        var value = rawString.charCodeAt(rawString.length - 1);
        endChar = b64Chars.charAt(value >> 2);
        endChar += b64Chars.charAt((value << 4) & 0x3F);
        endChar += "==";
    } else if (d3 == 2) {
        var value1 = rawString.charCodeAt(rawString.length - 2);
        var value2 = rawString.charCodeAt(rawString.length - 1);
        endChar = b64Chars.charAt(value1 >> 2);
        endChar += b64Chars.charAt(((value1 << 4) & 0x3F) + (value2 >> 4));
        endChar += b64Chars.charAt((value2 << 2) & 0x3F);
        endChar += "=";
    }

    // 计算能进行多少次完整的转换, ** JavaScript中不会切掉小数点后面的数, 就是说tiems是浮点型数据,times不减一就会多循环一次
    // 在字符能被整除的情况下，会少循环一次所以要判断是否能被整除 (d3 == 0 ? 0 : 1)
    var times = rawString.length / 3;
    var startIndex = 0;
    // 开始计算
    for (var i = 0; i < times - (d3 == 0 ? 0 : 1); i++) {
        startIndex = i * 3;
        // 原字单个符串
        var S1 = rawString.charCodeAt(startIndex + 0); // 第一个字符的码值
        var S2 = rawString.charCodeAt(startIndex + 1); // 第二个字符的码值
        var S3 = rawString.charCodeAt(startIndex + 2); // 第三个字符的码值

        // 转换之后的单个字符的对应的Base64码值
        var s1 = b64Chars.charAt(S1 >> 2);
        var s2 = b64Chars.charAt(((S1 << 4) & 0x3F) + (S2 >> 4));
        var s3 = b64Chars.charAt(((S2 & 0xF) << 2) + (S3 >> 6));
        var s4 = b64Chars.charAt(S3 & 0x3F);
        // 添加到结果字符串中
        result += (s1 + s2 + s3 + s4);
    }

    return result + endChar;
}

function bytesToBase64(bytes) {
    // var byte = [0, 101, 10, 0, 16, 5];
    var binary = '';
    var u8buffer = new Uint8Array(bytes);
    var len = u8buffer.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(u8buffer[i]);
    }
    var base64String = window.btoa(binary);
    return base64String;
}



function base64ToArrayBuffer(base64Str) {
    var binaryString = window.atob(base64Str);
    var len = binaryString.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}


function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}


function binToBase64(bitString) {
    var result = "";
    var tail = bitString.length % 6;

    var bitStringTemp1 = bitString.slice(0, bitString.length - tail);
    var bitStringTemp2 = bitString.slice(bitString.length - tail, tail);
    for (var i = 0; i < bitStringTemp1.length; i += 6) {
        var index = parseInt(bitStringTemp1.slice(i, 6), 2);
        result += b64Chars[index];
    }
    bitStringTemp2 += new Array(7 - tail).join("0");
    if (tail) {
        result += b64Chars[parseInt(bitStringTemp2, 2)];
        result += new Array((6 - tail) / 2 + 1).join("=");
    }
    return result;
}

function base64ToString(data) {
    var result = '';
    var leftbits = 0; // number of bits decoded, but yet to be appended
    var leftdata = 0; // bits decoded, but yet to be appended
    // Convert one by one.
    for (var i = 0; i < data.length; i++) {
        var c = toBinaryTable[data.charCodeAt(i) & 0x7f];
        var padding = (data.charCodeAt(i) == base64Pad.charCodeAt(0));
        // Skip illegal characters and whitespace
        if (c == -1) continue;
        // Collect data into leftdata, update bitcount
        leftdata = (leftdata << 6) | c;
        leftbits += 6;
        // If we have 8 or more bits, append 8 bits to the result
        if (leftbits >= 8) {
            leftbits -= 8;
            // Append if not padding.
            if (!padding)
                result += String.fromCharCode((leftdata >> leftbits) & 0xff);
            leftdata &= (1 << leftbits) - 1;
        }
    }
    // If there are any bits left, the base64 string was corrupted
    if (leftbits)
        throw Components.Exception('Corrupted base64 string');
    return result;
}

function base64ToString(data) {
    var result = '';
    var leftbits = 0; // number of bits decoded, but yet to be appended
    var leftdata = 0; // bits decoded, but yet to be appended
    // Convert one by one.
    for (var i = 0; i < data.length; i++) {
        var c = toBinaryTable[data.charCodeAt(i) & 0x7f];
        var padding = (data.charCodeAt(i) == base64Pad.charCodeAt(0));
        // Skip illegal characters and whitespace
        if (c == -1) continue;
        // Collect data into leftdata, update bitcount
        leftdata = (leftdata << 6) | c;
        leftbits += 6;
        // If we have 8 or more bits, append 8 bits to the result
        if (leftbits >= 8) {
            leftbits -= 8;
            // Append if not padding.
            if (!padding)
                result += String.fromCharCode((leftdata >> leftbits) & 0xff);
            leftdata &= (1 << leftbits) - 1;
        }
    }
    // If there are any bits left, the base64 string was corrupted
    if (leftbits)
        throw Components.Exception('Corrupted base64 string');
    return result;
}


function intToBytes(data) {
    var arr = new Array(2);
    arr[0] = (data >> 8) & 0xFF;
    arr[1] = data & 0xFF;
    return arr;
}

function bytes2Int(data) {
    var val = 0;
    for (var i = 0; i < data.length; ++i) {
        val += data[i];
        if (i < data.length - 1) {
            val = val << 8;
        }
    }
    return val;
}


function doVibrate() {
    navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (navigator.vibrate) {
        navigator.vibrate(1000);
    }
}

//get the IP addresses associated with an account
function getLocalIP(callback) {
    var ip_dups = {};
    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var useWebKit = !!window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking using an iframe
    if (!RTCPeerConnection) {
        //NOTE: you need to have an iframe in the page right above the script tag
        //
        //<iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
        //<script>...getIPs called in here...
        //
        var win = iframe.contentWindow;
        RTCPeerConnection = win.RTCPeerConnection || win.mozRTCPeerConnection || win.webkitRTCPeerConnection;
        useWebKit = !!win.webkitRTCPeerConnection;
    }

    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{ RtpDataChannels: true }]
    };

    var servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    function handleCandidate(candidate) {

        //match just the IP address
        var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
        var excresult = ip_regex.exec(candidate);
        var ip_addr = excresult[1];
        //remove duplicates
        if (ip_dups[ip_addr] === undefined)
            callback(ip_addr);

        ip_dups[ip_addr] = true;
    }

    //listen for candidate events
    pc.onicecandidate = function(ice) {

        //skip non-candidate events
        if (ice.candidate)
            handleCandidate(ice.candidate.candidate);
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result) {

        //trigger the stun server request
        pc.setLocalDescription(result, function() {}, function() {});

    }, function() {});

    //wait for a while to let everything done
    setTimeout(function() {
        //read candidate info from local description
        var lines = pc.localDescription.sdp.split('\n');

        lines.forEach(function(line) {
            if (line.indexOf('a=candidate:') === 0)
                handleCandidate(line);
        });
    }, 1000);
}



function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
}

function subEvent(ev) {
    var event = $.Event(ev);
    $(document).trigger(event);
}

function subEvent(ev, data) {
    var event = $.Event(ev);
    $(document).trigger(event, [data]);
}

function showExitDialog(callBack) {
    if (!document.getElementById('id_dialog_exit')) {
        var dialog =
            "<div class='js_dialog' id='id_dialog_exit'  >" +
            "<div class='weui-mask'></div>" +
            "<div class='weui-dialog weui-skin_android'>" +
            "<div class = 'weui-dialog__bd'> 退出遥控器   </div>" +
            "<div class = 'weui-dialog__ft' >" +
            "<div class = 'weui-dialog__btn weui-dialog__btn_default'id = 'id_dialog_exit_cancel'>" + '取消' + "</div> " +
            "<div class = 'weui-dialog__btn weui-dialog__btn_primary'id = 'id_dialog_exit_sure' >" + '确定' + "</div>" +
            "</div >" +
            "</div >" +
            "</div>";
        $('body').append(dialog);
        $('#id_dialog_exit_cancel').on('click', function(event) {
            $('#id_dialog_exit').remove();
            callBack(cancel);
        });
        $('#id_dialog_exit_sure').on('click', function(event) {
            $('#id_dialog_exit').remove();
            callBack(sure);
        });
    }
}

function updateDebugView() {
    debugmode = (getUrlParam(urlMode) == debug);
    if (!debugmode) {
        document.body.addEventListener('touchmove', function(e) {
            e.preventDefault();
        });
    }

    $('.body').css({
        'overflow-y': debugmode ? 'auto' : 'hidden',
    });
    $('.bottomLog').css({
        display: debugmode ? 'block' : 'none',
    });
    $('#device_state').css({
        display: debugmode ? 'block' : 'none',
    });
}

function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}

function isIos() {
    return isios;
}


function showResult(action, res) {
    if (debugMode) {
        if ($(".logtext")[0] == undefined) {
            $("body").append(logSrc);
        }
        $(".logtext").append(action + ": " + res + "\r\n");
    }
    console.log(action+""+res);
}



function showToast() {
    showResult("showToast:");
    var msg;
    arguments[0] ? msg = arguments[0] : msg = '已完成';
    var toast = "<div id='toast' style='display:none;z-index: 999' align='center'>" +
        "<div class='weui_mask_transparent'></div>" +
        "<div class='weui_toast'>" +
        "<i class='weui_icon_toast'></i>" +
        "<p class='weui_toast_content'>" + msg + "</p>" +
        "</div>" +
        "</div>";
    if ($("#toast")[0] == undefined) {
        $("body").append(toast);
    }
    $("#toast").fadeIn("fast", function() {
        setTimeout(function() {
            $("#toast").fadeOut("fast");
        }, 1200);
    });
}
