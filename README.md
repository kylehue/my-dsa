# my-dsa

**my-dsa** is a JavaScript library that provides a collection of reusable data structures.

## Table of Contents
- [my-dsa](#my-dsa)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [LinkedList](#linkedlist)
  - [Queue](#queue)
  - [Deque](#deque)
  - [Heap](#heap)
  - [DisjointSet](#disjointset)
  - [Trie](#trie)
  - [Quadtree](#quadtree)
  - [HashGrid](#hashgrid)
  - [LRUCache](#lrucache)
  - [SegmentTree](#segmenttree)
  - [BinarySearchTree](#binarysearchtree)
  - [IntervalTree](#intervaltree)
  - [Contributing](#contributing)

## Installation

You can install using npm:
```bash
npm install my-dsa
```

or CDN:
```bash
https://cdn.jsdelivr.net/npm/my-dsa/dist/umd/index.js
```
The library will be accessible through the global name `mydsa`.

## LinkedList
A Linked List is a way to store a sequence of items where each item points to the next one.
```ts
import { LinkedList } from "my-dsa";

let list = new LinkedList<number>();

// Or create a linked list from an array
list = LinkedList.fromArray([1, 2, 3]);

// Adds a node to the end of the list
let node = list.append(4);

// Adds a node to the start of the list
let node = list.prepend(4);

// Removes a node from the list
list.deleteNode(node);

// Adds a node after a specific node
let newNodeAfter = list.insertAfter(node, 5);

// Adds a node before a specific node
let newNodeBefore = list.insertBefore(node, 0);

// Finds a node by value
let foundNode = list.find(3);

// Clones the linked list
let clone = list.clone();

// Removes all nodes from the list
list.clear();

// Get the number of nodes in the list
let size = list.size();

// Check if the list is empty
let isEmpty = list.isEmpty();

// Convert the list to an array
let array = list.toArray();

// Get the head node
let headNode = list.head();

// Get the tail node
let tailNode = list.tail();

// Iterate through the linked list
for (let node of list) {
   console.log(node.value);
}
```

## Queue
A Queue is a simple way to store items in order, like a line of people. You add items at the back (enqueue) and remove them from the front (dequeue).
```ts
import { Queue } from "my-dsa";

let queue = new Queue<number>();

// Or create a queue like this:
queue = Queue.fromArray([1, 2, 3]);

// Adds an item in the back
queue.enqueue(2);

// Removes an item in front
let front = queue.dequeue();

// Get the size of the queue
let size = queue.size();

// Clears the queue
queue.clear(); 

// Check if queue is empty
let isEmpty = queue.isEmpty(); 

// Peek the front element
let front = queue.front();

// Peek the back element
let back = queue.back();

// Clones the queue
let clone = queue.clone();

// Convert the queue to array
let array = queue.toArray();

// Iterate through the queue
for (let item of queue) {
   console.log(item);
}
```

## Deque
Deque or Double-Ended Queue is similar to queue except that you can add an element in front and dequeue from the back. It extends the [Queue](#queue) data structure.
```ts
import { Deque } from "my-dsa";

const deque = new Deque<number>();

// Adds an item in front
deque.enqueueFront(2);

// Removes an item in the back
deque.dequeueBack();
```

## Heap
A Heap is a type of tree structure that helps manage a collection of items, where the lowest/highest priority item can be instantly accessed.
```ts
import { Heap } from "my-dsa";

let heap = new Heap<number>();

// Or create a heap with a custom comparator
heap = new Heap<number>((a, b) => b - a); // Max-heap

// Or create a heap from an array
heap = Heap.fromArray([4, 2, 7, 1]);

// Or create a max heap from an array
heap = Heap.fromArray([4, 2, 7, 1], (a, b) => b - a);

// Get the size of the heap
let size = heap.size();

// Check if the heap is empty
let isEmpty = heap.isEmpty();

// Peek at the top element
let top = heap.peek();

// Add elements to the heap
heap.push(5, 3, 8, 1);

// Remove the top element
let top = heap.pop();

// Clears the heap
heap.clear();

// Clone the heap
let clone = heap.clone();

// Convert the heap to an array
let array = heap.toArray();
```

## DisjointSet
Disjoint Set or Union-Find is useful for efficiently managing and merging groups of connected elements, making it ideal for tasks like tracking connected components in graphs.
```ts
import { DisjointSet } from "my-dsa";

let ds = new DisjointSet<number>();

// Add nodes to the disjoint set
ds.add(1);
ds.add(2);
ds.add(3);

// Find the root of the set containing a node
let root = ds.find(2);

// Find or add a node to the disjoint set
let root = ds.findOrAdd(4);

// Union two sets containing the specified nodes
let isAlreadyUnified = ds.union(1, 3);

// Get the size of the disjoint set
let size = ds.size();
```

## Trie
This is ideal for managing a dynamic set of strings, allowing for efficient prefix searches, autocomplete features, and maybe spell-checking.
```ts
import { Trie } from "my-dsa";

// Create a new trie
let trie = new Trie();

// Insert words into the trie
trie.insert("apple");
trie.insert("app");

// Search for a word in the trie
let isFound = trie.search("app");

// Check if any word starts with the given prefix
let startsWith = trie.startsWith("ap");

// Delete a word from the trie
let isDeleted = trie.delete("apple");

// Get all words in the trie
let words = trie.getAllWords();

// Check if the trie is empty
let isEmpty = trie.isEmpty();

// Clear all words from the trie
trie.clear();

// Find the longest prefix of the given word that exists in the trie
let longestPrefix = trie.longestPrefixMatch("applepie");

// Autocomplete words with a given prefix
let suggestions = trie.autocomplete("app");
```

## Quadtree
This is useful for querying objects in 2D space, allowing efficient spatial searches like finding nearby objects.
```ts
import { Quadtree } from "my-dsa";

// Create a new quadtree with specified bounds and configuration
let bounds = { x: 0, y: 0, width: 100, height: 100 };
let config = { maxDepth: 5 };
let quadtree = new Quadtree(bounds, config);

// Insert an item into the quadtree
let item = { x: 10, y: 10, width: 5, height: 5 };
quadtree.insert(item);

// Retrieve all objects within specified bounds
let searchBounds = { x: 5, y: 5, width: 20, height: 20 };
let retrievedItems = quadtree.retrieve(searchBounds);
```

## HashGrid
Same as quadtree, but a bit simpler and faster.
```ts
import { HashGrid } from "my-dsa";

const hashGrid = new HashGrid();

// Insert
let item = { x: 10, y: 10, width: 5, height: 5 };
hashGrid.insert({});

// Retrieve
let searchBounds = { x: 5, y: 5, width: 20, height: 20 };
let retrievedItems = hashGrid.retrieve(searchBounds);
```

## LRUCache
LRUCache or Least-Recently-Used Cache acts exactly like a hashmap
except that it removes entries that are least recently used when it
hits the max capacity.
```ts
import { LRUCache } from "my-dsa";

// Create an LRUCache with a specific capacity
let cache = new LRUCache<string, number>(3);

// Adds a new element to the cache
cache.set("a", 1);
cache.set("b", 2);

// Retrieves a value from the cache by key
let value = cache.get("a");

// Check if a key exists in the cache
let exists = cache.has("b");

// Update an existing key with a new value
cache.set("a", 10);

// Deletes an element from the cache
let wasDeleted = cache.delete("a");

// Clear all elements from the cache
cache.clear();

// Get the current size of the cache
let size = cache.size();

// Support for-of iteration to loop over entries
for (let [key, value] of cache) {
   console.log(`${key}: ${value}`);
}
```

## SegmentTree
This is useful if you want to query sub-array operations in logarithmic time.
```ts
import { SegmentTree } from "my-dsa";

// Create a SegmentTree (default query is sum)
let segTree = new SegmentTree([1, 2, 3, 4, 5]);

// Query the sum over a range
let sum = segTree.query(1, 3); // 9

// Update an element at a specific index
segTree.update(2, 10);

// Create a SegmentTree for querying min values
let minTree = new SegmentTree([3, 5, 2, 7, 1], (a, b) => Math.min(a, b));

// Query the minimum over a range
// Note that we have to set the initial value of result to Infinity
let min = minTree.query(1, 3, Infinity); // 2
```

## BinarySearchTree
A binary search tree allows for efficient searching, insertion, and deletion of elements. This is an implementation of [AVLTree](https://en.wikipedia.org/wiki/AVL_tree), or self-balancing binary search tree.
```ts
import { BinarySearchTree } from "my-dsa";

// Create a binary search tree
let bst = new BinarySearchTree();

// or create a binary search tree with custom comparator
bst = new BinarySearchTree((a, b) => a - b);

// Insert values into the tree
bst.insert(30);

// Check the size of the tree
let size = bst.size();

// Find the minimum and maximum values
let min = bst.min();
let max = bst.max();

// Delete a value from the tree
bst.delete(20);

// Filter the tree
bst.filter((x) => x > 20);

// Check if the tree is empty
let isEmpty = bst.isEmpty();

// Access the root
let root = bst.root();

// Create a tree from an array
let newTree = BinarySearchTree.fromArray([50, 30, 70, 20, 40]);

// Create a tree from a sorted array (faster)
let newTree = BinarySearchTree.fromSortedArray([1, 2, 3, 4]);

// Loop (in-order)
for (let value of bst) {
   console.log(value);
}
```

## IntervalTree
A data structure for managing intervals and querying overlapping intervals.
```ts
import { IntervalTree } from "my-dsa";

type IntervalObject = {
  name: string;
  interval: [number, number];
};

// Create instance
let intervalTree = new IntervalTree<IntervalObject>((data) => data.interval);

// Insert intervals into the tree
let sampleData: IntervalObject = { name: "sample", interval: [10, 20] };
intervalTree.insert(sampleData);

// Query overlapping intervals
let overlappingIntervals = intervalTree.query(12, 22);

// Check the size of the tree (number of intervals)
let size = intervalTree.size();

// Delete an interval from the tree
intervalTree.delete(sampleData);

// Filter the tree
intervalTree.filter((x) => x[0] > 20);

// Delete intervals that overlap within range
intervalTree.deleteInRange(5, 10);

// Check if the tree is empty
let isEmpty = intervalTree.isEmpty();

// Access the root
let root = intervalTree.root();

// Clear the tree
intervalTree.clear();

// Create a tree from an array of intervals
let tree = IntervalTree.fromArray<IntervalObject>(array, rangeMapper);

// Query intervals that overlap a specific range
for (let interval of intervalTree.query(10, 25)) {
   console.log(interval.name, interval.interval);
}

// For-of loop
for (let interval of intervalTree) {
   console.log(interval.name, interval.interval);
}
```

## Contributing
Contributions are welcome! Please submit a pull request or open an issue if you have any ideas, improvements, or suggestions.