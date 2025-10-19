var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

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

// src/binary-search-tree.ts
var BinarySearchTree = class _BinarySearchTree {
  constructor(comparator) {
    __publicField(this, "_root");
    __publicField(this, "_size", 0);
    __publicField(this, "_comparator", defaultComparator);
    if (comparator) this._comparator = comparator;
  }
  insert(value) {
    const newNode = new BinarySearchTreeNode(value);
    const helper = (node) => {
      if (node === void 0) {
        node = newNode;
        return node;
      }
      if (this._comparator(value, node.value()) < 0) {
        node.setLeft(helper(node.left()));
      } else {
        node.setRight(helper(node.right()));
      }
      return node.balance();
    };
    this._size++;
    this._root = helper(this._root);
  }
  delete(value) {
    let newSuccessor = void 0;
    const helper = (node) => {
      if (node === void 0) return void 0;
      if (value === node.value()) {
        this._size--;
        let left = node.left();
        let right = node.right();
        if (left && right) {
          let successor = right;
          let successorParent = void 0;
          while (successor.left()) {
            successorParent = successor;
            successor = successor.left();
          }
          successor.setLeft(left);
          if (successor !== right) {
            successor.setRight(right);
          }
          if (successorParent) {
            successorParent.setLeft(void 0);
          }
          newSuccessor = successor;
        } else if (left && !right) {
          newSuccessor = left;
        } else if (!left && right) {
          newSuccessor = right;
        } else {
          newSuccessor = void 0;
        }
        node.setLeft(void 0);
        node.setRight(void 0);
        return newSuccessor?.balance();
      } else if (this._comparator(value, node.value()) < 0) {
        node.setLeft(helper(node.left()));
      } else {
        node.setRight(helper(node.right()));
      }
      return node.balance();
    };
    this._root = helper(this._root);
    return newSuccessor;
  }
  filter(filterFunction) {
    let arr = this.toArray();
    let deleted = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      let value = arr[i];
      if (filterFunction(value)) continue;
      this.delete(value);
      deleted.push(value);
    }
    return deleted;
  }
  clear() {
    this._root = void 0;
    this._size = 0;
  }
  clone() {
    const cloneNode = (node) => {
      if (node === void 0) return void 0;
      let newNode = new BinarySearchTreeNode(node.value());
      newNode.setLeft(cloneNode(node.left()));
      newNode.setRight(cloneNode(node.right()));
      newNode.setHeight(node.height());
      return newNode;
    };
    const newTree = new _BinarySearchTree(this._comparator);
    newTree._root = cloneNode(this._root);
    newTree._size = this._size;
    return newTree;
  }
  toArray() {
    return [...this.values()];
  }
  min() {
    if (this._root === void 0) return;
    let current = this._root;
    while (current.left() !== void 0) {
      current = current.left();
    }
    return current.value();
  }
  max() {
    if (this._root === void 0) return;
    let current = this._root;
    while (current.right() !== void 0) {
      current = current.right();
    }
    return current.value();
  }
  size() {
    return this._size;
  }
  isEmpty() {
    return this._size === 0;
  }
  height() {
    return this._root?.height() ?? 0;
  }
  root() {
    if (!this._root) return void 0;
    return this._root;
  }
  *values() {
    function* inorder(node) {
      if (node === void 0) return;
      yield* inorder(node.left());
      yield node.value();
      yield* inorder(node.right());
    }
    yield* inorder(this._root);
  }
  *[Symbol.iterator]() {
    yield* this.values();
  }
  static fromArray(array, comparator) {
    const bst = new _BinarySearchTree(comparator);
    array.forEach((data) => bst.insert(data));
    return bst;
  }
  static fromSortedArray(array, comparator) {
    const bst = new _BinarySearchTree(comparator);
    const helper = (left, right) => {
      if (left > right) return void 0;
      let mid = left + right >> 1;
      let root = new BinarySearchTreeNode(array[mid]);
      root.setLeft(helper(left, mid - 1));
      root.setRight(helper(mid + 1, right));
      root.updateHeight();
      return root;
    };
    bst._root = helper(0, array.length - 1);
    bst._size = array.length;
    return bst;
  }
};
var BinarySearchTreeNode = class {
  constructor(value) {
    __publicField(this, "_value");
    __publicField(this, "_left");
    __publicField(this, "_right");
    __publicField(this, "_height", 1);
    this._value = value;
  }
  left() {
    return this._left;
  }
  right() {
    return this._right;
  }
  value() {
    return this._value;
  }
  height() {
    return this._height;
  }
  setLeft(node) {
    this._left = node;
  }
  setRight(node) {
    this._right = node;
  }
  setHeight(height) {
    this._height = height;
  }
  updateHeight() {
    this._height = 1 + Math.max(this._left?._height ?? 0, this._right?._height ?? 0);
  }
  rotateLeft() {
    let right = this._right;
    if (right === void 0) return this;
    this._right = right._left;
    right._left = this;
    this.updateHeight();
    right.updateHeight();
    return right;
  }
  rotateRight() {
    let left = this._left;
    if (left === void 0) return this;
    this._left = left._right;
    left._right = this;
    this.updateHeight();
    left.updateHeight();
    return left;
  }
  computeBalanceFactor() {
    let leftHeight = this._left?._height ?? 0;
    let rightHeight = this._right?._height ?? 0;
    return leftHeight - rightHeight;
  }
  balance() {
    this.updateHeight();
    let factor = this.computeBalanceFactor();
    if (factor > 1) {
      let left = this.left();
      if (left !== void 0 && left.computeBalanceFactor() < 0) {
        this.setLeft(left.rotateLeft());
      }
      return this.rotateRight();
    } else if (factor < -1) {
      let right = this.right();
      if (right !== void 0 && right.computeBalanceFactor() > 0) {
        this.setRight(right.rotateRight());
      }
      return this.rotateLeft();
    }
    return this;
  }
};
export {
  BinarySearchTree,
  BinarySearchTreeNode
};
