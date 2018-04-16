declare const PushNotification: any;

export class Notifications {

    constructor() {

        const pushNotification = new PushNotification();

        const push = PushNotification.init({
            android: {
            },
            ios: {
                alert: "true",
                badge: true,
                sound: 'false'
            },
            windows: {}
        });

        push.on('registration', (data) => {
            console.log(data.registrationId);
        });

        push.on('notification', (data) => {
            console.log(data.message);
            console.log(data.title);
            console.log(data.count);
            console.log(data.sound);
            console.log(data.image);
            console.log(data.additionalData);
        });

        push.on('error', (e) => {
            console.log(e.message);
        });
    }

}