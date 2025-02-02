import { BoundedObject, Bounds, getObjectBounds } from "./utils/bounds";

export interface HashGridConfig {
   /**
    * The width of a grid cell.
    * @default 48
    */
   cellWidth: number;
   /**
    * The height of a grid cell.
    * @default 48
    */
   cellHeight: number;
}

function getDefaultHashGridConfig() {
   const defaultHashGridConfig: HashGridConfig = {
      cellWidth: 48,
      cellHeight: 48,
   };
   return defaultHashGridConfig;
}

/**
 * A spatial grid that uses a hash grid.
 * This class divides the space into grid cells and stores objects in
 * those cells.
 *
 * Important Note:
 * It uses bitwise operations to convert X and Y coordinates into column
 * and row. This means that there's a maximum of 2^16 columns and 2^16 rows.
 * So if the cell width and height are 48, the maximum width and height of
 * the space is 48 * 2^16 = 3145728 which is probably enough for most cases.
 */
export class HashGrid<T = Bounds | BoundedObject> {
   private readonly _config: HashGridConfig;
   private _cells: Map<number, T[]> = new Map();
   // Used to convert X coords into column index
   private _cellWidthShift = 0;
   // Used to convert Y coords into row index
   private _cellHeightShift = 0;

   constructor(config: Partial<HashGridConfig> = {}) {
      this._config = Object.assign(getDefaultHashGridConfig(), config);
      this.setCellWidth(this._config.cellWidth);
      this.setCellHeight(this._config.cellHeight);
   }

   /**
    * Clears the hash grid.
    *
    * @timeComplexity `O(1)`
    */
   clear(): void {
      this._cells.clear();
   }

   /**
    * Inserts an item into the hash grid.
    *
    * @param item The item to insert.
    *
    * @timeComplexity `O(k)`, where `k` is the number of grid
    * cells the item overlaps.
    */
   insert(item: T): void {
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
            this._cells.get(key)!.push(item);
         }
      }
   }

   /**
    * Retrieves all objects that are stored in grid cells overlapping
    * the given bounds.
    *
    * @param location The bounding box or object location to retrieve the
    * other objects from.
    *
    * @returns An array of objects that might intersect with the given location.
    *
    * @timeComplexity `O(k)`, where `k` is the number of overlapping grid cells.
    */
   retrieve(location: T | Bounds | BoundedObject): T[] {
      const result = new Set<T>();
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

   /**
    * Sets the width of each grid cell.
    *
    * @param cellWidth The new cell width.
    *
    * @timeComplexity `O(1)`
    */
   setCellWidth(cellWidth: number): void {
      this._config.cellWidth = cellWidth;
      this._cellWidthShift = Math.floor(Math.log2(cellWidth));
   }

   /**
    * Sets the height of each grid cell.
    *
    * @param cellHeight The new cell height.
    *
    * @timeComplexity `O(1)`
    */
   setCellHeight(cellHeight: number): void {
      this._config.cellHeight = cellHeight;
      this._cellHeightShift = Math.floor(Math.log2(cellHeight));
   }

   /**
    * Get the hash key of X and Y coordinates. This assumes that
    * X and Y have been converted into column and row indices respectively.
    *
    * @param x The column index.
    * @param y The row index.
    *
    * @returns {number} A number that represents the hash key.
    */
   private _getHashKey(x: number, y: number) {
      // Total of 32 bits
      // Let X take the left 16 bits and Y take the right 16 bits
      return (x << 16) | y;
   }

   /**
    * Convert Y coordinate into row index.
    *
    * @param y The Y coordinate to convert into row index.
    *
    * @returns {number} The row index of the Y coordinate.
    */
   private _getRowIndex(y: number) {
      return y >> this._cellHeightShift;
   }

   /**
    * Convert X coordinate into column index.
    *
    * @param x The X coordinate to convert into column index.
    *
    * @returns {number} The column index of the X coordinate.
    */
   private _getColumnIndex(x: number) {
      return x >> this._cellWidthShift;
   }

   get config(): HashGridConfig {
      return this._config;
   }
}
