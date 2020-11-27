const ORDER_TYPE = {
    LIMIT_ORDER: "LIMIT",
    MARKET_ORDER: "MARKET",
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

const ORDER_DURATION = {
    DAY: "DAY",
    GTC: "GTC",
    IOC: "IOC",
};

module.exports = {
    ORDER_TYPE,
    ACTION,
    STATUS,
    ORDER_DURATION,
};
