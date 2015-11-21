import PIXI from 'pixi.js';
import { handleSelection, handleRightclick, handleMouseMovement } from './input.js';

export default function makeStage(game, element) {
  // make a new stage
  const stage = new PIXI.Container();
  stage.interactive = true;

  // input
  handleSelection(stage, game);
  handleRightclick(stage, game);
  handleMouseMovement(stage, game, element);

  return stage;
}
