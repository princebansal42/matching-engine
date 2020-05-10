console.log("Matching Engine Running ...");
const matchingEngine = require("./MatchingEngine");

const pusher = require("./pusherConfig");
const channel = pusher.subscribe("matching-engine");
channel.bind("add order", function (data) {
    matchingEngine.addOrder(data);
});
channel.bind("edit order", function (data) {
    matchingEngine.editOrder(data);
});
channel.bind("cancel order", function (data) {
    matchingEngine.cancelOrder(data);
});
console.log("------------");
