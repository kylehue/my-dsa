export class SegmentTree {
   private readonly _tree: number[];
   private readonly _origSize: number;
   private readonly _builder: SegmentTreeBuilder;

   /**
    * Initializes the segment tree.
    * @param nums - Array of numbers to query from.
    * @param builder - A custom function to build the tree (e.g. sum, min, max).
    *
    * @timeComplexity `O(n)`
    *
    * @example
    * // For sum queries
    * let st = new SegmentTree([1, 2, 3]);
    * st.query(0, 1); // 3
    *
    * // For max queries
    * let st = new SegmentTree([1, 2, 3], (a, b) => Math.max(a, b));
    * st.query(0, 1, -Infinity); // 2
    *
    * // For min queries
    * let st = new SegmentTree([1, 2, 3], (a, b) => Math.min(a, b));
    * st.query(0, 1, Infinity); // 1
    */
   constructor(nums: number[], builder = defaultBuilder) {
      this._origSize = nums.length;
      this._builder = builder;

      // Build tree
      this._tree = new Array(this._origSize).concat(nums);
      for (let i = this._origSize - 1; i > 0; i--) {
         this._tree[i] = this._builder(
            this._tree[i * 2],
            this._tree[i * 2 + 1]
         );
      }
   }

   /**
    * Queries the tree for a combined value over a range.
    *
    * @param start The starting index of the range (inclusive).
    * @param end The ending index of the range (inclusive).
    * @param resultInitialValue The initial value to
    * start combining with. (Defaults to `0`).
    *
    * @timeComplexity `O(log(n))`
    *
    * The choice of this value should depend on the builder function:
    * - When querying for sum, set this to `0`. (Default)
    * - When querying for maximum value, set this to `-Infinity`.
    * - When querying for minimum value, set this to `Infinity`.
    * - For other operations, use an appropriate initial value
    * that aligns with the builder function.
    * @returns The result of the query over the range.
    */
   query(start: number, end: number, resultInitialValue = 0): number {
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

   /**
    * Updates the value at a specific index.
    *
    * @param index The index of the value to update.
    * @param newValue The new value.
    *
    * @timeComplexity `O(log(n))`
    */
   update(index: number, newValue: number | ((num: number) => number)): void {
      index += this._origSize;
      this._tree[index] =
         typeof newValue === "function"
            ? newValue(this._tree[index])
            : newValue;

      // Propagate the change up the tree
      while (index > 1) {
         index >>>= 1; // Move to the parent node to edit the children
         this._tree[index] = this._builder(
            this._tree[index * 2],
            this._tree[index * 2 + 1]
         );
      }
   }
}

export type SegmentTreeBuilder = (a: number, b: number) => number;
const defaultBuilder: SegmentTreeBuilder = (a, b) => a + b;
