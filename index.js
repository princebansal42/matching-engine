const connectDB = require("./db");
connectDB();
console.log("Matching Engine Running ...");
const MatchingEngine = require("./MatchingEngine");
const matchingEngine = new MatchingEngine();

const pusher = require("./pusherConfig");
const channel = pusher.subscribe("matching-engine");
channel.bind("get assets", function (assets) {
    matchingEngine.init(assets);
    console.log(matchingEngine);
});
channel.bind("add order", function (data) {
    console.log(data);
    matchingEngine.addOrder(data);
});
channel.bind("edit order", function (data) {
    console.log(data);
    matchingEngine.editOrder(data);
});
channel.bind("cancel order", function (data) {
    console.log(data);
    matchingEngine.cancelOrder(data);
});

console.log(matchingEngine);
// try {
//     matchingEngine.init();
// } catch (err) {
//     console.log(err);
// }

console.log("------------");
