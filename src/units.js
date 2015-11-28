import { Vector } from './math';

import Transform from './components/transform';
import Sprite from './components/sprite';
import Physics from './components/physics';
import Select from './components/select';
import SeekArrival from './components/seekArrival';
import CollisionAvoidance from './components/collisionAvoidance';

export function loadUnits(engine, characterTexture, map) {
  function makeUnit(engine, { position, mass, selected = false }) {
    const unitWidth = new Vector(32, 32);

    const unit = engine.addEntity([
      Transform({ position: position.add(unitWidth) }),
      Sprite({ texture: characterTexture, anchor: new Vector(0.5, 0.5) }),
      Physics({ mass, velocity: new Vector(0, 0) }),

      // Selection component
      Select(),

      // behaviour components with their defaults set
      SeekArrival(), CollisionAvoidance()
    ]);

    return unit;
  }

  makeUnit(engine, { position: map.mapToWorld({ x: 8, y: 5 }), mass: 5 });
  makeUnit(engine, { position: map.mapToWorld({ x: 4, y: 5 }), mass: 5 });

}
