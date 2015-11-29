export default function({ maxSeeAhead = 32, maxForce = 1, maxSpeed = 5 } = {}) {
  function CollisionAvoidBehaviour(entity) {
    entity.maxSeeAhead = maxSeeAhead;
    entity.maxForce = maxForce;
    entity.maxSpeed = maxSpeed;
  }

  CollisionAvoidBehaviour.type = 'collisionAvoidBehaviour';

  return CollisionAvoidBehaviour;
}
