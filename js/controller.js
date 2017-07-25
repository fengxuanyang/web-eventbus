var mControlFrame, mControlCenter, mDivAdd, mDivMinus, mDivHome, mDivMenu, mDivBack;
var userAgent = navigator.userAgent.toLowerCase();
var iosSystem = false, mWaitTimer = 150;

function iframeControllerLoad() {
    iosSystem = isIos();
    loadSound();
    registerCotrollerViewListener();
    registerControlEventListener();

}

function registerControlEventListener() {
    $(document).on(EVENT_EDIT_FOCUS_CHANGE, function(event, editfocusMsg) {
        if (editfocusMsg.focusState === proto.airsync.FocusSate.TRUE) {
            mControlFrame.find('#control_input').attr("disabled", false);
            mControlFrame.find(".sendwrap").css({
                "pointer-events": "",
                "background-image": "url(res/inputenable.png)"
            });
        } else {
            mControlFrame.find(".sendwrap").css({
                "pointer-events": "none",
                "background-image": "url(res/inputdisable.png)"
            });
        }
        mControlFrame.find("#control_input").val(editfocusMsg.text);
    });
}

function registerCotrollerViewListener() {
    mControlFrame = $('#iframe_filemanager').contents();
    mControlFrame.find("body").on("touchmove", function(e) {
        e.preventDefault();
    });
    mControlCenter = mControlFrame.find('.centerControl');
    mDivAdd = mControlFrame.find('.divAdd');
    mDivMinus = mControlFrame.find('.divMinus');
    mDivHome = mControlFrame.find('.divHome');
    mDivMenu = mControlFrame.find('.divMenu');
    mDivBack = mControlFrame.find('.divBack');

    var revertCenterControl = function() {
        mControlCenter.css({
            'background-position': '100% 0%'
        });
    };

    mControlFrame.find('#control_add').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mDivAdd.css({
                'background-position': '100%  100%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    mDivAdd.css({
                        'background-position': '100%  0%'
                    });
                    sendCommandBase64(getPlusKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getPlusKeyCmd(), function() {
                    setTimeout(function() {
                        mDivAdd.css({
                            'background-position': '100%  0%'
                        });
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#control_minus').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mDivMinus.css({
                'background-position': '100%  100%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    mDivMinus.css({
                        'background-position': '100%  0%'
                    });
                    sendCommandBase64(getMinusKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getMinusKeyCmd(), function() {
                    setTimeout(function() {
                        mDivMinus.css({
                            'background-position': '100%  0%'
                        });
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#center_control_ok').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mControlCenter.css({
                'background-position': '100% 20%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    revertCenterControl();
                    sendCommandBase64(getOkKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getOkKeyCmd(), function() {
                    setTimeout(function() {
                        revertCenterControl();
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#center_control_left').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mControlCenter.css({
                'background-position': '100% 40%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    revertCenterControl();
                    sendCommandBase64(getLeftKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getLeftKeyCmd(), function() {
                    setTimeout(function() {
                        revertCenterControl();
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#center_control_top').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mControlCenter.css({
                'background-position': '100% 100%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    revertCenterControl();
                    sendCommandBase64(getUpwardKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getUpwardKeyCmd(), function() {
                    setTimeout(function() {
                        revertCenterControl();
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#center_control_right').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mControlCenter.css({
                'background-position': '100% 80%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    revertCenterControl();
                    sendCommandBase64(getRightKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getRightKeyCmd(), function() {
                    setTimeout(function() {
                        revertCenterControl();
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#center_control_bottom').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mControlCenter.css({
                'background-position': '100% 60%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    revertCenterControl();
                    sendCommandBase64(getDownwardKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getDownwardKeyCmd(), function() {
                    setTimeout(function() {
                        revertCenterControl();
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#control_home').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mDivHome.css({
                'background-position': '100%  100%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    mDivHome.css({
                        'background-position': '100%  0%'
                    });
                    sendCommandBase64(getHOMEKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getHOMEKeyCmd(), function() {
                    setTimeout(function() {
                        mDivHome.css({
                            'background-position': '100%  0%'
                        });
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#control_menu').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mDivMenu.css({
                'background-position': '100%  100%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    mDivMenu.css({
                        'background-position': '100%  0%'
                    });
                    sendCommandBase64(getMenuKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getMenuKeyCmd(), function() {
                    setTimeout(function() {
                        mDivMenu.css({
                            'background-position': '100%  0%'
                        });
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#control_back').on('touchstart', function(event) {
        if (event.type === 'touchstart') {
            mDivBack.css({
                'background-position': '100%  100%'
            });
            playSound(btnClickSoundID);
            if (iosSystem) {
                setTimeout(function() {
                    mDivBack.css({
                        'background-position': '100%  0%'
                    });
                    sendCommandBase64(getBackKeyCmd());
                }, mWaitTimer);
            } else {
                sendCommandBase64(getBackKeyCmd(), function() {
                    setTimeout(function() {
                        mDivBack.css({
                            'background-position': '100%  0%'
                        });
                    }, 100);
                });
            }
        }
    });

    mControlFrame.find('#control_send').on('touchstart touchend', function(event) {
        if (event.type === 'touchstart') {
            var msg = mControlFrame.find('#control_input').val();
            if (msg === testCode) {
                mControlFrame.find('.bottomLog').css({
                    visibility: 'visible'
                });
            }
            if (msg.length === 0) {} else {
                playSound(btnClickSoundID);
                sendCommandBase64(getTextInputRequest(msg));
            }
            mControlFrame.find('.sendwrap').css({
                'background-image': 'url(./res/inputsend.png)',
                'background-repeat': 'no-repeat',
                'background-size': 'cover'
            });
            return;
        }
        if (event.type === 'touchend') {
            mControlFrame.find('.sendwrap').css({
                'background-image': 'url(./res/inputenable.png)',
                'background-repeat': 'no-repeat',
                'background-size': 'cover'
            });
        }
    });

    mControlFrame.find('#retry_connect').on('touchstart touchend', function(event) {
        if (event.type === 'touchstart') {
            mControlFrame.find('.divRetry').css({
                'background-position': '100%  0%'
            });
            showLoadingToast();
            openDevice();
            getDeviceInfo();
            return;
        }
        if (event.type === 'touchend') {
            mControlFrame.find('.divRetry').css({
                'background-position': '100%  100%'
            });
        }
    });
}

function sendCommandBase64(cmd, callback) {
    showResult("sendCommandBase64:", cmd);
    var cmd64 = bytesToBase64(cmd);
    sendDada(cmd64, callback);
}

function loadSound() {
    createjs.Sound.registerSound('res/keyclick.wav', btnClickSoundID);
}

function playSound(id) {
    createjs.Sound.play(id);
}

function isIos() {
    return (userAgent.indexOf("iphone") != -1) || (userAgent.indexOf("ipad") != -1);
}
