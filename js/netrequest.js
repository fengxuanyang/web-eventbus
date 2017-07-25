var BASEURL = "www.robyun.com";
var client = null;

function queryWeChatSignature(apipath, noncestr, timestamp, currenturl, callback) {
    BASEURL = window.location.host;
    var encodeurl = encodeURIComponent(currenturl);
    var head = "http://" + BASEURL + "/" + apipath + "/wechat/signature?";
    showResult("head:", head);
    var param = "noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + encodeurl;
    var requesturl = head + param;

    $.ajax({
        url: requesturl,
        type: "get",
        dataType: "json",
        success: function (data) {
            callback(data);
        },
        error: function () {
            callback(null);
        }
    });
}

function convertURL(url) {
    var timstamp = (new Date()).valueOf();
    if (url.indexOf("?") >= 0) {
        url = url + "&t=" + timstamp;
    } else {
        url = url + "?t=" + timstamp;
    }
    return url;
}

function ping(ip, callback, timeout) {

    var img = new Image();
    var start = new Date().getTime();
    var flag = false;
    var isCloseWifi = true;
    var hasFinish = false;

    img.onload = function () {
        if (!hasFinish) {
            flag = true;
            hasFinish = true;
            img.src = 'X:\\';
            callback(flag);
        }
    };

    img.onerror = function () {
        if (!hasFinish) {
            if (!isCloseWifi) {
                flag = true;
                img.src = 'X:\\';
                callback(flag);

            } else {
                callback(flag);
            }
            hasFinish = true;
        }
    };

    setTimeout(function () {
        isCloseWifi = false;
    }, 2);

    img.src = 'http://' + ip + '/' + start;
    var timer = setTimeout(function () {
        if (!flag) {
            hasFinish = true;
            img.src = 'X://';
            flag = false;
            callback(flag);
        }
    }, timeout);
}
