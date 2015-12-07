import difference from 'lodash.difference';
import Entity from '../entities/entity';
import uuid from 'uuid';

function isSubset(...args) {
  return difference(...args).length === 0;
}

export default function Engine({ systems = [] }) {
  const engine = {
    entities: [],
    systems,

    addEntity(...args) {
      const entity = Entity(this, ...args, uuid.v1());
      this.entities.push(entity);

      // call the onAdd function for each system
      this.systems
        .filter(s => isSubset(s.components, entity.components))
        .forEach(s => {
          s.onAdd(this, entity);
        });

      return entity;
    },
    addComponent(e, c) {

    },

    removeEntity(e) {
      // TODO
    },
    removeComponent(e, c) {
      // TODO
    },

    lastTime: Date.now(),
    currentTime: Date.now(),

    run() {
      this.currentTime = Date.now();

      this.systems.forEach(s => {
        if(s.beforeRun) {
          s.beforeRun(s.entities);
        }

        s.entities.forEach(e => {
          s.run(this, e, (this.currentTime - this.lastTime) / 1000);
        });
      });

      this.lastTime = this.currentTime;
    },

    query(...components) {
      return this.entities.filter(e => isSubset(components, e.components));
    }
  };

  // each system will have a 'entities' property
  // which is the filtered version of the entities
  engine.systems.forEach(s => {
    Object.defineProperty(s, 'entities', {
      get() {
        return engine.query(...this.components);
      },
      set(es) {
        // do nothing
      }
    });
  });

  return engine;
}
