var btFrame;


function iframeBTLoad() {
    console.log('iframeBTLoad:');
    btFrame = $('#iframe_filemanager').contents();
    btFrame.find('body').on('touchmove', function(e) {
        e.preventDefault();
    });
    btFrame.find('#bt_retryconnect').on('touchstart touchend', function(event) {
        if (event.type === 'touchstart') {
            $(this).css({
                'background-position': '100%  0%'
            });
            btFrame.find('#id_bt_loading').css({
                'display': 'block',
            });
            return;
        }
        if (event.type === 'touchend') {
            $(this).css({
                'background-position': '100%  100%'
            });
        }

    });

}
