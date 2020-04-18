class PriorityQueue {
    constructor(comparator) {
        this.comparator = comparator;
        this.items = [];
        this.size = 0;
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
    heapify_down(index) {
        const {
            heapify_down,
            leftChild,
            rightChild,
            size,
            items,
            comparator,
        } = this;
        let largest = index;
        let l = leftChild(index);
        let r = rightChild(index);
        if (l < size && comparator(items[l], items[largest])) largest = l;
        if (r < size && comparator(items[r], items[largest])) largest = r;

        if (largest !== index) {
            [items[largest], items[index]] = [items[index], items[largest]];
            heapify_down(largest);
        }
    }
    heapify_up(index) {
        const { heapify_up, parent, comparator, items } = this;
        let p = parent(index);
        if (p >= 0 && comparator(items[index], items[p])) {
            [items[index], items[p]] = [items[p], items[index]];
            heapify_up(p);
        }
    }
    clear() {
        this.items = [];
        this.size = 0;
    }
    enqueue(item) {
        this.items.push(item);
        this.size++;
        this.heapify_up(this.size - 1);
    }
    toArray() {
        return [...this.items];
    }
    dequeue() {
        if (this.size <= 0) throw new Error("Queue Empty");
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
        if (p >= 0 && comparator(items[index], items[p])) heapify_up(index);
        else heapify_down(index);
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
