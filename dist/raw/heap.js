var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/utils/common.ts
function swap(array, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
}

// src/utils/comparator.ts
var defaultComparator = (a, b) => {
  if (a === b) return 0;
  if (typeof a === "string" && typeof b === "string") {
    return a.localeCompare(b);
  }
  if (typeof a === "number" && typeof b === "number") {
    return a - b;
  }
  throw new Error("Unsupported type or mixed types in default comparator");
};

// src/heap.ts
var Heap = class _Heap {
  constructor(comparator) {
    __publicField(this, "_heap", []);
    __publicField(this, "_comparator", defaultComparator);
    if (comparator) this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() === 0;
  }
  peek() {
    return this.isEmpty() ? void 0 : this._heap[0];
  }
  push(...items) {
    for (const item of items) {
      this._heap.push(item);
      this._heapifyUp(this.size() - 1);
    }
  }
  pop() {
    if (this.isEmpty()) return;
    if (this.size() === 1) return this._heap.pop();
    const removedValue = this._heap[0];
    this._heap[0] = this._heap.pop();
    this._heapifyDown(0);
    return removedValue;
  }
  clear() {
    this._heap = [];
  }
  clone() {
    const clonedHeap = new _Heap(this._comparator);
    clonedHeap._heap = [...this._heap];
    return clonedHeap;
  }
  toArray() {
    const clone = this.clone();
    const result = [];
    while (!clone.isEmpty()) {
      result.push(clone.pop());
    }
    return result;
  }
  static fromArray(array, comparator) {
    const heap = new _Heap(comparator);
    heap._heap = [...array];
    for (let i = heap.size() - 1; i >= 0; i--) {
      heap._heapifyDown(i);
    }
    return heap;
  }
  _heapifyDown(index) {
    let currentIndex = index;
    while (this._getLeftChildIndex(currentIndex) < this.size()) {
      let smallestChildIndex = this._getLeftChildIndex(currentIndex);
      if (this._getRightChildIndex(currentIndex) < this.size() && this._comparator(
        this._heap[this._getLeftChildIndex(currentIndex)],
        this._heap[this._getRightChildIndex(currentIndex)]
      ) > 0) {
        smallestChildIndex = this._getRightChildIndex(currentIndex);
      }
      if (this._comparator(
        this._heap[currentIndex],
        this._heap[smallestChildIndex]
      ) > 0) {
        swap(this._heap, currentIndex, smallestChildIndex);
        currentIndex = smallestChildIndex;
      } else {
        break;
      }
    }
  }
  _heapifyUp(index) {
    let currentIndex = index;
    while (this._getParentIndex(currentIndex) >= 0 && this._comparator(
      this._heap[currentIndex],
      this._heap[this._getParentIndex(currentIndex)]
    ) < 0) {
      const parentIndex = this._getParentIndex(currentIndex);
      swap(this._heap, currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }
  _getParentIndex(index) {
    return index - 1 >> 1;
  }
  _getLeftChildIndex(index) {
    return (index << 1) + 1;
  }
  _getRightChildIndex(index) {
    return (index << 1) + 2;
  }
};
export {
  Heap
};
