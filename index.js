const connectDB = require("./db");
connectDB();
console.log("Matching Engine Running ...");
const MatchingEngine = require("./MatchingEngine");
const matchingEngine = new MatchingEngine();

const pusher = require("./pusherConfig");
const channel = pusher.subscribe("match-engine");
channel.bind("get assets", function (assets) {
    matchingEngine.init(assets);
    console.log(matchingEngine);
});
channel.bind("add order", async function (data) {
    console.log(data);
    await matchingEngine.addOrder(data);
});
channel.bind("edit order", async function (data) {
    console.log(data);
    await matchingEngine.editOrder(data);
});
channel.bind("cancel order", async function (data) {
    console.log(data);
    await matchingEngine.cancelOrder(data);
});

console.log(matchingEngine);
// try {
//     matchingEngine.init();
// } catch (err) {
//     console.log(err);
// }

console.log("------------");
