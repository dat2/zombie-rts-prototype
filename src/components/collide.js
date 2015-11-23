export default function({ width = 1, height = 1, r = 1 } = {}) {
  function Collide(entity) {
    entity.width = width;
    entity.height = height;
    entity.r = r;
  }

  Collide.type = 'collide';

  return Collide;
}
