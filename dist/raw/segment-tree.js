var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/segment-tree.ts
var SegmentTree = class {
  constructor(nums, builder = defaultBuilder) {
    __publicField(this, "_tree");
    __publicField(this, "_origSize");
    __publicField(this, "_builder");
    this._origSize = nums.length;
    this._builder = builder;
    this._tree = new Array(this._origSize).concat(nums);
    for (let i = this._origSize - 1; i > 0; i--) {
      this._tree[i] = this._builder(
        this._tree[i * 2],
        this._tree[i * 2 + 1]
      );
    }
  }
  query(start, end, resultInitialValue = 0) {
    start += this._origSize;
    end += this._origSize;
    let result = resultInitialValue;
    while (start <= end) {
      let isStartRightChild = (start & 1) === 1;
      if (isStartRightChild) {
        result = this._builder(this._tree[start], result);
        start++;
      }
      let isEndLeftChild = (end & 1) === 0;
      if (isEndLeftChild) {
        result = this._builder(this._tree[end], result);
        end--;
      }
      start >>>= 1;
      end >>>= 1;
    }
    return result;
  }
  update(index, newValue) {
    index += this._origSize;
    this._tree[index] = typeof newValue === "function" ? newValue(this._tree[index]) : newValue;
    while (index > 1) {
      index >>>= 1;
      this._tree[index] = this._builder(
        this._tree[index * 2],
        this._tree[index * 2 + 1]
      );
    }
  }
};
var defaultBuilder = (a, b) => a + b;
export {
  SegmentTree
};
