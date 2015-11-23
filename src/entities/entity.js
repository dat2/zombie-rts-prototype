export default function Entity(components = []) {
  const entity = {
    // the components here is a list of strings
    components: []
  };

  // TODO dependencies
  components.forEach(c => {
    c(entity);
    entity.components.push(c.type);
  });

  return entity;
}
