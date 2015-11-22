import PIXI from 'pixi.js';
import { Vector } from './math';

const EPSILON = 0.001;

export class SeekArrivalBehaviour {
  constructor({ maxSpeed = 1, maxForce = 5, slowingRadius = 1, marker } = {}) {
    this.marker = new PIXI.Sprite(marker);
    this.marker.anchor.x = 0.5;
    this.marker.anchor.y = 0.5;

    this._target = new Vector(0, 0);
    this._seeking = false;

    this._maxSpeed = maxSpeed;
    this._maxForce = maxForce;
    this._slowingRadius = 64 * slowingRadius;
  }

  // arrival behaviour
  genForce(agent) {
    this.showMarker(agent);

    if(!this._seeking) {
      return new Vector(0, 0);
    }

    let desiredVelocity = this._target.subtract(agent.position);
    const distance = desiredVelocity.magnitude();

    // if within 1px
    if(distance < 2) {
      this._seeking = false;
      agent.velocity = new Vector(0, 0);
      return new Vector(0, 0);
    }

    if(distance < this._slowingRadius) {
      desiredVelocity = desiredVelocity.norm().scale(this._maxSpeed * (distance / this._slowingRadius));
    } else {
      desiredVelocity = desiredVelocity.norm().scale(this._maxSpeed);
    }

    return desiredVelocity.subtract(agent.velocity)
      .truncate(this._maxForce);
  }

  showMarker(agent) {
    this.marker.visible = this._target.subtract(agent.position).magnitude() > 15;
    this.marker.position.x = this._target.x;
    this.marker.position.y = this._target.y;
  }

  get target() {
    return this._target;
  }
  set target({ x, y }) {
    this._target = new Vector(x, y);
    this._seeking = true;
  }
}

export class CollisionAvoidanceBehaviour {
  constructor({ maxSeeAhead = 32, maxForce = 1, maxVelocity = 5} = {}) {
    this._maxSeeAhead = maxSeeAhead;
    this._maxForce = maxForce;
    this._maxVelocity = maxVelocity;
  }

  genForce(agent, game) {

    const aheadVector = agent.velocity.norm();
    const dynamicLength = agent.velocity.magnitude() / this._maxVelocity;

    const ahead1 = agent.position.add(aheadVector.scale(this._maxSeeAhead));
    const ahead2 = agent.position.add(aheadVector.scale(dynamicLength));

    const closest = game.collidables
      .filter(c => c !== agent)
      .reduce((closest, c) => {
        const centre = new Vector(c.position.x, c.position.y);
        const dist1 = centre.subtract(ahead1).magnitude();
        const dist2 = centre.subtract(ahead2).magnitude();
        const dist3 = centre.subtract(agent.position).magnitude();

        let goingToCollide = dist1 < c.r || dist2 < c.r || dist3 < c.r;
        let closerThanClosest = closest === null || (dist1 < closest.dist || dist2 < closest.dist || dist3 < closest.dist);

        if(goingToCollide && closerThanClosest) {
          return { dist: Math.min(dist1, dist2, dist3), c: c };
        } else {
          return closest;
        }
      }, null);

    if(closest !== null) {
      const { c } = closest;
      const force = new Vector(ahead1.x - c.position.x, ahead1.y - c.position.y)
        .truncate(this._maxForce);

      if(isNaN(force.x)) {
        debugger;
      }

      return force;
    }

    return new Vector(0, 0);
  }

}
