export default function({ maxSeeAhead = 32, maxForce = 1, maxSpeed = 5 } = {}) {
  function CollisionAvoidance(entity) {
    entity.maxSeeAhead = maxSeeAhead;
    entity.maxForce = maxForce;
    entity.maxSpeed = maxSpeed;
  }

  CollisionAvoidance.type = 'collisionAvoidance';

  return CollisionAvoidance;
}
