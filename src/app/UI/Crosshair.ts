class Crosshair {

  className: string = 'crosshair';

  constructor() {
    this.generate();
  }

  private generate() {
    const div = document.createElement('div');
    div.classList.add(this.className);

    for (let i = 0; i < 4; i++) {
      div.appendChild(document.createElement('span'));
    }

    document.body.appendChild(div);
  }

}

export default Crosshair;
