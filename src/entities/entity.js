export default function Entity(engine, components = [], id) {
  const entity = {
    // the components here is a list of strings
    components: [],

    getComponents(...cs) {
      return cs.map(c => this[Symbol.for(c)]);
    },

    // add and remove need to be linked to the engine
    engine,

    addComponent(c) {
    },
    removeComponent(c) {
    },
    hasComponent(c) {
      return this.components.includes(c);
    },

    id
  };

  // TODO dependencies
  components.forEach(c => {
    const componentSymbol = Symbol.for(c.type);
    entity[componentSymbol] = {};
    c(entity[componentSymbol]);

    entity.components.push(c.type);
  });

  return entity;
}
