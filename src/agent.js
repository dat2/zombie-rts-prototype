import { Vector } from './math';

export class Agent {
  constructor({ behaviours = [] } = {}) {
    this.behaviours = behaviours;
  }

  update(game) {
    const forces = this.behaviours.reduce(
      (acc,b) => acc.add(b.genForce(this, game).divide(this.mass)),
      new Vector(0,0)
    );
  }
}
