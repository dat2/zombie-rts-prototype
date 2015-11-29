import { Vector } from '../math';

export default function CollisionAvoidance(collideSystem) {
  return {
    components: ['physics', 'collisionAvoidBehaviour', 'transform'],

    onAdd(engine, entity) {
      // add a new marker entity, based on the entity's target :)
    },

    run(engine, entity) {
      const [ physics, collisionAvoidBehaviour, transform ] = entity.getComponents(...this.components);

      let force = new Vector(0, 0);

      const aheadVector = physics.velocity.norm();
      const dynamicLength = physics.velocity.magnitude() / collisionAvoidBehaviour.maxVelocity;

      const ahead1 = transform.position.add(aheadVector.scale(collisionAvoidBehaviour.maxSeeAhead));
      const ahead2 = transform.position.add(aheadVector.scale(dynamicLength));

      // we need to get collide system up and running :)
      /*
      const closest = game.collidables
        .filter(c => c !== agent)
        .reduce((closest, c) => {
          const centre = new Vector(c.position.x, c.position.y);
          const dist1 = centre.subtract(ahead1).magnitude();
          const dist2 = centre.subtract(ahead2).magnitude();
          const dist3 = centre.subtract(transform.position).magnitude();

          let goingToCollide = dist1 < c.r || dist2 < c.r || dist3 < c.r;
          let closerThanClosest = closest === null || (dist1 < closest.dist || dist2 < closest.dist || dist3 < closest.dist);

          if(goingToCollide && closerThanClosest) {
            return { dist: Math.min(dist1, dist2, dist3), c: c };
          } else {
            return closest;
          }
        }, null);

      if(closest !== null) {
        const { c } = closest;
        const force = new Vector(ahead1.x - c.position.x, ahead1.y - c.position.y)
          .truncate(collisionAvoidBehaviour.maxForce);

        if(isNaN(force.x)) {
          debugger;
        }

        return force;
      }*/

      physics.addForce(force);
    },

    onRemove(engine, entity) {

    }
  };
}
