const ORDER_TYPE = {
    LIMIT_ORDER: "LIMIT_ORDER",
    MARKET_ORDER: "MARKET_ORDER",
};
const ACTION = {
    BUY: "BUY",
    SELL: "SELL",
};

const STATUS = {
    OPEN: "OPEN",
    PARTIAL: "PARTIAL",
    COMPLETED: "COMPLETED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED",
    EXPIRED: "EXPIRED",
};

module.exports = {
    ORDER_TYPE,
    ACTION,
    STATUS,
};
