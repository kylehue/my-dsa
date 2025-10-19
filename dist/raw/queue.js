var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/linked-list.ts
var LinkedList = class _LinkedList {
  constructor() {
    __publicField(this, "_head");
    __publicField(this, "_tail");
    __publicField(this, "_size", 0);
  }
  append(value) {
    const newNode = new ListNode(value);
    if (!this._head) {
      this._head = newNode;
      this._tail = newNode;
    } else {
      this._tail.setNext(newNode);
      newNode.setPrev(this._tail);
      this._tail = newNode;
    }
    this._size++;
    return newNode;
  }
  prepend(value) {
    if (this._head) {
      return this.insertBefore(this._head, value);
    } else {
      return this.append(value);
    }
  }
  deleteNode(node) {
    if (this._head === void 0) return false;
    if (node.isDisposed()) return false;
    if (this._head === node) {
      this._head = this._head.next();
      if (this._head !== void 0) {
        this._head.setPrev(void 0);
      } else {
        this._tail = void 0;
      }
      node.dispose();
      this._size--;
      return true;
    } else if (this._tail === node) {
      this._tail = this._tail.prev();
      if (this._tail !== void 0) {
        this._tail.setNext(void 0);
      } else {
        this._head = void 0;
      }
      node.dispose();
      this._size--;
      return true;
    } else {
      let next = node.next();
      let prev = node.prev();
      if (next !== void 0 && prev !== void 0 && prev.next() === node && next.prev() === node) {
        next.setPrev(node.prev());
        prev.setNext(node.next());
        node.dispose();
        this._size--;
        return true;
      }
      return false;
    }
  }
  insertAfter(afterNode, value) {
    const newNode = new ListNode(value);
    newNode.setNext(afterNode.next());
    newNode.setPrev(afterNode);
    let afterNodeNext = afterNode.next();
    if (afterNodeNext) {
      afterNodeNext.setPrev(newNode);
    } else {
      this._tail = newNode;
    }
    afterNode.setNext(newNode);
    this._size++;
    return newNode;
  }
  insertBefore(beforeNode, value) {
    const newNode = new ListNode(value);
    if (this._head === beforeNode) {
      newNode.setNext(this._head);
      this._head.setPrev(newNode);
      this._head = newNode;
    } else {
      const prevNode = beforeNode.prev();
      if (prevNode) {
        prevNode.setNext(newNode);
        newNode.setPrev(prevNode);
      }
      newNode.setNext(beforeNode);
      beforeNode.setPrev(newNode);
    }
    this._size++;
    return newNode;
  }
  find(value) {
    for (let node of this) {
      if (node.value === value) {
        return node;
      }
    }
  }
  clone() {
    const cloneList = new _LinkedList();
    let current = this._head;
    while (current) {
      cloneList.append(current.value);
      current = current.next();
    }
    return cloneList;
  }
  clear() {
    this._head = void 0;
    this._tail = void 0;
    this._size = 0;
  }
  size() {
    return this._size;
  }
  isEmpty() {
    return this._size === 0;
  }
  toArray() {
    return [...this.values()];
  }
  head() {
    return this._head;
  }
  tail() {
    return this._tail;
  }
  static fromArray(array) {
    const list = new _LinkedList();
    for (const value of array) {
      list.append(value);
    }
    return list;
  }
  *values() {
    let current = this.head();
    while (current !== void 0) {
      yield current;
      current = current.next();
    }
  }
  *[Symbol.iterator]() {
    yield* this.values();
  }
};
var ListNode = class {
  constructor(value) {
    __publicField(this, "value");
    __publicField(this, "_next");
    __publicField(this, "_prev");
    __publicField(this, "_isDisposed", false);
    this.value = value;
  }
  next() {
    return this._next;
  }
  prev() {
    return this._prev;
  }
  isDisposed() {
    return this._isDisposed;
  }
  setNext(next) {
    this._next = next;
  }
  setPrev(prev) {
    this._prev = prev;
  }
  dispose() {
    this._isDisposed = true;
    this._prev = void 0;
    this._next = void 0;
  }
};

// src/queue.ts
var Queue = class _Queue {
  constructor() {
    __publicField(this, "_list", new LinkedList());
  }
  enqueue(value) {
    this._list.append(value);
  }
  dequeue() {
    const head = this._list.head();
    if (head) {
      this._list.deleteNode(head);
      return head.value;
    }
  }
  front() {
    return this._list.head()?.value;
  }
  back() {
    return this._list.tail()?.value;
  }
  size() {
    return this._list.size();
  }
  isEmpty() {
    return this._list.isEmpty();
  }
  clear() {
    this._list.clear();
  }
  clone() {
    const queue = new _Queue();
    queue._list = this._list.clone();
    return queue;
  }
  toArray() {
    return [...this.values()];
  }
  static fromArray(array) {
    const queue = new _Queue();
    for (const value of array) {
      queue.enqueue(value);
    }
    return queue;
  }
  *values() {
    let current = this._list.head();
    while (current !== void 0) {
      yield current.value;
      current = current.next();
    }
  }
  *[Symbol.iterator]() {
    yield* this.values();
  }
};
export {
  Queue
};
