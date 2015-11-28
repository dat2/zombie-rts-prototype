import PIXI from 'pixi.js';
import Rx from 'rx';

import { pointsToRect, intersectsRect } from '../math';

export function makeDragstream(stage) {
  const mouseDown = Rx.Observable.fromEvent(stage, 'mousedown')
    .map(e => ({ point: e.data.global, start: true, end: false }));

  const mouseMove = Rx.Observable.fromEvent(stage, 'mousemove')
    .map(e => ({ point: e.data.global, start: false, end: false }));

  const mouseUp = Rx.Observable.fromEvent(stage, 'mouseup')
    .map(e => ({ point: e.data.global, start: false, end: true }));

  let startPoint = new PIXI.Point(0,0);
  const drag = mouseDown
    .selectMany((md) => mouseMove.startWith(md).takeUntil(mouseUp).merge(mouseUp))
    .map(({ point, start, end }) => {
      point.x -= stage.position.x;
      point.y -= stage.position.y;
      if (start) {
        startPoint.copy(point);
      }
      let rect = start ? { x: startPoint.x, y: startPoint.y, width: 0, height: 0 } : pointsToRect(startPoint, point);

      return { rect, start, end };
    });

  return drag;
}


export default function SelectionInputSystem(stage) {
  let selectionRect = new PIXI.Rectangle(0, 0, 0, 0);

  /**
   * Handle the mouse drag
   */
  const drag = makeDragstream(stage);
  const rectGraphics = new PIXI.Graphics();

  drag
    .subscribe(
      ({ rect: { x, y, width, height }, start, end }) => {
        if(start) {
          stage.addChild(rectGraphics);
        }

        // draw the rect
        rectGraphics.clear();
        rectGraphics.beginFill(0x00FF00, 0.3);
        rectGraphics.lineStyle(3, 0x00FF00, 0.8);
        rectGraphics.drawRect(x, y, width, height);

        selectionRect = new PIXI.Rectangle(x, y, width, height);

        if(end) {
          stage.removeChild(rectGraphics);
        }
      }
    );

  /**
   * Handle the right clicks
   */
  const rightClick = Rx.Observable.fromEvent(stage, 'rightclick')
    .map(e => ({ point: e.data.global }));

  rightClick.subscribe(({ point }) => {
    point.x -= stage.position.x;
    point.y -= stage.position.y;

    // entities
      // .filter(unit => unit.selected)
      // .forEach(entity => {
        // seek behaviour :)
        // entity.behaviours[0].target = point;
      // });
  });

  /**
   * finally the system doesn't need to do much
   */
  return {
    components: ['select', 'renderable'],

    onAdd(engine, entity) {
    },

    run(engine, entity) {
      const [ select, renderC ] = entity.getComponents(...this.components);
      select.selected = intersectsRect(selectionRect, renderC.renderable);
    },

    onRemove(engine, entity) {
    }
  };
}
