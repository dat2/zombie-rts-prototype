import PIXI from 'pixi.js';
import { handleSelection, handleRightclick, handleMouseMovement } from './input.js';

export default function makeStage(game, element) {
  // make a new stage
  const stage = new PIXI.Container();
  stage.interactive = true;
  game.stage = stage;

  // input
  handleSelection(game);
  handleRightclick(game);
  handleMouseMovement(game, element);


  return stage;
}
