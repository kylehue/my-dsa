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

// src/utils/common.ts
function isOverlapping(lowA, highA, lowB, highB) {
  if (lowA > highA || lowB > highB) {
    throw new RangeError("Lower bound must be less than the higher bound.");
  }
  return lowA < highB && lowB < highA;
}

// src/interval-tree.ts
var IntervalTree = class _IntervalTree {
  constructor(rangeMapper) {
    __publicField(this, "_rangeMapper");
    __publicField(this, "_tree", new BinarySearchTree(
      (a, b) => a.lowerBound - b.lowerBound
    ));
    this._rangeMapper = rangeMapper;
  }
  insert(data) {
    let [lower, upper] = this._rangeMapper(data);
    if (lower > upper) {
      throw new RangeError(
        "Lower bound must be less than the higher bound."
      );
    }
    const newNode = new IntervalTreeData(lower, upper, upper, data);
    this._tree.insert(newNode);
    this._recomputeMaxUpperBound(data);
  }
  delete(data) {
    for (let { node, parent } of this._traverseTo(data)) {
      if (node.value().data !== data) continue;
      let successor = this._tree.delete(node.value()) ?? parent;
      if (successor !== void 0) {
        this._recomputeMaxUpperBound(successor.value().data);
      }
    }
  }
  filter(filterFunction) {
    let arr = [];
    function dfs(node) {
      if (node === void 0) return;
      arr.push(node.value());
      dfs(node.left());
      dfs(node.right());
    }
    dfs(this._tree.root());
    let deleted = [];
    for (let intervalData of arr) {
      if (filterFunction(intervalData.data)) continue;
      this.delete(intervalData.data);
      deleted.push(intervalData.data);
    }
    return deleted;
  }
  deleteInRange(lower, upper, inclusive) {
    return this.filter((x) => {
      let [lowerBound, upperBound] = this._rangeMapper(x);
      let isOverlappingInclusive = inclusive && (lowerBound === upper || upperBound === lower);
      return !(isOverlappingInclusive || isOverlapping(lower, upper, lowerBound, upperBound));
    });
  }
  query(lower, upper, inclusive) {
    if (lower > upper) {
      throw new RangeError(
        "Lower bound must be less than the higher bound."
      );
    }
    return [...this.rangeQuery(lower, upper, inclusive)];
  }
  hasOverlap(lower, upper, inclusive) {
    if (lower > upper) {
      throw new RangeError(
        "Lower bound must be less than the higher bound."
      );
    }
    for (let _ of this.rangeQuery(lower, upper, inclusive)) return true;
    return false;
  }
  clear() {
    this._tree.clear();
  }
  size() {
    return this._tree.size();
  }
  isEmpty() {
    return this._tree.isEmpty();
  }
  clone() {
    const intervalTree = new _IntervalTree(this._rangeMapper);
    intervalTree._tree = this._tree.clone();
    return intervalTree;
  }
  *rangeQuery(lower, upper, inclusive) {
    if (lower > upper) {
      throw new RangeError(
        "Lower bound must be less than the higher bound."
      );
    }
    function* dfs(node) {
      if (node === void 0) return;
      const { lowerBound, upperBound, data } = node.value();
      let isOverlappingInclusive = inclusive && (lowerBound === upper || upperBound === lower);
      if (isOverlappingInclusive || isOverlapping(lower, upper, lowerBound, upperBound)) {
        yield data;
      }
      let left = node.left();
      if (left && left.value().maxUpperBound >= lower) {
        yield* dfs(left);
      }
      yield* dfs(node.right());
    }
    yield* dfs(this._tree.root());
  }
  *values() {
    yield* this.rangeQuery(-Infinity, Infinity);
  }
  *[Symbol.iterator]() {
    yield* this.values();
  }
  static fromArray(array, rangeMapper) {
    let it = new _IntervalTree(rangeMapper);
    array.forEach((data) => it.insert(data));
    return it;
  }
  _recomputeMaxUpperBound(data) {
    for (let { node } of this._traverseTo(data)) {
      let upperBound = node.value().upperBound;
      node.value().maxUpperBound = Math.max(
        upperBound,
        node.left()?.value().maxUpperBound ?? upperBound,
        node.right()?.value().maxUpperBound ?? upperBound
      );
    }
  }
  *_traverseTo(data) {
    let value = this._rangeMapper(data)[0];
    function* dfs(node, parent) {
      if (node === void 0) return;
      let lowerBound = node.value().lowerBound;
      if (node.value().data === data) {
        yield { node, parent };
        return;
      }
      if (value < lowerBound) {
        yield* dfs(node.left(), node);
      } else {
        yield* dfs(node.right(), node);
      }
      yield { node, parent };
    }
    yield* dfs(this._tree.root(), void 0);
  }
};
var IntervalTreeData = class {
  constructor(lowerBound, upperBound, maxUpperBound, data) {
    __publicField(this, "data");
    __publicField(this, "lowerBound");
    __publicField(this, "upperBound");
    __publicField(this, "maxUpperBound");
    this.data = data;
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
    this.maxUpperBound = maxUpperBound;
  }
};
export {
  IntervalTree
};
