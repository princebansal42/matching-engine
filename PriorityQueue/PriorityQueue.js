// const QueueMap = require("./Map");
class PriorityQueue {
    constructor(comparator) {
        this.comparator = comparator;
        this.items = [];
        this.size = 0;
        this.QueueMap = {};
        this.heapify_down = this.heapify_down.bind(this);
        this.heapify_up = this.heapify_up.bind(this);
    }
    leftChild(index) {
        return 2 * index + 1;
    }
    rightChild(index) {
        return 2 * index + 2;
    }
    parent(index) {
        return Math.floor((index - 1) / 2);
    }
    isEmpty() {
        return this.size === 0;
    }
    getItem(index) {
        if (index >= this.size) throw new Error("Index out of Bound");
        return this.items[index];
    }
    getQueueMap() {
        return this.QueueMap;
    }
    heapify_down(index) {
        const {
            heapify_down,
            leftChild,
            rightChild,
            size,
            items,
            comparator,
            QueueMap,
        } = this;
        let largest = index;
        let l = leftChild(index);
        let r = rightChild(index);
        if (l < size && comparator(items[l], items[largest])) largest = l;
        if (r < size && comparator(items[r], items[largest])) largest = r;

        if (largest !== index) {
            [QueueMap[items[largest]._id], QueueMap[items[index]._id]] = [
                QueueMap[items[index]._id],
                QueueMap[items[largest]._id],
            ];
            [items[largest], items[index]] = [items[index], items[largest]];
            return heapify_down(largest);
        } else return index;
    }
    heapify_up(index) {
        const { heapify_up, parent, comparator, items, QueueMap } = this;
        let p = parent(index);
        if (p >= 0 && comparator(items[index], items[p])) {
            [QueueMap[items[p]._id], QueueMap[items[index]._id]] = [
                QueueMap[items[index]._id],
                QueueMap[items[p]._id],
            ];
            [items[index], items[p]] = [items[p], items[index]];
            return heapify_up(p);
        } else return index;
    }
    clear() {
        this.items = [];
        this.size = 0;
    }
    enqueue(item) {
        this.items.push(item);
        this.QueueMap[item._id] = this.size;
        this.size++;
        return this.heapify_up(this.size - 1);
    }
    toArray() {
        return [...this.items];
    }
    dequeue() {
        if (this.size <= 0) throw new Error("Queue Empty");
        delete this.QueueMap[this.items[0]._id];
        this.remove(0);
    }
    remove(index) {
        if (index >= this.size) throw new Error("Index out of Bound");
        const {
            items,
            size,
            parent,
            comparator,
            heapify_down,
            heapify_up,
        } = this;
        items[index] = items.pop();
        this.size--;
        let p = parent(index);
        if (p >= 0 && comparator(items[index], items[p]))
            return heapify_up(index);
        else return heapify_down(index);
    }
    edit(index, newItem) {
        if (index >= this.size || index < 0)
            throw new Error("Index out of Bound");
        const {
            items,
            size,
            parent,
            comparator,
            heapify_down,
            heapify_up,
        } = this;
        items[index] = newItem;
        let p = parent(index);
        if (p >= 0 && comparator(items[index], items[p]))
            return heapify_up(index);
        else return heapify_down(index);
    }
    size() {
        return this.size;
    }
    top() {
        return this.items[0];
    }
    display() {
        let res = "";
        const { items } = this;
        for (let item of items) {
            res += item.print();
            res += "\n";
        }
        return res;
    }
}

module.exports = PriorityQueue;
