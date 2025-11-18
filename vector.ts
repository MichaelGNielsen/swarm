
import type { Vector } from './types';

export const VectorOps = {
  create(x = 0, y = 0): Vector {
    return { x, y };
  },

  add(v1: Vector, v2: Vector): Vector {
    return { x: v1.x + v2.x, y: v1.y + v2.y };
  },

  sub(v1: Vector, v2: Vector): Vector {
    return { x: v1.x - v2.x, y: v1.y - v2.y };
  },

  mult(v: Vector, scalar: number): Vector {
    return { x: v.x * scalar, y: v.y * scalar };
  },

  div(v: Vector, scalar: number): Vector {
    return { x: v.x / scalar, y: v.y / scalar };
  },

  mag(v: Vector): number {
    return Math.sqrt(v.x * v.x + v.y * v.y);
  },

  normalize(v: Vector): Vector {
    const magnitude = VectorOps.mag(v);
    if (magnitude > 0) {
      return VectorOps.div(v, magnitude);
    }
    return VectorOps.create();
  },

  limit(v: Vector, max: number): Vector {
    const magSq = v.x * v.x + v.y * v.y;
    if (magSq > max * max) {
      const normalized = VectorOps.normalize(v);
      return VectorOps.mult(normalized, max);
    }
    return { ...v };
  },

  setMag(v: Vector, mag: number): Vector {
    const normalized = VectorOps.normalize(v);
    return VectorOps.mult(normalized, mag);
  },

  dist(v1: Vector, v2: Vector): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  },
  
  fromAngle(angle: number): Vector {
    return { x: Math.cos(angle), y: Math.sin(angle) };
  }
};
