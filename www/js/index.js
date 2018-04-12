var blockSentences = document.querySelector('#blockSentences');
var app = {
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function () {
        console.log("The device is ready");
        var filter = {
            box: 'inbox',
            maxCount: 200,
        };
        if (SMS)
            SMS.listSMS(filter, function (data) {
                var contacts = {};
                for (var i = 0; i < data.length; i++) {
                    if ((data[i].address).length > 7 && (data[i].address).match("[0-9]+")) {
                        if (contacts.hasOwnProperty(data[i].address)) {
                            Object.defineProperty(contacts[data[i].address], data[i]._id, {
                                value: {
                                    "body": data[i].body,
                                    "date": data[i].date
                                }
                            });
                        }
                        else {
                            var myid = String(data[i]._id);
                            Object.defineProperty(contacts, data[i].address, {
                                value: {
                                    "000": {
                                        "body": data[i].body,
                                        "date": data[i].date
                                    }
                                }
                            });
                        }
                    }
                }
                console.log('contacts');
                console.log(contacts);
            }, function (err) {
                console.log('error list sms: ' + err);
            });
        console.log('localStorage');
        console.log(localStorage);
    }
};
app.initialize();
//# sourceMappingURL=index.js.map