const { ACTION, ORDER_TYPE, STATUS } = require("../constants");
const Order = require("../models/Order");
const Asset = require("../models/Asset");
const Holding = require("../models/Holding");
const Trade = require("../models/Trade");
const User = require("../models/User");
const {
    PriorityQueue,
    Comparators: { askCompare, bidCompare },
} = require("../PriorityQueue");
class OrderBook {
    constructor(symbol, openingPrice) {
        this.openingPrice = openingPrice;
        this.symbol = symbol;
        this.bidQueue = new PriorityQueue(bidCompare);

        this.askQueue = new PriorityQueue(askCompare);
        this.currentPrice = openingPrice;
        this.trades = [];
    }

    async addOrder(newOrder) {
        if (newOrder.action === ACTION.BUY) this.addBidOrder(newOrder);
        if (newOrder.action === ACTION.SELL) this.addAskOrder(newOrder);
        this.display();
        await this.orderMatching();
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
    async editOrder(order) {
        let queue;
        if (newOrder.action === ACTION.BUY) queue = this.bidQueue;
        if (newOrder.action === ACTION.SELL) queue = this.askQueue;
        let index = queue.QueueMap[order._id];
        let existingOrder = queue.getItem(index);
        if (existingOrder.status === STATUS.OPEN) {
            queue.edit(index, order);
            let modification = {};
            if (order.quantity) modification.quantity = quantity;
            if (order.limit_price) modification.limit_price = limit_price;
            let order = await Order.findByIdAndUpdate(order._id, modification, {
                new: true,
            });
        }
    }
    async cancelOrder(order) {
        let queue;
        if (order.action === ACTION.BUY) queue = this.bidQueue;
        if (order.action === ACTION.SELL) queue = this.askQueue;
        let index = queue.QueueMap[order._id];
        let existingOrder = queue.getItem(index);
        if (
            existingOrder.status === STATUS.OPEN ||
            existingOrder.status === STATUS.PARTIAL
        ) {
            queue.remove(index);

            let order = await Order.findByIdAndUpdate(
                order._id,
                { status: STATUS.CANCELLED },
                { new: true }
            );
            let query;
            if (existingOrder.order_type === ACTION.BUY) {
                let balanceChange = existingOrder.order_price;
                query = User.findByIdAndUpdate(existingOrder.client_id, {
                    $inc: {
                        balance: balanceChange,
                    },
                });
            } else {
                let qtyChange = existingOrder.quantity;
                query = User.findByIdAndUpdate(existingOrder.client_id, {
                    $inc: {
                        quantity: qtyChange,
                    },
                });
            }
            await query.exec();
        }
    }
    async orderMatching() {
        console.log("Matching started\n");
        while (true) {
            console.log("here");
            if (this.askQueue.size === 0 || this.bidQueue.size === 0) break;
            let askOrder = this.askQueue.top();
            let bidOrder = this.bidQueue.top();
            console.log("Sell : \n");
            console.log(askOrder);

            console.log("Buy :\n");
            console.log(bidOrder);
            let tradePrice, tradeQty;
            if (
                askOrder.order_type !== ORDER_TYPE.MARKET_ORDER &&
                bidOrder.order_type !== ORDER_TYPE.MARKET_ORDER
            ) {
                console.log("\nBOTH LIMIT ORDERS");

                if (askOrder.limit_price <= bidOrder.limit_price) {
                    if (askOrder.createdAt < bidOrder.createdAt)
                        tradePrice = askOrder.limit_price;
                    else tradePrice = bidOrder.limit_price;
                } else break;
            } else if (
                askOrder.order_type === ORDER_TYPE.MARKET_ORDER &&
                bidOrder.order_type !== ORDER_TYPE.MARKET_ORDER
            )
                tradePrice = bidOrder.limit_price;
            else if (
                bidOrder.order_type === ORDER_TYPE.MARKET_ORDER &&
                askOrder.order_type !== ORDER_TYPE.MARKET_ORDER
            )
                tradePrice = askOrder.limit_price;
            else tradePrice = this.openingPrice;
            console.log("GOT A TRADE PRICE");
            if (!tradePrice) {
                console.log("Trade Not FOund");
                break;
            } else {
                console.log("!!!GOT TRADED");
                let minQty = Math.min(askOrder.quantity, bidOrder.quantity);
                let trade = new Trade({
                    traded_price: tradePrice,
                    buyer_id: bidOrder.client_id,
                    seller_id: askOrder.client_id,
                    buy_order_id: bidOrder._id,
                    sell_order_id: askOrder._id,
                    asset_symbol: this.symbol,
                    quantity: minQty,
                });
                console.log("----------Trade--------------");

                console.log(trade);
                console.log("-----------------------------");
                this.currentPrice = tradePrice;
                this.trades.push(trade);

                let query1 = {
                    $inc: {
                        quantity: -1 * minQty,
                        filled_quantity: minQty,
                    },
                    status: STATUS.PARTIAL,
                };
                let query2 = {
                    $inc: {
                        quantity: -1 * minQty,
                        filled_quantity: minQty,
                    },
                    status: STATUS.PARTIAL,
                };

                let temp;
                if (bidOrder.quantity === minQty) {
                    temp = this.bidQueue.dequeue();
                    query1.status = STATUS.COMPLETED;
                } else bidOrder.quantity -= minQty;
                if (askOrder.quantity === minQty) {
                    temp = this.askQueue.dequeue();
                    query2.status = STATUS.COMPLETED;
                } else askOrder.quantity -= minQty;

                let buyOrderBalanceChange =
                    bidOrder.order_cost - tradePrice * minQty;
                let sellOrderBalanceChange = tradePrice * minQty;
                console.log("WE GOT TILL HERE");

                let res;
                console.log(bidOrder.client_id, {
                    $inc: {
                        balance: buyOrderBalanceChange,
                    },
                });

                res = await User.findByIdAndUpdate(bidOrder.client_id, {
                    $inc: {
                        balance: buyOrderBalanceChange,
                    },
                });
                console.log(res);

                res = await User.findByIdAndUpdate(askOrder.client_id, {
                    $inc: {
                        balance: sellOrderBalanceChange,
                    },
                });
                console.log(res);

                let buyerHolding = await Holding.findOne({
                    client_id: bidOrder.client_id,
                    asset_symbol: this.symbol,
                });
                if (!buyerHolding) {
                    buyerHolding = new Holding({
                        client_id: bidOrder.client_id,
                        asset_symbol: this.symbol,
                        quantity: minQty,
                        avg_price: tradePrice,
                    });
                } else {
                    buyerHolding.avg_price =
                        (buyerHolding.avg_price * buyerHolding.quantity +
                            minQty * tradePrice) /
                        (buyerHolding.quantity + minQty);
                    buyerHolding.quantity = buyerHolding.quantity + minQty;
                }
                res = await buyerHolding.save();
                console.log(res);
                // let sellerHolding = await Holding.findOne({
                //     client_id: askOrder.client_id,
                //     asset_symbol: this.symbol,
                // });

                // if(sellerHolding.quantity )

                res = await Order.findByIdAndUpdate(bidOrder._id, query1);
                console.log(res);
                res = await Order.findByIdAndUpdate(askOrder._id, query2);
                console.log(res);
                trade = await trade.save();
                console.log(trade);

                res = await Asset.findOneAndUpdate(
                    { symbol: this.symbol },
                    { ltp: tradePrice }
                );
                console.log(res);
                // await Holding.findOneAndUpdate({client_id: , })
            }
        }
        console.log("Matching Ended\n");
    }
    display() {
        const { askQueue, bidQueue } = this;
        console.log("-----------ASK---------\n");
        console.log(askQueue.toArray());
        console.log("-----------BUY---------\n");
        console.log(bidQueue.toArray());
    }
}

module.exports = OrderBook;
