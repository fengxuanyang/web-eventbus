
var eventBus = {};
eventBus.getEventBus = {
    listeners: {

        listerList: {},
        add: function(event, fun) {
            if (!this.listerList[event]) {
                this.listerList[event] = {};
            }
            var objEventLength = Object.keys(this.listerList[event]).length;
            this.listerList[event][event + objEventLength] = fun;
            return event + ':' + objEventLength;
        },
        remove: function(id) {
            if (id) {
                var slice = id.indexOf(':');
                var event = id.slice(0, slice);
                if (slice && event) {
                    var index = id.slice(slice + 1);
                    delete this.listerList[event][event + index];
                    if (!Object.keys(this.listerList[event]).length) {
                        delete this.listerList[event];
                    }
                }
            }

        }
    },
    subscribe: function(event, onSubscribeFun) {
        showResult("subscribe:", event);
        var id = this.listeners.add(event, onSubscribeFun);
        return id;
    },

    unsubscribe: function(id) {
        this.listeners.remove(id);

    },
    broadcast: function(event,msg) {
        showResult("broadcast:", event);
        var respose = msg ;
        if (!this.listeners.listerList[event])
            return;
        for (var i = 0; i < Object.keys(this.listeners.listerList[event]).length; i++) {
            var funcHolder = this.listeners.listerList[event][event + i];
            funcHolder.apply(this, [].slice.call(arguments));
        }

    },

}
