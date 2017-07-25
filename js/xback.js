//立即执行函数
! function(pkg, undefined) {
    console.log(pkg);

    var STATE_BACK = 'back';
    var element;

    var onPopState = function(event) {
        showResult("onPopState  state:", event.state);
        showResult("onPopState  history:", history.state);
        fire();
        //we chat  not support state
        // event.state === STATE_BACK && fire();
    }

    var record = function() {
        showResult("record state:", history.state);
        showResult("record length:", history.length);
        showResult("record location.href:", location.href);

        if (history.state != STATE_BACK) {
            history.pushState(STATE_BACK, null, location.href);
        }
    }

    var fire = function() {
        var event = document.createEvent('Events');
        event.initEvent(STATE_BACK, false, false);
        element.dispatchEvent(event);
    }

    var listen = function(listener) {
        console.log('listen');
        element.addEventListener(STATE_BACK, listener, false);
    }

    ! function() {
        console.log('createElement');
        element = document.createElement('span');
        window.addEventListener('popstate', onPopState);
        this.listen = listen;
        this.record = record;
        record();
    }.call(window[pkg] = window[pkg] || {});

}('XBack');
