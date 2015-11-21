import PIXI from 'pixi.js';
import { Vector } from './math';
// import { worldToMap } from './map';

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
    if(distance < 1) {
      this._seeking = false;
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
