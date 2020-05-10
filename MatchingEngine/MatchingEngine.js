const { ACTION, ORDER_TYPE } = require("../constants");
const { getOrderBooks } = require("../utils/getOrderBooks");
class MatchingEngine {
    constructor() {
        this.orderBooks = [];
    }
    async init() {
        try {
            this.orderBooks = await getOrderBooks();
        } catch (err) {
            console.log(err);
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
