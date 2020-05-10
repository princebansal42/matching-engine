const { ACTION, ORDER_TYPE } = require("../constants");
const getOrderBooks = require("../utils/getOrderBooks");

const OrderBook = require("../OrderBook/OrderBook");
class MatchingEngine {
    constructor() {
        this.orderBooks = [];
    }
    // async init(assets) {
    //     try {
    //         this.orderBooks = await getOrderBooks();
    //         console.log(this.orderBooks);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }

    init(assets) {
        for (let i = 0; i < assets.length; i++) {
            const { symbol, ltp } = assets[i];
            this.orderBooks[symbol] = new OrderBook(symbol, ltp);
        }
    }
    addOrder(order) {
        this.orderBooks[order.asset_symbol].addOrder(order);
        this.orderBooks[order.asset_symbol].orderMatching();
    }
    editOrder(order) {
        this.orderBooks[order.asset_symbol].editOrder(order);
        this.orderBooks[order.asset_symbol].orderMatching();
    }
    cancelOrder(order) {
        this.orderBooks[order.asset_symbol].cancelOrder(order);
        this.orderBooks[order.asset_symbol].orderMatching();
    }
    addAsset(asset) {}
    display() {
        const { executedOrders } = this;
        let res = "";
        for (let index in executedOrders) {
            res += executedOrders[index].print();
            res += "\n";
        }
        return res;
    }
}

module.exports = MatchingEngine;
