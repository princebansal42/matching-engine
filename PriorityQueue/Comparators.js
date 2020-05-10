const { ORDER_TYPE } = require("../constants");
function askCompare(order1, order2) {
    if (
        order1.order_type === ORDER_TYPE.MARKET_ORDER &&
        order2.order_type === ORDER_TYPE.MARKET_ORDER
    )
        return order1.createdAt < order2.createdAt;

    if (order1.order_type === ORDER_TYPE.MARKET_ORDER) return true;
    if (order2.order_type === ORDER_TYPE.MARKET_ORDER) return false;

    if (order1.price === order2.price)
        return order1.createdAt < order2.createdAt;

    return order1.price < order2.price;
}
function bidCompare(order1, order2) {
    if (
        order1.order_type === ORDER_TYPE.MARKET_ORDER &&
        order2.order_type === ORDER_TYPE.MARKET_ORDER
    )
        return order1.createdAt < order2.createdAt;

    if (order1.order_type === ORDER_TYPE.MARKET_ORDER) return true;
    if (order2.order_type === ORDER_TYPE.MARKET_ORDER) return false;

    if (order1.price === order2.price)
        return order1.createdAt < order2.createdAt;

    return order1.price < order2.price;
}

module.exports = { askCompare, bidCompare };
