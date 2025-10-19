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

// src/lru-cache.ts
var LRUCache = class {
  constructor(capacity = 100) {
    __publicField(this, "_capacity");
    __publicField(this, "_list", new LinkedList());
    __publicField(this, "_cache", /* @__PURE__ */ new Map());
    this._capacity = capacity;
  }
  _reenqueue(key, cache) {
    if (!cache) throw new Error("Cache doesn't exist to be re-enqueued");
    this._list.deleteNode(cache[1]);
    cache[1] = this._list.append([key, cache[0]]);
  }
  get(key) {
    let cache = this._cache.get(key);
    if (cache === void 0) return;
    this._reenqueue(key, cache);
    return cache[0];
  }
  set(key, value) {
    let cache = this._cache.get(key);
    if (cache !== void 0) {
      cache[0] = value;
      this._reenqueue(key, cache);
    } else {
      if (this._list.size() >= this._capacity) {
        let head = this._list.head();
        let key2 = head.value[0];
        this._list.deleteNode(head);
        this._cache.delete(key2);
      }
      let newNode = this._list.append([key, value]);
      this._cache.set(key, [value, newNode]);
    }
  }
  has(key) {
    return this._cache.has(key);
  }
  delete(key) {
    let cache = this._cache.get(key);
    if (cache === void 0) return false;
    this._list.deleteNode(cache[1]);
    return this._cache.delete(key);
  }
  clear() {
    this._cache.clear();
    this._list.clear();
  }
  size() {
    return this._cache.size;
  }
  *keys() {
    let current = this._list.head();
    while (current !== void 0) {
      yield current.value[0];
      current = current.next();
    }
  }
  *values() {
    let current = this._list.head();
    while (current !== void 0) {
      yield current.value[1];
      current = current.next();
    }
  }
  *entries() {
    let current = this._list.head();
    while (current !== void 0) {
      yield [...current.value];
      current = current.next();
    }
  }
  *[Symbol.iterator]() {
    yield* this.entries();
  }
};
export {
  LRUCache
};
