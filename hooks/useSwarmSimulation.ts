
import { useState, useEffect, useCallback } from 'react';
import type { Wasp, Bee, Vector, Boid } from '../types';
import { VectorOps } from '../vector';

const NUM_WASPS = 3;
const BEES_PER_WASP = 20;
const PADDING = 100;

const createBoid = <T extends Boid,>(
  width: number,
  height: number,
  size: number,
  maxSpeed: number,
  maxForce: number,
  extra: Omit<T, keyof Boid>
): T => {
  return {
    id: crypto.randomUUID(),
    position: VectorOps.create(Math.random() * width, Math.random() * height),
    velocity: VectorOps.fromAngle(Math.random() * Math.PI * 2),
    acceleration: VectorOps.create(),
    wanderAngle: Math.random() * Math.PI * 2,
    size,
    maxSpeed,
    maxForce,
    angle: 0,
    ...extra,
  } as T;
};


export const useSwarmSimulation = (width: number, height: number) => {
  const [wasps, setWasps] = useState<Wasp[]>([]);
  const [bees, setBees] = useState<Bee[]>([]);

  const initialize = useCallback(() => {
    if (width > 0 && height > 0) {
      const newWasps: Wasp[] = [];
      for (let i = 0; i < NUM_WASPS; i++) {
        // Wasps are now 2px and faster
        newWasps.push(createBoid(width, height, 2, 3.5, 0.05, {}));
      }
      setWasps(newWasps);

      const newBees: Bee[] = [];
      for (let i = 0; i < NUM_WASPS * BEES_PER_WASP; i++) {
        // Bees are now 2px and faster than wasps
        newBees.push(
          createBoid(width, height, 2, 4, 0.2, { targetWaspId: null })
        );
      }
      setBees(newBees);
    }
  }, [width, height]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (wasps.length === 0 || bees.length === 0 || !width || !height) return;

    let animationFrameId: number;

    const applyForce = (boid: Boid, force: Vector) => {
      boid.acceleration = VectorOps.add(boid.acceleration, force);
    };

    const update = (boid: Boid) => {
      boid.velocity = VectorOps.add(boid.velocity, boid.acceleration);
      boid.velocity = VectorOps.limit(boid.velocity, boid.maxSpeed);
      boid.position = VectorOps.add(boid.position, boid.velocity);
      boid.acceleration = VectorOps.create();
      boid.angle = Math.atan2(boid.velocity.y, boid.velocity.x) * (180 / Math.PI);
    };

    const boundaries = (boid: Boid) => {
      let desired: Vector | null = null;
      if (boid.position.x < PADDING) {
        desired = VectorOps.create(boid.maxSpeed, boid.velocity.y);
      } else if (boid.position.x > width - PADDING) {
        desired = VectorOps.create(-boid.maxSpeed, boid.velocity.y);
      }
      if (boid.position.y < PADDING) {
        desired = VectorOps.create(boid.velocity.x, boid.maxSpeed);
      } else if (boid.position.y > height - PADDING) {
        desired = VectorOps.create(boid.velocity.x, -boid.maxSpeed);
      }

      if (desired) {
        desired = VectorOps.normalize(desired);
        desired = VectorOps.mult(desired, boid.maxSpeed);
        const steer = VectorOps.sub(desired, boid.velocity);
        applyForce(boid, VectorOps.limit(steer, boid.maxForce * 2));
      }
    };

    const wander = (boid: Boid) => {
      const wanderRadius = 50;
      const wanderDistance = 100;
      const change = 0.3;
      boid.wanderAngle += Math.random() * change - change * 0.5;

      const circlePos = { ...boid.velocity };
      const normalizedCirclePos = VectorOps.normalize(circlePos);
      const scaledCirclePos = VectorOps.mult(normalizedCirclePos, wanderDistance);
      const circleOffset = VectorOps.add(boid.position, scaledCirclePos);

      const heading = VectorOps.fromAngle(boid.wanderAngle);
      const headingScaled = VectorOps.mult(heading, wanderRadius);
      const target = VectorOps.add(circleOffset, headingScaled);
      
      const seekForce = seek(boid, target);
      applyForce(boid, seekForce);
    };

    const seek = (boid: Boid, target: Vector) => {
      const desired = VectorOps.sub(target, boid.position);
      const d = VectorOps.mag(desired);
      const speed = boid.maxSpeed * (d < 100 ? (d / 100) : 1);
      const magSetted = VectorOps.setMag(desired, speed);
      const steer = VectorOps.sub(magSetted, boid.velocity);
      return VectorOps.limit(steer, boid.maxForce);
    };

    const separate = (bee: Bee, allBees: Bee[]) => {
      const desiredSeparation = bee.size * 2.5; // Increased separation slightly for pixels
      let sum = VectorOps.create();
      let count = 0;
      for (const other of allBees) {
        if (bee.id === other.id) continue;
        const d = VectorOps.dist(bee.position, other.position);
        if (d > 0 && d < desiredSeparation) {
          let diff = VectorOps.sub(bee.position, other.position);
          diff = VectorOps.normalize(diff);
          diff = VectorOps.div(diff, d);
          sum = VectorOps.add(sum, diff);
          count++;
        }
      }
      if (count > 0) {
        sum = VectorOps.div(sum, count);
        sum = VectorOps.normalize(sum);
        sum = VectorOps.mult(sum, bee.maxSpeed);
        const steer = VectorOps.sub(sum, bee.velocity);
        applyForce(bee, VectorOps.limit(steer, bee.maxForce));
      }
    };

    const animate = () => {
      const nextWasps = wasps.map(w => ({ ...w, position: {...w.position}, velocity: {...w.velocity}, acceleration: {...w.acceleration} }));
      const nextBees = bees.map(b => ({ ...b, position: {...b.position}, velocity: {...b.velocity}, acceleration: {...b.acceleration} }));

      nextWasps.forEach(wasp => {
        wander(wasp);
        boundaries(wasp);
        update(wasp);
      });

      nextBees.forEach(bee => {
        let closestWasp: Wasp | null = null;
        let minDistance = Infinity;
        for (const wasp of nextWasps) {
          const d = VectorOps.dist(bee.position, wasp.position);
          if (d < minDistance) {
            minDistance = d;
            closestWasp = wasp;
          }
        }

        if (closestWasp) {
          bee.targetWaspId = closestWasp.id;
          const seekForce = seek(bee, closestWasp.position);
          applyForce(bee, seekForce);
        }
        
        separate(bee, nextBees);
        boundaries(bee);
        update(bee);
      });

      setWasps(nextWasps);
      setBees(nextBees);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [wasps, bees, width, height]);

  return { wasps, bees };
};
