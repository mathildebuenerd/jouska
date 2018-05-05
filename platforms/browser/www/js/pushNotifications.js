"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Notifications = (function () {
    function Notifications() {
        var pushNotification = new PushNotification();
        var push = PushNotification.init({
            android: {},
            ios: {
                alert: "true",
                badge: true,
                sound: 'false'
            },
            windows: {}
        });
        push.on('registration', function (data) {
            console.log(data.registrationId);
        });
        push.on('notification', function (data) {
            console.log(data.message);
            console.log(data.title);
            console.log(data.count);
            console.log(data.sound);
            console.log(data.image);
            console.log(data.additionalData);
        });
        push.on('error', function (e) {
            console.log(e.message);
        });
    }
    return Notifications;
}());
exports.Notifications = Notifications;
//# sourceMappingURL=pushNotifications.js.map