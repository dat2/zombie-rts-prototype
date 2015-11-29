import PIXI from 'pixi.js';
import { colors } from '../color-generator';

function drawVector(graphics, color, v, scale = 2) {
  const col = color.rgbNumber();

  graphics.moveTo(0, 0);
  graphics.beginFill(col, 1.0);
  graphics.lineStyle(3, col, 1.0);

  const scaled = v.scale(scale);
  graphics.lineTo(scaled.x, scaled.y);
}

export default function PhysicsSystem(stage) {
  return {
    components: ['physics', 'transform'],

    onAdd(engine, entity) {
      const [ physics ] = entity.getComponents('physics');

      physics.forceGraphics = new PIXI.Graphics();
      stage.addChild(physics.forceGraphics);
    },

    // delta === s
    run(engine, entity, delta) {
      const [ physics, transform ] = entity.getComponents(...this.components);

      // render forces
      physics.forceGraphics.position.copy(transform.position);
      physics.forceGraphics.scale.copy(transform.scale);
      physics.forceGraphics.rotation = transform.rotation;

      // for each force
      physics.forceGraphics.clear();

      const cols = colors(physics.forces.length + 1);
      physics.forces.forEach((f, i) => {
        drawVector(physics.forceGraphics, cols[i], f);
      });
      drawVector(physics.forceGraphics, cols[cols.length - 1], physics.velocity);

      // do force calculation

      // add the forces to velocity
      // for each force, F = ma, a = F / m, v += a
      physics.velocity = physics.forces.reduce((v,f) => v.add(f.divide(physics.mass).scale(delta)), physics.velocity);
      physics.forces = [];

      // update position with velocity
      transform.position = transform.position.add(physics.velocity.scale(delta));
    },

    onRemove(engine, entity) {
      const [ physics ] = entity.getComponents('physics');

      stage.removeChild(physics.forceGraphics);
    }
  };
}
