import PIXI from 'pixi.js';
import QuadTree from '../quadtree';
import { Vector } from '../math';

export default function CollisionSystem(stage, debug = true) {
  const quadTree = new QuadTree({ bounds: stage });

  function makeRect(aabb) {
    return new PIXI.Rectangle(aabb.x, aabb.y, aabb.width, aabb.height);
  }

  return {
    components: ['physics', 'aabb'],

    quadTree,

    onAdd(engine, entity) {
      if(debug) {
        const [ aabb ] = entity.getComponents('aabb');

        aabb.shapeGraphics = new PIXI.Graphics();
        const col = 0xFF0000;
        aabb.shapeGraphics.beginFill(col, 0.3);
        aabb.shapeGraphics.lineStyle(3, col, 0.8);
        aabb.shapeGraphics.drawRect(-aabb.width / 2, -aabb.height / 2, aabb.width, aabb.height);

        stage.addChild(aabb.shapeGraphics);
      }
    },

    beforeRun(entities) {
      quadTree.clear();

      entities.forEach(entity => {
        const [ rect ] = entity.getComponents('aabb');
        quadTree.insert({ rect, entity });
      });
    },

    run(engine, entity, delta) {
      const [ p1, aabb1, t1 ] = entity.getComponents(...this.components, 'transform');

      aabb1.x = t1.position.x;
      aabb1.y = t1.position.y;

      if(debug) {
        // render the collide shape
        aabb1.shapeGraphics.position.copy(aabb1);
        aabb1.shapeGraphics.scale.copy(t1.scale);
        aabb1.shapeGraphics.rotation = t1.rotation;
      }

      // get all the entities near aabb1
      const entities = quadTree.retrieve(aabb1);
      const id = entity.id;

      // apply forces to both
      entities
        .filter(({ entity }) => entity.id != id)
        .forEach(({ entity }) => {
          const [ p2, aabb2 ] = entity.getComponents(...this.components);

          if(aabb1.intersects(aabb2)) {
            const n = aabb1.collisionNormal(aabb2);

            // calculate force
            const rv = p2.velocity.subtract(p1.velocity);
            const velAlongNormal = rv.dot(n);

            if(velAlongNormal > 0) {
              return;
            }

            // restitution factor
            const e = Math.min(p1.restitution, p2.restitution);

            // actual magnitude of the impulse
            let j = -(1 + e) * velAlongNormal;
            j /= (p1.inverseMass) + (p2.inverseMass);
            const impulse = n.scale(j);

            p1.addImpulse(impulse.scale(-1).scale(p1.inverseMass));
            p2.addImpulse(impulse.divide(p2.mass));
          }
        });

      // generate a force, and add it to the physics array
    },

    onRemove(engine, entity) {
      if(debug) {
        const [ aabb ] = entity.getComponents('aabb');

        stage.removeChild(aabb.shapeGraphics);
      }
    }
  };
}
