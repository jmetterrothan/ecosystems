class Crosshair {

  static htmlElement: HTMLElement;

  static readonly defaultClassName: string = 'crosshair';

  static readonly validClassName: string = 'valid';
  static readonly invalidClassName: string = 'invalid';

  constructor() {
    this.generate();
  }

  static show(bool: boolean) {
    Crosshair.htmlElement.style.visibility = bool ? 'visible' : 'hidden';
  }

  static switch(valid: boolean) {
    if (valid && Crosshair.htmlElement.classList.contains(Crosshair.invalidClassName)) {
      Crosshair.htmlElement.classList.remove(Crosshair.invalidClassName);
      Crosshair.htmlElement.classList.add(Crosshair.validClassName);
    }

    if (!valid && Crosshair.htmlElement.classList.contains(Crosshair.validClassName)) {
      Crosshair.htmlElement.classList.remove(Crosshair.validClassName);
      Crosshair.htmlElement.classList.add(Crosshair.invalidClassName);
    }

    if (Crosshair.htmlElement.classList.value === Crosshair.defaultClassName) {
      Crosshair.htmlElement.classList.add(Crosshair.invalidClassName);
    }
  }

  static shake() {
    // Crosshair.switch(false);
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
