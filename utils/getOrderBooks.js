const Asset = require("../models/Asset");
const OrderBook = require("../OrderBook/OrderBook");
const getOrderBooks = async () => {
    try {
        const assets = await Asset.find({});
        const orderBooks = {};
        for (let i = 0; i < assets.length; i++) {
            const { symbol, ltp } = assets[i];
            orderBooks[symbol] = new OrderBook(symbol, ltp);
        }
        return orderBooks;
    } catch (err) {
        console.log("Error happened");
    }
};

module.exports = getOrderBooks;
