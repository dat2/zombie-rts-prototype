import { Vector } from './math';

export default class Agent {
  constructor({ behaviours }) {
    this.behaviours = behaviours;
  }

  update() {
    const forces = this.behaviours.reduce(
      (acc,b) => acc.add(b.genForce(this).divide(this.mass)),
      new Vector(0,0)
    );
    this.velocity = this.velocity.add(forces);

    this.position = this.position.add(this.velocity);
  }
}
