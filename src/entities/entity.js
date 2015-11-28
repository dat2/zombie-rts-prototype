export default function Entity(components = []) {
  const entity = {
    // the components here is a list of strings
    components: [],

    getComponents(...cs) {
      return cs.map(c => this[Symbol.for(c)]);
    }
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
