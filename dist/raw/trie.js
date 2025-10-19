var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src/trie.ts
var TrieNode = class _TrieNode {
  constructor(value) {
    __publicField(this, "children");
    __publicField(this, "isEndOfWord");
    __publicField(this, "value");
    this.value = value;
    this.children = /* @__PURE__ */ new Map();
    this.isEndOfWord = false;
  }
  addChild(char) {
    let node = this.children.get(char);
    if (!node) {
      node = new _TrieNode(char);
      this.children.set(char, node);
    }
    return node;
  }
};
var Trie = class {
  constructor() {
    __publicField(this, "_root", new TrieNode(""));
  }
  insert(word) {
    let current = this._root;
    for (const char of word) {
      current = current.addChild(char);
    }
    current.isEndOfWord = true;
  }
  search(word) {
    let current = this._root;
    for (const char of word) {
      current = current.children.get(char);
      if (!current) return false;
    }
    return current.isEndOfWord;
  }
  startsWith(prefix) {
    let current = this._root;
    for (const char of prefix) {
      current = current.children.get(char);
      if (!current) return false;
    }
    return true;
  }
  delete(word) {
    let deleted = false;
    const helper = (node, word2, index) => {
      if (index === word2.length) {
        if (!node.isEndOfWord) return false;
        node.isEndOfWord = false;
        deleted = true;
        return node.children.size === 0;
      }
      const char = word2[index];
      const childNode = node.children.get(char);
      if (!childNode) return false;
      const shouldDeleteChild = helper(childNode, word2, index + 1);
      if (shouldDeleteChild) {
        node.children.delete(char);
        deleted = true;
        return node.children.size === 0 && !node.isEndOfWord;
      }
      return false;
    };
    helper(this._root, word, 0);
    return deleted;
  }
  getAllWords() {
    return this._collectWords(this._root, "");
  }
  isEmpty() {
    return this._root.children.size === 0;
  }
  clear() {
    this._root = new TrieNode("");
  }
  longestPrefixMatch(word) {
    let current = this._root;
    let longestPrefix = "";
    let currentPrefix = "";
    for (const char of word) {
      currentPrefix += char;
      const node = current.children.get(char);
      if (!node) break;
      current = node;
      if (node.isEndOfWord) {
        longestPrefix = currentPrefix;
      }
    }
    return longestPrefix;
  }
  autocomplete(prefix) {
    let current = this._root;
    for (const char of prefix) {
      current = current.children.get(char);
      if (!current) return [];
    }
    return this._collectWords(current, prefix);
  }
  _collectWords(node, prefix) {
    const words = [];
    if (node.isEndOfWord) {
      words.push(prefix);
    }
    for (const [char, childNode] of node.children) {
      words.push(...this._collectWords(childNode, prefix + char));
    }
    return words;
  }
};
export {
  Trie
};
