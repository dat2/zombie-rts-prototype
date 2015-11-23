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
  // bleh
  let entities = [];

  /**
   * Handle the mouse drag
   */
  const drag = makeDragstream(stage);
  const selectionRect = new PIXI.Graphics();

  drag
    .subscribe(
      ({ rect: { x, y, width, height }, start, end }) => {
        if(start) {
          stage.addChild(selectionRect);
        }

        // draw the rect
        selectionRect.clear();
        selectionRect.beginFill(0x00FF00, 0.3);
        selectionRect.lineStyle(3, 0x00FF00, 0.8);
        selectionRect.drawRect(x, y, width, height);

        // check if any unit is inside the rect
        entities
          .forEach(entity => {
            const rect = new PIXI.Rectangle(x, y, width, height);
            entity.selected = intersectsRect(rect, entity.renderable);
          });

        if(end) {
          stage.removeChild(selectionRect);
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

    entities
      .filter(unit => unit.selected)
      .forEach(entity => {
        // seek behaviour :)
        // entity.behaviours[0].target = point;
      });
  });

  /**
   * finally the system doesn't need to do much
   */
  return {
    components: ['select', 'transform'],

    onAdd(engine, entity) {
      entities = this.entities;
    },

    run(engine, entity) {
      // ??
    },

    onRemove(engine, entity) {
      entities = this.entities;
    }
  };
}
