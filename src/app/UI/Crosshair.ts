class Crosshair {

  static htmlElement: HTMLElement;

  static readonly defaultClassName: string = 'crosshair';

  static readonly validClassName: string = 'valid';
  static readonly invalidClassName: string = 'invalid';

  constructor() {
    this.generate();
  }

  static switch(predicat: boolean) {
    Crosshair.htmlElement.className = predicat
      ? `${Crosshair.defaultClassName} ${Crosshair.validClassName}`
      : `${Crosshair.defaultClassName} ${Crosshair.invalidClassName}`;
  }

  static shake() {
    Crosshair.switch(false);
    Crosshair.htmlElement.classList.add('shake');
    setTimeout(() => Crosshair.htmlElement.classList.remove('shake'), 1000);
  }

  private generate() {
    Crosshair.htmlElement = document.createElement('div');
    Crosshair.htmlElement.classList.add(Crosshair.defaultClassName);

    for (let i = 0; i < 4; i++) {
      Crosshair.htmlElement.appendChild(document.createElement('span'));
    }

    document.body.appendChild(Crosshair.htmlElement);
  }

}

export default Crosshair;
