import PIXI from 'pixi.js';
import Rx from 'rx';

import { pointsToRect, Vector, intersectsRect, pointInRect, clamp } from './math';

function move(point, stage) {
  return new Vector(point.x, point.y).add(new Vector(stage.position.x, -stage.position.y));
}

export function handleSelection(stage, game) {
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

  // make a new selection rect
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
        game.agents
          .filter(a => a.isUnit)
          .forEach(unit => {
            const rect = new PIXI.Rectangle(x, y, width, height);
            unit.selected = intersectsRect(rect, unit.sprite);
          });

        if(end) {
          stage.removeChild(selectionRect);
        }
      }
    );
}

export function handleRightclick(stage, game) {
  const rightClick = Rx.Observable.fromEvent(stage, 'rightclick')
    .map(e => ({ point: e.data.global }));

  rightClick.subscribe(({ point }) => {

    point.x -= stage.position.x;
    point.y -= stage.position.y;

    game.agents
      .filter(unit => unit.selected)
      .forEach(unit => {
        // seek behaviour :)
        unit.behaviours[0].target = point;
      });
  });
}

function makeSpeedzone(r, pct, speed) {
  const min = 1 - pct;
  const max = pct;

  const rect = new PIXI.Rectangle(min * r.width, min * r.height, max * r.width - min * r.width, max * r.height - min * r.height);

  return { rect, speed };
}

export function handleMouseMovement(stage, game, element) {
  const screen = new PIXI.Rectangle(0, 0, element.width, element.height);

  // keep this sorted from largest to smallest
  const zones = [ makeSpeedzone(screen, 0.95, 12), makeSpeedzone(screen, 0.9, 8), makeSpeedzone(screen, 0.8, 6) ];

  // the movement zones direction vectors
  // t: top
  // b: bottom
  // l: left
  // r: right
  // d: diagonal
  // h: horizontal
  // v: vertical
  const zoneDirection = {
    hl: new Vector(-1,0),
    hr: new Vector(1,0),

    vb: new Vector(0,1),
    vt: new Vector(0,-1),

    dtl: new Vector(-1,-1),
    dtr: new Vector(1,-1),
    dbl: new Vector(-1,1),
    dbr: new Vector(1,1)
  };

  // zone lines
  const verticalZone = {
    left: 0.25,
    right: 0.75
  };
  const horizontalZone = {
    top: 0.25,
    bottom: 0.75
  };

  let delta = new Rx.BehaviorSubject(Vector.origin());
  const mv = new Vector(element.width * 0.5, element.height * 0.5);
  stage.on('mousemove', e => {
    const point = e.data.global;
    const pv = new Vector(point.x, point.y);

    // first, if we are in the smallest zone, it means we aren't
    // going to move
    if(!pointInRect(pv, screen) || pointInRect(pv, zones[zones.length - 1].rect)) {
      delta.onNext(Vector.origin());
      return;
    }

    // check which speed zone we are in
    let i = 0;
    for(; i < zones.length; i++) {
      if(!pointInRect(pv, zones[i].rect)) {
        break;
      }
    }
    const zone = zones[i];

    const vl = zone.rect.x + verticalZone.left * zone.rect.width;
    const vr = zone.rect.x + verticalZone.right * zone.rect.width;

    const ht = zone.rect.y + horizontalZone.top * zone.rect.height;
    const hb = zone.rect.y + horizontalZone.bottom * zone.rect.height;

    const isTop = (pv.y <= ht);
    const isBottom = (pv.y >= hb);

    let dir = Vector.origin();

    // zone checking
    if(pv.x <= vr) {
      if(pv.x >= vl) {
        // we are in the vertical zone
        dir = isTop ? zoneDirection.vt : (isBottom ? zoneDirection.vb : dir);
      } else {
        // we are inside the left diagonal zone or bottom diagonal zone or horizontal zone
        dir = isTop ? zoneDirection.dtl : (isBottom ? zoneDirection.dbl : zoneDirection.hl);
      }
    } else {
      // we are inside the top right diagonal zone
      dir = isTop ? zoneDirection.dtr : (isBottom ? zoneDirection.dbr : zoneDirection.hr);
    }
    delta.onNext(dir.scale(zone.speed));
  });

  // 60fps update the stage position
  Rx.Observable.interval(1000/60)
    .map(() => delta)
    .subscribe(v => {
      const val = v.getValue();
      if(game.map) {
        stage.position.x = clamp(stage.position.x - val.x, -game.map.width + game.window.width, 0);
        stage.position.y = clamp(stage.position.y - val.y, -game.map.height + game.window.height, 0);
      }
    });
}
