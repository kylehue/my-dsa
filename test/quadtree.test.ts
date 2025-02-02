import { describe, it, expect, beforeEach } from "vitest";
import { Quadtree } from "../src";

describe("Quadtree", () => {
   let quadtree: Quadtree<{
      x: number;
      y: number;
      width: number;
      height: number;
   }>;

   beforeEach(() => {
      const bounds = { x: 0, y: 0, width: 100, height: 100 };
      quadtree = new Quadtree(bounds);
   });

   it("should insert and retrieve objects within bounds", () => {
      const item = { x: 10, y: 10, width: 20, height: 20 };
      quadtree.insert(item);
      const retrievedObjects = quadtree.retrieve({
         x: 5,
         y: 5,
         width: 30,
         height: 30,
      });
      expect(retrievedObjects).toContain(item);
   });

   it("should not retrieve objects outside the specified bounds", () => {
      quadtree = new Quadtree(
         { x: 0, y: 0, width: 100, height: 100 },
         { maxObjects: 2 }
      );

      const item1 = { x: 10, y: 10, width: 5, height: 5 };
      const item2 = { x: 40, y: 40, width: 20, height: 20 };
      const item3 = { x: 60, y: 60, width: 5, height: 5 };
      quadtree.insert(item1);
      quadtree.insert(item2);
      quadtree.insert(item3);

      const bounds = { x: 0, y: 0, width: 5, height: 5 };
      const retrievedObjects = quadtree.retrieve(bounds);
      expect(retrievedObjects).toContain(item1);
      expect(retrievedObjects).toContain(item2);
      expect(retrievedObjects).not.toContain(item3);
   });

   it("should split quadtree when maxObjects is exceeded", () => {
      quadtree = new Quadtree(
         { x: 0, y: 0, width: 100, height: 100 },
         { maxObjects: 1 }
      );

      const item1 = { x: 10, y: 10, width: 20, height: 20 };
      const item2 = { x: 30, y: 30, width: 20, height: 20 };
      quadtree.insert(item1);
      quadtree.insert(item2);

      // @ts-ignore
      expect(quadtree.root()._nodes.length).toBe(4);
   });

   it("should retrieve objects from correct quadrant after split", () => {
      quadtree = new Quadtree(
         { x: 0, y: 0, width: 100, height: 100 },
         { maxObjects: 1 }
      );

      const item1 = { x: 10, y: 10, width: 20, height: 20 };
      const item2 = { x: 70, y: 70, width: 20, height: 20 };
      quadtree.insert(item1);
      quadtree.insert(item2);

      const retrievedObjects1 = quadtree.retrieve({
         x: 5,
         y: 5,
         width: 30,
         height: 30,
      });
      const retrievedObjects2 = quadtree.retrieve({
         x: 60,
         y: 60,
         width: 30,
         height: 30,
      });

      expect(retrievedObjects1).toContain(item1);
      expect(retrievedObjects1).not.toContain(item2);
      expect(retrievedObjects2).toContain(item2);
      expect(retrievedObjects2).not.toContain(item1);
   });

   it("should allow object with bounds property", () => {
      const quadtree = new Quadtree(
         { x: 0, y: 0, width: 100, height: 100 },
         { maxDepth: 1, maxObjects: 1 }
      );

      const item1 = { bounds: { x: 10, y: 10, width: 20, height: 20 } };
      const item2 = { bounds: { x: 70, y: 70, width: 20, height: 20 } };
      quadtree.insert(item1);
      quadtree.insert(item2);

      expect(
         quadtree.retrieve({
            x: 10,
            y: 10,
            width: 80,
            height: 80,
         }).length
      ).toBe(2);

      expect(
         quadtree.retrieve({
            bounds: {
               x: 10,
               y: 10,
               width: 80,
               height: 80,
            },
         }).length
      ).toBe(2);

      expect(() =>
         // @ts-expect-error
         quadtree.retrieve({
            x: 10,
            y: 10,
            width: 80,
         })
      ).toThrowError();

      expect(() =>
         quadtree.retrieve({
            // @ts-expect-error
            bounds: {
               x: 2,
            },
         })
      ).toThrowError();

      expect(() =>
         // @ts-expect-error
         quadtree.retrieve(null)
      ).toThrowError();
   });
});
