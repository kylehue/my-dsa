import { describe, it, expect, beforeEach } from "vitest";
import { SegmentTree, SegmentTreeBuilder } from "../src/segment-tree";

describe("SegmentTree", () => {
   let nums: number[];
   let segTree: SegmentTree;
   let minBuilder: SegmentTreeBuilder = (a, b) => Math.min(a, b);
   let maxBuilder: SegmentTreeBuilder = (a, b) => Math.max(a, b);

   beforeEach(() => {
      nums = [1, 2, 3, 4, 5];
      segTree = new SegmentTree(nums);
   });

   it("should build the tree correctly for sum", () => {
      let result = segTree.query(0, 4);
      expect(result).toBe(15);
   });

   it("should return correct range sum for a sub-range", () => {
      let result = segTree.query(1, 3);
      expect(result).toBe(9);
   });

   it("should return correct value for a single element", () => {
      let result = segTree.query(2, 2);
      expect(result).toBe(3);
   });

   it("should update the tree correctly", () => {
      segTree.update(2, 10);

      let result = segTree.query(0, 4);
      expect(result).toBe(22);
   });

   it("should propagate updates correctly in sub-ranges", () => {
      segTree.update(3, 7);

      let result = segTree.query(2, 4);
      expect(result).toBe(15);
   });

   it("should support custom min function", () => {
      let minSegTree = new SegmentTree(nums, minBuilder);

      expect(minSegTree.query(1, 3, Infinity)).toBe(2);
   });

   it("should support custom max function", () => {
      let maxSegTree = new SegmentTree(nums, maxBuilder);

      expect(maxSegTree.query(0, 4, -Infinity)).toBe(5);
   });

   it("should correctly update for custom min tree", () => {
      let minSegTree = new SegmentTree(nums, minBuilder);
      expect(minSegTree.query(0, 4, Infinity)).toBe(1);

      minSegTree.update(2, 0);
      expect(minSegTree.query(0, 4, Infinity)).toBe(0);
   });

   it("should correctly update for custom max tree", () => {
      let maxSegTree = new SegmentTree(nums, maxBuilder);
      expect(maxSegTree.query(0, 4, -Infinity)).toBe(5);

      maxSegTree.update(2, 100);
      expect(maxSegTree.query(0, 4, -Infinity)).toBe(100);
   });
});
