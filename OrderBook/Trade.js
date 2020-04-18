class ExecutedOrder {
    constructor(bidOrderId, askOrderId, tradePrice, time, quantity) {
        this.bidOrderId = bidOrderId;
        this.askOrderId = askOrderId;
        this.tradePrice = tradePrice;
        this.time = time;
        this.quantity = quantity;
    }
    print() {
        const { askOrderId, bidOrderId, time, tradePrice, quantity } = this;
        const res = JSON.stringify({
            bidOrderId,
            askOrderId,
            time,
            tradePrice,
            quantity,
        });
        // console.log(res);
        return res;
    }
}
