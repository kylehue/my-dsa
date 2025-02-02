import { Bounds, BoundedObject, getObjectBounds } from "./utils/bounds";

export class Quadtree<T = Bounds | BoundedObject> {
   private readonly _config: QuadtreeConfig;
   private readonly _baseBounds: Bounds;
   private _root: QuadtreeNode<T>;

   constructor(bounds: Bounds, config: Partial<QuadtreeConfig> = {}) {
      this._config = { ...defaultQuadtreeConfig, ...config };
      this._baseBounds = bounds;
      this._root = new QuadtreeNode(this, this._baseBounds);
   }

   /**
    * Clears the quadtree.
    *
    * @timeComplexity `O(1)`
    */
   clear(): void {
      this._root = new QuadtreeNode(this, this._baseBounds);
   }

   /**
    * Inserts an item into the quadtree.
    *
    * @param item The item to insert.
    *
    * @timeComplexity `O(n)` / `Ω(log(n))`
    */
   insert(item: T): void {
      this._root.insert(item);
   }

   /**
    * Retrieves all objects that is inside the specified bounds.
    *
    * @param location The location of the object to retrieve from.
    *
    * @timeComplexity `O(n)` / `Ω(log(n))`
    *
    * @returns An array of objects that are inside the specified bounds.
    */
   retrieve(location: T | Bounds | BoundedObject): T[] {
      return this._root.retrieve(location);
   }

   config() {
      return this._config;
   }

   root() {
      return this._root;
   }
}

class QuadtreeNode<T = Bounds | BoundedObject> {
   private readonly _quadtree: Quadtree<T>;
   private readonly _bounds: Bounds;
   private readonly _depth: number = 0;
   private _objects: T[] = [];
   private _nodes: QuadtreeNode<T>[] = [];

   constructor(quadtree: Quadtree<T>, bounds: Bounds, depth = 0) {
      this._quadtree = quadtree;
      this._bounds = bounds;
      this._depth = depth;
   }

   clear(): void {
      this._nodes = [];
      this._objects = [];
   }

   insert(item: T): void {
      this._objects.push(item);
      const config = this._quadtree.config();

      // Should we split?
      if (
         this._nodes.length > 0 ||
         this._objects.length <= config.maxObjects ||
         this._depth + 1 >= config.maxDepth
      ) {
         return;
      }

      // Should we really really split?
      let subWidth = this._bounds.width / 2;
      let subHeight = this._bounds.height / 2;
      if (subWidth <= config.minWidth || subHeight <= config.minHeight) {
         return;
      }

      this._split(subWidth, subHeight);
   }

   retrieve(location: T | Bounds | BoundedObject): T[] {
      let result: T[] = [];
      let bounds = getObjectBounds(location);

      // DFS search in subnodes
      let stack: QuadtreeNode<T>[] = [this];
      while (stack.length > 0) {
         let current = stack.pop()!;
         if (
            current._bounds.x <= bounds.x + bounds.width &&
            current._bounds.x + current._bounds.width >= bounds.x &&
            current._bounds.y + current._bounds.height >= bounds.y &&
            current._bounds.y <= bounds.y + bounds.height
         ) {
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

   private _getQuadrantIndices(bounds: Bounds): number[] {
      let indices: number[] = [];

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

   private _split(subWidth: number, subHeight: number): void {
      let x = this._bounds.x;
      let y = this._bounds.y;
      let newDepth = this._depth + 1;

      this._nodes = [
         new QuadtreeNode(
            this._quadtree,
            {
               x: x + subWidth,
               y: y,
               width: subWidth,
               height: subHeight,
            },
            newDepth
         ),
         new QuadtreeNode(
            this._quadtree,
            {
               x: x,
               y: y,
               width: subWidth,
               height: subHeight,
            },
            newDepth
         ),
         new QuadtreeNode(
            this._quadtree,
            {
               x: x,
               y: y + subHeight,
               width: subWidth,
               height: subHeight,
            },
            newDepth
         ),
         new QuadtreeNode(
            this._quadtree,
            {
               x: x + subWidth,
               y: y + subHeight,
               width: subWidth,
               height: subHeight,
            },
            newDepth
         ),
      ];

      // Transfer this current node's objects to their respective subnodes
      for (let object of this._objects) {
         let bounds = getObjectBounds(object);
         let indices = this._getQuadrantIndices(bounds);
         for (let index of indices) {
            this._nodes[index].insert(object);
         }
      }
      this._objects = [];
   }
}

const defaultQuadtreeConfig = {
   /**
    * The minimum width of a node before it can be split.
    * @default 48
    */
   minWidth: 48,
   /**
    * The minimum height of a node before it can be split.
    * @default 48
    */
   minHeight: 48,
   /**
    * The maximum depth of the quadtree.
    * @default 8
    */
   maxDepth: 8,
   /**
    * The maximum number of objects a node can hold before it splits.
    * @default 12
    */
   maxObjects: 12,
};

export type QuadtreeConfig = typeof defaultQuadtreeConfig;
