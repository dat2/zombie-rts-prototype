export default function({ type = 'circle', width = 1, height = 1, r = 1 } = {}) {
  function CollideShape(entity) {
    entity.shapeType = type;
    entity.r = r;

    // TODO do other types than just circle
  }

  CollideShape.type = 'collideShape';

  return CollideShape;
}
