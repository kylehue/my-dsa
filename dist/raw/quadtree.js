var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/utils/bounds.ts
function getObjectBounds(object) {
  let obj = object;
  if (!obj) throw new Error("Object is not bounded.");
  if (typeof obj.bounds === "object" && typeof obj.bounds.x === "number" && typeof obj.bounds.y === "number" && typeof obj.bounds.width === "number" && typeof obj.bounds.height === "number") {
    return obj.bounds;
  } else if (typeof obj.x === "number" && typeof obj.y === "number" && typeof obj.width === "number" && typeof obj.height === "number") {
    return obj;
  }
  throw new Error("Object is not bounded.");
}

// src/quadtree.ts
var Quadtree = class {
  constructor(bounds, config = {}) {
    __publicField(this, "_config");
    __publicField(this, "_baseBounds");
    __publicField(this, "_root");
    this._config = { ...defaultQuadtreeConfig, ...config };
    this._baseBounds = bounds;
    this._root = new QuadtreeNode(this, this._baseBounds);
  }
  clear() {
    this._root = new QuadtreeNode(this, this._baseBounds);
  }
  insert(item) {
    this._root.insert(item);
  }
  retrieve(location) {
    return this._root.retrieve(location);
  }
  config() {
    return this._config;
  }
  root() {
    return this._root;
  }
};
var QuadtreeNode = class _QuadtreeNode {
  constructor(quadtree, bounds, depth = 0) {
    __publicField(this, "_quadtree");
    __publicField(this, "_bounds");
    __publicField(this, "_depth", 0);
    __publicField(this, "_objects", []);
    __publicField(this, "_nodes", []);
    this._quadtree = quadtree;
    this._bounds = bounds;
    this._depth = depth;
  }
  clear() {
    this._nodes = [];
    this._objects = [];
  }
  insert(item) {
    this._objects.push(item);
    const config = this._quadtree.config();
    if (this._nodes.length > 0 || this._objects.length <= config.maxObjects || this._depth + 1 >= config.maxDepth) {
      return;
    }
    let subWidth = this._bounds.width / 2;
    let subHeight = this._bounds.height / 2;
    if (subWidth <= config.minWidth || subHeight <= config.minHeight) {
      return;
    }
    this._split(subWidth, subHeight);
  }
  retrieve(location) {
    let result = [];
    let bounds = getObjectBounds(location);
    let stack = [this];
    while (stack.length > 0) {
      let current = stack.pop();
      if (current._bounds.x <= bounds.x + bounds.width && current._bounds.x + current._bounds.width >= bounds.x && current._bounds.y + current._bounds.height >= bounds.y && current._bounds.y <= bounds.y + bounds.height) {
        result.push(...current._objects);
        if (current._nodes.length > 0) {
          let indices = current._getQuadrantIndices(bounds);
          for (let index of indices) {
            stack.push(current._nodes[index]);
          }
        }
      }
    }
    return result;
  }
  _getQuadrantIndices(bounds) {
    let indices = [];
    let verticalMidpoint = this._bounds.x + (this._bounds.width >> 1);
    let horizontalMidpoint = this._bounds.y + (this._bounds.height >> 1);
    let topQuadrant = bounds.y < horizontalMidpoint;
    let bottomQuadrant = bounds.y + bounds.height >= horizontalMidpoint;
    if (bounds.x < verticalMidpoint) {
      if (topQuadrant) indices.push(1);
      if (bottomQuadrant) indices.push(2);
    }
    if (bounds.x + bounds.width >= verticalMidpoint) {
      if (topQuadrant) indices.push(0);
      if (bottomQuadrant) indices.push(3);
    }
    return indices;
  }
  _split(subWidth, subHeight) {
    let x = this._bounds.x;
    let y = this._bounds.y;
    let newDepth = this._depth + 1;
    this._nodes = [
      new _QuadtreeNode(
        this._quadtree,
        {
          x: x + subWidth,
          y,
          width: subWidth,
          height: subHeight
        },
        newDepth
      ),
      new _QuadtreeNode(
        this._quadtree,
        {
          x,
          y,
          width: subWidth,
          height: subHeight
        },
        newDepth
      ),
      new _QuadtreeNode(
        this._quadtree,
        {
          x,
          y: y + subHeight,
          width: subWidth,
          height: subHeight
        },
        newDepth
      ),
      new _QuadtreeNode(
        this._quadtree,
        {
          x: x + subWidth,
          y: y + subHeight,
          width: subWidth,
          height: subHeight
        },
        newDepth
      )
    ];
    for (let object of this._objects) {
      let bounds = getObjectBounds(object);
      let indices = this._getQuadrantIndices(bounds);
      for (let index of indices) {
        this._nodes[index].insert(object);
      }
    }
    this._objects = [];
  }
};
var defaultQuadtreeConfig = {
  minWidth: 48,
  minHeight: 48,
  maxDepth: 8,
  maxObjects: 12
};
export {
  Quadtree
};
