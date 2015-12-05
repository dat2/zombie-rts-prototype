import { Vector } from '../math';

export default function({ position = new Vector(0, 0), scale = new Vector(1, 1), rotation = 0 } = {}) {
  function Transform(component) {
    component.position = position;
    component.scale = scale;
    component.rotation = rotation;
  }

  Transform.type = 'transform';

  return Transform;
}
