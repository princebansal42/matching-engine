const { ORDER_TYPE, STATUS } = require("../constants");
class Order {
    constructor(productId, orderType, action, quantity, price) {
        this.orderId = v4();
        this.productId = productId;
        this.orderType = orderType;
        this.createdAt = Date.now();
        // this.createdAt = now.get("millisecond");
        this.quantity = quantity;
        this.action = action;
        if (orderType !== ORDER_TYPE.MARKET_ORDER) this.price = price;
        this.status = STATUS.PENDING;
    }

    reduceQty(qty) {
        if (this.quantity < qty)
            throw new Error("Can't reduce order size to negative");
        this.quantity -= qty;
    }

    changeStatus(newStatus) {
        this.status = newStatus;
    }

    print() {
        const {
            orderId,
            productId,
            orderType,
            createdAt,
            quantity,
            action,
            price,
            status,
        } = this;
        const res = JSON.stringify({
            orderId,
            productId,
            orderType,
            createdAt,
            quantity,
            action,
            price,
            status,
        });
        // console.log(res);
        return res;
    }
}
