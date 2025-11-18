
export interface Vector {
  x: number;
  y: number;
}

export interface Boid {
  id: string;
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  maxSpeed: number;
  maxForce: number;
  size: number;
  angle: number;
  wanderAngle: number;
}

export interface Wasp extends Boid {}

export interface Bee extends Boid {
  targetWaspId: string | null;
}
