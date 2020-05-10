const Pusher = require("pusher-js");
const config = require("config");
const pusher = new Pusher(config.get("APP_KEY"), {
    cluster: config.get("APP_CLUSTER"),
    forceTLS: true,
});

const channel = pusher.subscribe("matching-engine");
channel.bind("add", function (data) {
    // console.log(data["data"][0]);
    const res = data["data"][0];
    for (let key in res) {
        console.log(`${key} - ${res[key]}`);
    }
});
module.exports = pusher;
