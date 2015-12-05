export default function({ type = 'circle', r = 1 } = {}) {
  function CollideShape(component) {
    component.shapeType = type;
    component.r = r;

    // TODO do other types than just circle
  }

  CollideShape.type = 'collideShape';

  return CollideShape;
}
