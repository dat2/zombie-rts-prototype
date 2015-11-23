export default function({ maxSeeAhead = 32, maxAvoidForce = 1, maxAvoidSpeed = 5 } = {}) {
  function CollisionAvoidance(entity) {
    entity.maxSeeAhead = maxSeeAhead;
    entity.maxAvoidForce = maxAvoidForce;
    entity.maxAvoidSpeed = maxAvoidSpeed;
  }

  CollisionAvoidance.type = 'collisionAvoidance';

  return CollisionAvoidance;
}
