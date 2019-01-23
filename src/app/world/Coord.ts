class Coord {
  row: number;
  col: number;

  /**
   * Coord constructor
   * @param {number} row
   * @param {number} col
   */
  constructor(row: number = 0, col: number = 0) {
    this.row = row;
    this.col = col;
  }
}

export default Coord;
