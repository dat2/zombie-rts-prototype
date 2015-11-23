import { Vector } from '../math';

export default function({ position = new Vector(0, 0), scale = new Vector(1, 1), rotation = 0 } = {}) {
  function Transform(entity) {
    entity.position = position;
    entity.scale = scale;
    entity.rotation = rotation;
  }

  Transform.type = 'transform';

  return Transform;
}
