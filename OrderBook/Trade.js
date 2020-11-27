class Trade {
    constructor(bidOrderId, askOrderId,bidOrderUserId,askOrderUserId,  tradePrice, time, quantity) {
        this.bidOrderId = bidOrderId;
        this.askOrderId = askOrderId;
        this.bidOrderUserId = bidOrderUserId;
        this.askOrderUserId = askOrderUserId;
        this.tradePrice = tradePrice;
        this.createdAt = createdAt;
        this.quantity = quantity;
    }
    print() {
        const { askOrderId, bidOrderId, time, tradePrice, quantity } = this;
        const res = JSON.stringify({
            ...this
        });
        // console.log(res);
        return res;
    }
}
module.exports = Trade;
