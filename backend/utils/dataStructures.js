/**
 * @fileoverview Data structures used for graph algorithms
 * @module dataStructures
 */

/**
 * Min-Heap Priority Queue implementation
 * Used for Dijkstra's and A* algorithms optimization
 * Time Complexity: O(log n) for insert/extract, O(1) for peek
 * Space Complexity: O(n)
 * 
 * @class MinHeap
 */
class MinHeap {
    /**
     * Creates a new MinHeap instance
     * @param {Function} compareFn - Comparison function (default: priority-based)
     * @constructor
     */
    constructor(compareFn = (a, b) => a.priority - b.priority) {
        /** @type {Array} Internal heap array */
        this.heap = [];
        /** @type {Function} Comparison function */
        this.compareFn = compareFn;
    }

    /**
     * Inserts an item into the heap
     * @param {*} item - Item to insert
     * @returns {void}
     * @timeComplexity O(log n)
     */
    push(item) {
        this.heap.push(item);
        this._bubbleUp(this.heap.length - 1);
    }

    /**
     * Removes and returns the minimum item from the heap
     * @returns {*} Minimum item or null if heap is empty
     * @timeComplexity O(log n)
     */
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();

        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this._bubbleDown(0);
        return min;
    }

    /**
     * Returns the minimum item without removing it
     * @returns {*} Minimum item or null if heap is empty
     * @timeComplexity O(1)
     */
    peek() {
        return this.heap.length > 0 ? this.heap[0] : null;
    }

    /**
     * Returns the number of items in the heap
     * @returns {number} Size of the heap
     * @timeComplexity O(1)
     */
    size() {
        return this.heap.length;
    }

    /**
     * Checks if the heap is empty
     * @returns {boolean} True if heap is empty
     * @timeComplexity O(1)
     */
    isEmpty() {
        return this.heap.length === 0;
    }

    /**
     * Moves an item up the heap to maintain heap property
     * @private
     * @param {number} index - Index of item to bubble up
     * @returns {void}
     * @timeComplexity O(log n)
     */
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

    /**
     * Moves an item down the heap to maintain heap property
     * @private
     * @param {number} index - Index of item to bubble down
     * @returns {void}
     * @timeComplexity O(log n)
     */
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
 * Uses MinHeap internally for efficient priority-based operations
 * 
 * @class PriorityQueue
 */
class PriorityQueue {
    /**
     * Creates a new PriorityQueue instance
     * @constructor
     */
    constructor() {
        /** @type {MinHeap} Internal min heap */
        this.heap = new MinHeap();
    }

    /**
     * Adds an element to the queue with a given priority
     * @param {*} element - Element to add
     * @param {number} priority - Priority value (lower = higher priority)
     * @returns {void}
     * @timeComplexity O(log n)
     */
    enqueue(element, priority) {
        this.heap.push({ element, priority });
    }

    /**
     * Removes and returns the element with highest priority (lowest priority value)
     * @returns {*} Element with highest priority or null if queue is empty
     * @timeComplexity O(log n)
     */
    dequeue() {
        const item = this.heap.pop();
        return item ? item.element : null;
    }

    /**
     * Checks if the queue is empty
     * @returns {boolean} True if queue is empty
     * @timeComplexity O(1)
     */
    isEmpty() {
        return this.heap.isEmpty();
    }

    /**
     * Returns the number of elements in the queue
     * @returns {number} Size of the queue
     * @timeComplexity O(1)
     */
    size() {
        return this.heap.size();
    }
}

/**
 * Union-Find (Disjoint Set Union) data structure
 * Used for Kruskal's algorithm to detect cycles efficiently
 * Uses path compression and union by rank optimizations
 * 
 * @class UnionFind
 */
class UnionFind {
    /**
     * Creates a new UnionFind structure with n elements
     * @param {number} n - Number of elements
     * @constructor
     */
    constructor(n) {
        /** @type {Array<number>} Parent array for each element */
        this.parent = Array(n).fill(0).map((_, i) => i);
        /** @type {Array<number>} Rank array for union by rank optimization */
        this.rank = Array(n).fill(0);
    }

    /**
     * Finds the root of an element with path compression
     * @param {number} x - Element to find root for
     * @returns {number} Root element
     * @timeComplexity O(α(n)) ≈ O(1) amortized
     */
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }

    /**
     * Unions two sets using union by rank
     * @param {number} x - First element
     * @param {number} y - Second element
     * @returns {boolean} True if union was successful, false if already in same set (would create cycle)
     * @timeComplexity O(α(n)) ≈ O(1) amortized
     */
    unite(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) {
            return false; // Already in same set (would create cycle)
        }

        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }

        return true;
    }
}

/**
 * Exports all data structures
 * @module
 */
module.exports = { MinHeap, PriorityQueue, UnionFind };