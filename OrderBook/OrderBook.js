const { ACTION, ORDER_TYPE } = require("../constants");
class OrderBook {
    constructor(symbol, openingPrice) {
        this.openingPrice = openingPrice;
        this.symbol = symbol;
        this.bidQueue = new PriorityQueue(bidCompare);
        this.askQueue = new PriorityQueue(askCompare);
        this.currentPrice = openingPrice;
        this.trades = [];
    }

    addOrder(newOrder) {
        if (newOrder.action === ACTION.BUY) this.addBidOrder(newOrder);
        if (newOrder.action === ACTION.SELL) this.addAskOrder(newOrder);
        this.orderMatching();
    }
    addAskOrder(newOrder) {
        this.askQueue.enqueue(newOrder);
    }
    addBidOrder(newOrder) {
        this.bidQueue.enqueue(newOrder);
    }
    bidQueueTop() {
        return this.bidQueue.top();
    }
    askQueueTop() {
        return this.askQueue.top();
    }
    orderMatching() {
        while (true) {
            if (this.askQueue.size === 0 || this.bidQueue.size === 0) break;
            let askOrder = this.askQueue.top();
            let bidOrder = this.bidQueue.top();

            let tradePrice, tradeQty;
            if (
                askOrder.orderType !== ORDER_TYPE.MARKET_ORDER &&
                bidOrder.orderType !== ORDER_TYPE.MARKET_ORDER
            ) {
                if (askOrder.price <= bidOrder.price) {
                    if (askOrder.createdAt < bidOrder.createdAt)
                        tradePrice = askOrder.price;
                    else tradePrice = bidOrder.price;
                } else break;
            } else if (askOrder.orderType === ORDER_TYPE.MARKET_ORDER)
                tradePrice = bidOrder.price;
            else if (bidOrder.orderType === ORDER_TYPE.MARKET_ORDER)
                tradePrice = askOrder.price;
            else tradePrice = this.openingPrice;

            let minQty = Math.min(askOrder.quantity, bidOrder.quantity);
            this.trades.push(
                new Trade(
                    bidOrder.orderId,
                    askOrder.orderId,
                    tradePrice,
                    Date.now(),
                    minQty
                )
            );
            console.log(askOrder);
            askOrder.reduceQty(minQty);
            bidOrder.reduceQty(minQty);
            let temp;
            if (askOrder.quantity === 0) temp = this.askQueue.dequeue();
            if (bidOrder.quantity === 0) temp = this.bidQueue.dequeue();
            this.currentPrice = tradePrice;
        }
    }
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

module.exports = OrderBook;
