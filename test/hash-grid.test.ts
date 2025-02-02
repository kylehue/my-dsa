import { describe, it, expect, beforeEach } from "vitest";
import { HashGrid } from "../src";

const mockObject = (x, y, width, height) => ({ x, y, width, height });

describe("HashGrid", () => {
   let grid: HashGrid;

   beforeEach(() => {
      grid = new HashGrid({ cellWidth: 24, cellHeight: 24 });
   });

   it("should insert and retrieve objects correctly", () => {
      const obj1 = mockObject(10, 10, 30, 30);
      const obj2 = mockObject(60, 60, 20, 20);
      grid.insert(obj1);
      grid.insert(obj2);

      const retrieved1 = grid.retrieve(obj1);
      const retrieved2 = grid.retrieve(obj2);

      expect(retrieved1).toContain(obj1);
      expect(retrieved1.length).toBe(1);

      expect(retrieved2).toContain(obj2);
      expect(retrieved2.length).toBe(1);
   });

   it("should clear the grid", () => {
      const obj = mockObject(10, 10, 30, 30);
      grid.insert(obj);
      grid.clear();

      expect(grid.retrieve(obj)).toEqual([]);
   });

   it("should return multiple objects in overlapping cells", () => {
      const obj1 = mockObject(10, 10, 40, 40);
      const obj2 = mockObject(30, 30, 40, 40);
      grid.insert(obj1);
      grid.insert(obj2);

      const retrieved = grid.retrieve(obj1);
      expect(retrieved).toContain(obj1);
      expect(retrieved).toContain(obj2);
   });

   it("should update cell dimensions correctly", () => {
      grid.setCellWidth(32);
      grid.setCellHeight(32);

      expect(grid.config.cellWidth).toBe(32);
      expect(grid.config.cellHeight).toBe(32);
   });

   it("should correctly compute hash keys", () => {
      const key1 = grid["_getHashKey"](1, 2);
      const key2 = grid["_getHashKey"](2, 1);

      expect(key1).not.toBe(key2);
   });
});
