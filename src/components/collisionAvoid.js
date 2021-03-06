export default function({ maxSeeAhead = 32, maxForce = 40, maxSpeed = 5 } = {}) {
  function CollisionAvoidBehaviour(component) {
    component.maxSeeAhead = maxSeeAhead;
    component.maxForce = maxForce;
    component.maxSpeed = maxSpeed;
  }

  CollisionAvoidBehaviour.type = 'collisionAvoidBehaviour';

  return CollisionAvoidBehaviour;
}
