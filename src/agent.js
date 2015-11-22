import { Vector } from './math';
import { DisplayAgent } from './display';

export class Agent extends DisplayAgent {
  constructor({ behaviours = [], ...rest } = {}) {
    super({ ...rest });
    this.behaviours = behaviours;
  }

  update(game) {
    const forces = this.behaviours.reduce(
      (acc,b) => acc.add(b.genForce(this, game).divide(this.mass)),
      new Vector(0,0)
    );
    this.velocity = this.velocity.add(forces);

    this.position = this.position.add(this.velocity);
  }
}
