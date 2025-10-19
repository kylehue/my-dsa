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

// src/hash-grid.ts
function getDefaultHashGridConfig() {
  const defaultHashGridConfig = {
    cellWidth: 48,
    cellHeight: 48
  };
  return defaultHashGridConfig;
}
var HashGrid = class {
  constructor(config = {}) {
    __publicField(this, "_config");
    __publicField(this, "_cells", /* @__PURE__ */ new Map());
    __publicField(this, "_cellWidthShift", 0);
    __publicField(this, "_cellHeightShift", 0);
    this._config = Object.assign(getDefaultHashGridConfig(), config);
    this.setCellWidth(this._config.cellWidth);
    this.setCellHeight(this._config.cellHeight);
  }
  clear() {
    this._cells.clear();
  }
  insert(item) {
    const bounds = getObjectBounds(item);
    const startX = this._getColumnIndex(bounds.x);
    const startY = this._getRowIndex(bounds.y);
    const endX = this._getColumnIndex(bounds.x + bounds.width) + 1;
    const endY = this._getRowIndex(bounds.y + bounds.height) + 1;
    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        const key = this._getHashKey(x, y);
        if (!this._cells.has(key)) {
          this._cells.set(key, []);
        }
        this._cells.get(key).push(item);
      }
    }
  }
  retrieve(location) {
    const result = /* @__PURE__ */ new Set();
    const bounds = getObjectBounds(location);
    const startX = this._getColumnIndex(bounds.x);
    const startY = this._getRowIndex(bounds.y);
    const endX = this._getColumnIndex(bounds.x + bounds.width) + 1;
    const endY = this._getRowIndex(bounds.y + bounds.height) + 1;
    for (let x = startX; x < endX; x++) {
      for (let y = startY; y < endY; y++) {
        const key = this._getHashKey(x, y);
        const items = this._cells.get(key);
        if (items) {
          for (const item of items) result.add(item);
        }
      }
    }
    return [...result];
  }
  setCellWidth(cellWidth) {
    this._config.cellWidth = cellWidth;
    this._cellWidthShift = Math.floor(Math.log2(cellWidth));
  }
  setCellHeight(cellHeight) {
    this._config.cellHeight = cellHeight;
    this._cellHeightShift = Math.floor(Math.log2(cellHeight));
  }
  _getHashKey(x, y) {
    return x << 16 | y;
  }
  _getRowIndex(y) {
    return y >> this._cellHeightShift;
  }
  _getColumnIndex(x) {
    return x >> this._cellWidthShift;
  }
  get config() {
    return this._config;
  }
};
export {
  HashGrid
};
