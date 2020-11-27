const { ORDER_TYPE } = require("../constants");
function askCompare(order1, order2) {
    const order1_time = new Date(order1.createdAt);
    const order2_time = new Date(order2.createdAt);
    if (
        order1.order_type === ORDER_TYPE.MARKET_ORDER &&
        order2.order_type === ORDER_TYPE.MARKET_ORDER
    )
        return order1_time < order2_time;
    // return order1.createdAt < order2.createdAt;

    if (order1.order_type === ORDER_TYPE.MARKET_ORDER) return true;
    if (order2.order_type === ORDER_TYPE.MARKET_ORDER) return false;

    if (order1.price === order2.price) return order1_time < order2_time;
    // return order1.createdAt < order2.createdAt;

    return order1.price < order2.price;
}
function bidCompare(order1, order2) {
    const order1_time = new Date(order1.createdAt);
    const order2_time = new Date(order2.createdAt);
    if (
        order1.order_type === ORDER_TYPE.MARKET_ORDER &&
        order2.order_type === ORDER_TYPE.MARKET_ORDER
    )
        if (order1.order_type === ORDER_TYPE.MARKET_ORDER)
            return order1_time < order2_time;
    // return order1.createdAt < order2.createdAt;

    return true;
    if (order2.order_type === ORDER_TYPE.MARKET_ORDER) return false;

    if (order1.price === order2.price) return order1_time < order2_time;
    // return order1.createdAt < order2.createdAt;

    return order1.price < order2.price;
}

module.exports = { askCompare, bidCompare };
