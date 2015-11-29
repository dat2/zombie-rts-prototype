import { Vector } from './math';

import CollideShape from './components/collideShape';
import Transform from './components/transform';
import Sprite from './components/sprite';
import Physics from './components/physics';
import Select from './components/select';
import SeekBehaviour from './components/seekBehaviour';
import CollisionAvoid from './components/collisionAvoid';

export function loadUnits(engine, characterTexture, map) {
  function makeUnit(engine, { position, mass }) {
    const unitWidth = new Vector(32, 32);

    const unit = engine.addEntity([
      Transform({ position: position.add(unitWidth) }),
      Sprite({ texture: characterTexture, anchor: new Vector(0.5, 0.5) }),

      Physics({ mass, velocity: new Vector(0, 0) }),
      CollideShape({ type: 'circle', r: Math.max(characterTexture.width, characterTexture.height) }),

      // Selection component
      Select(),

      // behaviour components with their defaults set
      SeekBehaviour(), CollisionAvoid()
    ]);

    return unit;
  }

  makeUnit(engine, { position: map.mapToWorld({ x: 8, y: 5 }), mass: 5 });
  makeUnit(engine, { position: map.mapToWorld({ x: 4, y: 5 }), mass: 5 });

}
