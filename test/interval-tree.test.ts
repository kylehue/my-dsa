import { describe, beforeEach, it, expect } from "vitest";
import { IntervalTree } from "../src";

type IntervalObject = {
   name: string;
   interval: [number, number];
};

describe("IntervalTree", () => {
   let tree: IntervalTree<IntervalObject>;

   const sampleData: IntervalObject[] = [
      { name: "A", interval: [1, 5] },
      { name: "B", interval: [10, 15] },
      { name: "C", interval: [20, 25] },
      { name: "D", interval: [12, 18] },
      { name: "E", interval: [30, 35] },
      { name: "F", interval: [5, 10] },
   ];

   beforeEach(() => {
      tree = new IntervalTree<IntervalObject>((data) => data.interval);
      sampleData.forEach((data) => tree.insert(data));
   });

   it("should insert intervals correctly and maintain size", () => {
      expect(tree.size()).toBe(sampleData.length);
   });

   it("should query intervals that overlap with a range", () => {
      const result = tree.query(11, 13);
      const names = result.map((obj) => obj.name);
      expect(names).toContain("B");
      expect(names).toContain("D");
      expect(names).not.toContain("A");
   });

   it("should return an empty array if no intervals overlap", () => {
      const result = tree.query(50, 60);
      expect(result.length).toBe(0);
   });

   it("should detect if there is an overlap", () => {
      expect(tree.hasOverlap(11, 13)).toBe(true);
      expect(tree.hasOverlap(50, 60)).toBe(false);
   });

   it("should delete intervals correctly and maintain size", () => {
      tree.delete(sampleData[1]);
      expect(tree.size()).toBe(sampleData.length - 1);

      const result = tree.query(10, 15);
      const names = result.map((obj) => obj.name);
      expect(names).not.toContain("B");
   });

   it("should clear the tree correctly", () => {
      tree.clear();
      expect(tree.size()).toBe(0);
      expect(tree.isEmpty()).toBe(true);
      expect([...tree.values()].length).toBe(0);
   });

   it("should clone the tree correctly", () => {
      const clone = tree.clone();
      expect(clone.size()).toBe(tree.size());
      expect([...clone]).toEqual([...tree]);
   });

   it("should handle exclusive intervals", () => {
      const result = tree.query(5, 10);
      const names = result.map((obj) => obj.name);
      expect(names).not.toContain("B");
      expect(names).not.toContain("A");
      expect(names).toContain("F");
   });

   it("should handle inclusive intervals", () => {
      const result = tree.query(5, 10, true);
      const names = result.map((obj) => obj.name);
      expect(names).toContain("B");
      expect(names).toContain("A");
      expect(names).toContain("F");
   });

   it("should traverse and yield values correctly", () => {
      const values = [...tree.values()];
      expect(values.length).toBe(sampleData.length);
   });

   it("should build from array correctly", () => {
      const newTree = IntervalTree.fromArray(
         sampleData,
         (data) => data.interval
      );
      expect(newTree.size()).toBe(sampleData.length);
   });

   // fsaefes

   it("should handle wide range queries correctly", () => {
      const result = tree.query(0, 40);
      const names = result.map((obj) => obj.name);
      expect(names).toEqual(
         expect.arrayContaining(["A", "B", "C", "D", "E", "F"])
      );
   });

   it("should handle overlapping intervals on the same boundaries", () => {
      tree.insert({ name: "G", interval: [10, 15] });
      const result = tree.query(10, 15);
      const names = result.map((obj) => obj.name);
      expect(names).toContain("B");
      expect(names).toContain("G");
   });

   it("should correctly handle deletion of intervals and max upper bounds recalculation", () => {
      tree.delete(sampleData[3]);
      expect(tree.size()).toBe(sampleData.length - 1);

      const result = tree.query(12, 18);
      const names = result.map((obj) => obj.name);
      expect(names).not.toContain("D");
      expect(names).toContain("B");
   });

   it("should correctly handle overlapping intervals with multiple boundaries", () => {
      tree.insert({ name: "H", interval: [16, 22] });
      const result = tree.query(15, 23);
      const names = result.map((obj) => obj.name);
      expect(names).toContain("C");
      expect(names).toContain("D");
      expect(names).toContain("H");
      expect(names).not.toContain("B");
   });

   it("should throw range error when lower is greater than upper", () => {
      expect(() => {
         tree.insert({ name: "I", interval: [7, 3] });
      }).toThrow(RangeError);
      expect(() => {
         tree.hasOverlap(10, 2);
      }).toThrow(RangeError);
   });

   it("should handle intervals that entirely contain other intervals", () => {
      tree.insert({ name: "J", interval: [0, 40] });
      const result = tree.query(0, 40);
      const names = result.map((obj) => obj.name);
      expect(names).toContain("J");
      expect(names).toContain("A");
      expect(names).toContain("B");
      expect(names).toContain("C");
   });

   it("should handle single-point intervals", () => {
      tree.insert({ name: "K", interval: [5, 5] });
      const result = tree.query(4, 6);
      const names = result.map((obj) => obj.name);
      expect(names).toContain("K");
   });

   it("should handle large data set efficiently", () => {
      tree.clear();

      const largeData: IntervalObject[] = Array.from(
         { length: 1000 },
         (_, i) => ({
            name: `Item ${i}`,
            interval: [i * 10, i * 10 + 5],
         })
      );

      largeData.forEach((data) => tree.insert(data));

      const result = tree.query(0, 5000);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBe(500);
   });
});
