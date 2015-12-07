import PIXI from 'pixi.js';
import Rx from 'rx';
import { Vector, pointInRect, clamp } from '../math';

function makeSpeedzone(r, pct, speed) {
  const min = 1 - pct;
  const max = pct;

  const rect = new PIXI.Rectangle(
    min * r.width,
    min * r.height,
    max * r.width - min * r.width,
    max * r.height - min * r.height
  );

  return { rect, speed };
}

export default function ScreenMovementSystem(stage, element, window) {
  const screen = new PIXI.Rectangle(0, 0, element.width, element.height);

  // keep this sorted from largest to smallest
  const zones = [ makeSpeedzone(screen, 0.99, 12), makeSpeedzone(screen, 0.98, 8), makeSpeedzone(screen, 0.97, 6) ];

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

  return {
    components: ['screenmovement'],

    onAdd(engine, entity) {
      if(this.entities.length > 1) {
        throw Error('There should only be one entity for the movement system, the map');
      }
    },

    run(engine, entity) {
      const [ renderC ] = entity.getComponents('renderable');
      const val = delta.getValue();

      stage.position.x = clamp(stage.position.x - val.x, -renderC.renderable.width + window.width, 0);
      stage.position.y = clamp(stage.position.y - val.y, -renderC.renderable.height + window.height, 0);
    },

    onRemove(engine, entity) {

    }
  };
}
