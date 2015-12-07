import PIXI from 'pixi.js';

import { Vector } from '../math';

export default function CollisionAvoidance(collideSystem, stage, debug = true) {
  return {
    components: ['physics', 'collisionAvoidBehaviour', 'aabb', 'transform'],

    onAdd(engine, entity) {
    },

    run(engine, entity) {
      const [ physics, collisionAvoidBehaviour, aabb, transform ] = entity.getComponents(...this.components);

      let impulse = new Vector(0, 0);


      // const dynamicLength = physics.velocity.magnitude() / collisionAvoidBehaviour.maxSpeed;
      const aheadVector = physics.velocity.norm();

      const ahead1 = aheadVector.scale(collisionAvoidBehaviour.maxSeeAhead);
      const ahead1p = transform.position.add(ahead1);

      const movedAABB = aabb.move(ahead1);

      const entities = collideSystem.quadTree.retrieve(movedAABB);
      const id = entity.id;

      // apply forces to both
      const closest = entities
        .map(({ entity }) => entity)
        // ignore entits that are near us
        .filter(entity => entity.id != id)

        // only return the aabb's that we will crash into
        .filter(entity => {
          const [ aabb2 ] = entity.getComponents('aabb');
          return movedAABB.intersects(aabb2);
        })

        // return the one that is closest to us now :)
        .reduce((closest, entity) => {
          const [ t2 ] = entity.getComponents('transform');
          const t2d = t2.position.subtract(transform.position).magnitude();

          const { dist } = closest;
          if(t2d < dist) {
            return { dist: t2d, transform: t2 };
          } else {
            return closest;
          }
        }, { dist: Infinity, transform: null });

      if(closest.transform !== null) {
        console.log(closest.transform);
        impulse = ahead1p.subtract(closest.transform.position)
          .truncate(collisionAvoidBehaviour.maxForce);
      }

      physics.addImpulse(impulse);
    },

    onRemove(engine, entity) {
    }
  };
}
