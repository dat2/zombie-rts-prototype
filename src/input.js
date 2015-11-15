import Rx from 'rx';

function area(p1, p2) {
  return { width: p2.x - p1.x, height: p2.y - p1.y };
}

export function handleSelection(stage, game) {
  const mouseDown = Rx.Observable.fromEvent(stage, 'mousedown')
    .map(({ data: { global }}) => ({ point: global, start: true, end: false }));

  const mouseMove = Rx.Observable.fromEvent(stage, 'mousemove')
    .map(({ data: { global }}) => ({ point: global, start: false, end: false }));

  const mouseUp = Rx.Observable.fromEvent(stage, 'mouseup')
    .map(({ data: { global }}) => ({ point: global, start: false, end: true }));

  const drag = mouseDown
    .selectMany((md) => mouseMove.startWith(md).takeUntil(mouseUp).merge(mouseUp));

  let startPoint = new PIXI.Point(0,0);

  // make a new selection rect
  const selectionRect = new PIXI.Graphics();

  drag
    .subscribe(
      ({ point, start, end }) => {
        if(start) {
          startPoint.copy(point);

          stage.addChild(selectionRect);
        }

        // draw the rect
        selectionRect.clear();
        selectionRect.beginFill(0x00FF00, 0.3);
        selectionRect.lineStyle(3, 0x00FF00, 0.8);
        const { width, height } = area(startPoint, point);
        selectionRect.drawRect(startPoint.x, startPoint.y, width, height);

        // check if any unit is inside the rect
        game.units.forEach(unit => {
          const point = unit.sprite.position;
          unit.selected.onNext(selectionRect.containsPoint(point));
        });

        if(end) {
          stage.removeChild(selectionRect);
        }
      }
    );
}

export function handleMove(stage, game, rightClickObservable) {
  const rightClick = Rx.Observable.fromEvent(stage, 'rightclick')
    .map(({ data: { global }}) => ({ point: global }));

  rightClick.subscribe(({ point }) => {
    game.units
      .filter(({ selected: { value }}) => value)
      .forEach(unit => {
        unit.sprite.position.copy(point);
        // unit.
      });
  });
}
