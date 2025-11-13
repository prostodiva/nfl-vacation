
/**
 * Min-Heap Priority Queue implementation
 * Used for Dijkstra's algorithm optimization
 */
class MinHeap {
    constructor(compareFn = (a, b) => a.priority - b.priority) {
        this.heap = [];
        this.compareFn = compareFn;
    }

    push(item) {
        this.heap.push(item);
        this._bubbleUp(this.heap.length - 1);
    }

    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._bubbleDown(0);
        return min;
    }

    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    size() {
        return this.heap.length;
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    _bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compareFn(this.heap[index], this.heap[parentIndex]) >= 0) {
                break;
            }
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    _bubbleDown(index) {
        while (true) {
            let minIndex = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length &&
                this.compareFn(this.heap[leftChild], this.heap[minIndex]) < 0) {
                minIndex = leftChild;
            }

            if (rightChild < this.heap.length &&
                this.compareFn(this.heap[rightChild], this.heap[minIndex]) < 0) {
                minIndex = rightChild;
            }

            if (minIndex === index) break;

            [this.heap[index], this.heap[minIndex]] = [this.heap[minIndex], this.heap[index]];
            index = minIndex;
        }
    }
}

/**
 * Priority Queue wrapper for cleaner API
 */
class PriorityQueue {
    constructor() {
        this.heap = new MinHeap();
    }

    enqueue(element, priority) {
        this.heap.push({ element, priority });
    }

    dequeue() {
        const item = this.heap.pop();
        return item ? item.element : null;
    }

    isEmpty() {
        return this.heap.isEmpty();
    }

    size() {
        return this.heap.size();
    }
}

module.exports = { MinHeap, PriorityQueue };