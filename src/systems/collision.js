import PIXI from 'pixi.js';

function circlesOverlapping(c, c2) {
  return c.position.subtract(c2.position).magnitude() < c.r + c2.r;
}

function makeCircle(delta, { velocity }, { r }, { position }) {
  return {
    r,
    position: position.add(velocity.scale(delta))
  };
}

export default function CollisionSystem(stage) {
  return {
    components: ['physics', 'collideShape', 'transform'],

    onAdd(engine, entity) {
      const [ collideShape ] = entity.getComponents('collideShape');

      collideShape.shapeGraphics = new PIXI.Graphics();

      const col = 0xFF0000;
      collideShape.shapeGraphics.beginFill(col, 0.3);
      collideShape.shapeGraphics.lineStyle(3, col, 0.8);
      collideShape.shapeGraphics.drawCircle(0, 0, collideShape.r);

      stage.addChild(collideShape.shapeGraphics);
    },

    run(engine, entity, delta) {
      const [ p1, cs1, t1 ] = entity.getComponents(...this.components);

      // render the collide shape
      cs1.shapeGraphics.position.copy(t1.position);
      cs1.shapeGraphics.scale.copy(t1.scale);
      cs1.shapeGraphics.rotation = t1.rotation;

      // make the circle
      const c1 = makeCircle(delta, p1, cs1, t1);

      // TODO broadphase
      const entities = this.entities
        .filter(e => e.id !== entity.id);

      // apply forces to both
      entities
        .forEach(e => {
          const [ p2, cs2, t2 ] = e.getComponents(...this.components);
          const c2 = makeCircle(delta, p2, cs2, t2);

          // simple impl of newton's second law
          if(circlesOverlapping(c1, c2)) {
            // p1.forces = [];
            // p1.addForce(p2.velocity.scale(p2.mass));

            // p2.forces = [];
            // p2.addForce(p1.velocity.scale(p1.mass));
          }
        });

      // generate a force, and add it to the physics array
    },

    onRemove(engine, entity) {
      const [ collideShape ] = entity.getComponents('collideShape');

      stage.removeChild(collideShape.shapeGraphics);
    }
  };
}
