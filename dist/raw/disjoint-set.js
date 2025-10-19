var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/disjoint-set.ts
var DisjointSet = class {
  constructor() {
    __publicField(this, "_parentMap", /* @__PURE__ */ new Map());
    __publicField(this, "_rankMap", /* @__PURE__ */ new Map());
  }
  add(node) {
    if (this._parentMap.has(node)) return false;
    this._parentMap.set(node, node);
    this._rankMap.set(node, 0);
    return true;
  }
  find(node) {
    let parent = this._parentMap.get(node);
    if (!parent) return;
    if (parent === node) return node;
    let root = this.find(parent);
    if (!root) return parent;
    this._parentMap.set(node, root);
    return root;
  }
  findOrAdd(node) {
    let parent = this.find(node);
    if (!parent) {
      this.add(node);
      return node;
    }
    return parent;
  }
  union(nodeA, nodeB) {
    let parentA = this.findOrAdd(nodeA);
    let parentB = this.findOrAdd(nodeB);
    if (parentA === parentB) return false;
    let rankA = this._rankMap.get(parentA) ?? 0;
    let rankB = this._rankMap.get(parentB) ?? 0;
    if (rankA === rankB) {
      this._parentMap.set(parentA, parentB);
      this._rankMap.set(parentB, rankB + 1);
    } else if (rankA > rankB) {
      this._parentMap.set(parentB, parentA);
    } else {
      this._parentMap.set(parentA, parentB);
    }
    return true;
  }
  clear() {
    this._parentMap.clear();
    this._rankMap.clear();
  }
  size() {
    return this._parentMap.size;
  }
};
export {
  DisjointSet
};
