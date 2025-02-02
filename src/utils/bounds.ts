export interface Bounds {
   x: number;
   y: number;
   width: number;
   height: number;
}

export interface BoundedObject {
   bounds: Bounds;
}

export function getObjectBounds<T>(object: T | Bounds | BoundedObject): Bounds {
   let obj = object as any;
   if (!obj) throw new Error("Object is not bounded.");
   if (
      typeof obj.bounds === "object" &&
      typeof obj.bounds.x === "number" &&
      typeof obj.bounds.y === "number" &&
      typeof obj.bounds.width === "number" &&
      typeof obj.bounds.height === "number"
   ) {
      return obj.bounds;
   } else if (
      typeof obj.x === "number" &&
      typeof obj.y === "number" &&
      typeof obj.width === "number" &&
      typeof obj.height === "number"
   ) {
      return obj;
   }

   throw new Error("Object is not bounded.");
}
