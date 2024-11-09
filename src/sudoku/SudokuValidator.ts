export type SudokuGrid = Array<Array<number>>;
export type GridInfo = Array<Array<CellInfo>>;

// represents a cell in the sudoku grid
type Cell = {
  rowId: number;
  colId: number;
  value: number;
};

// stores additional info about the cell in terms of detected errors
export type CellInfo = Cell & {
  // whether the cell is a duplicate number
  isDuplicate: boolean;
};

// stores information about which values are duplicate, and which cells are the ones that correspond to the duplication
export type DuplicateValues = {
  // the value that is duplicate
  value: number;
  // which cells are the duplicate ones
  cells: [Cell];
};

// represents the errors for a row, column or 3x3 block
type SudokuError = {
  // the rowId in case errorType is row or blockb
  rowId: number | undefined;
  // the colId in case errorType is col or block
  colId: number | undefined;
  // whether the error is for a row, column or 3x3 block
  errorType: "row" | "col" | "block";

  // duplicate numbers in that row, col or block
  duplicates: DuplicateValues[];
  // missing numbers in that row, col or block
  missing: number[];
};

export class SudokuValidator {
  private inputGrid: SudokuGrid;

  gridInfo: GridInfo;
  errors: SudokuError[] = [];

  constructor(grid: SudokuGrid) {
    this.inputGrid = grid;
    // converts input grid into CellInfo grid for ease of solving the error detection
    this.gridInfo = this._composeGridInfo();
    // validates the sudoku and identifies errors
    this.validate();
  }

  validate(): void {
    this._validateRows();
    this._validateCols();
    this._validateBlocks();
  }

  rowHasError(rowId: number): boolean {
    return this.errors.some((error) => error.rowId === rowId);
  }

  colHasError(colId: number): boolean {
    return this.errors.some((error) => error.colId === colId);
  }

  private _composeGridInfo(): GridInfo {
    const gridInfo: GridInfo = [];
    for (let rowId = 0; rowId < 9; rowId++) {
      const row = [];
      for (let colId = 0; colId < 9; colId++) {
        const cell = {
          rowId,
          colId,
          value: this.inputGrid[rowId][colId],
          isDuplicate: false,
          isInInvalidRowColOrBlock: false,
        };
        row.push(cell);
      }
      gridInfo.push(row);
    }
    return gridInfo;
  }

  private _validateRows(): void {
    for (let rowId = 0; rowId < 9; rowId++) {
      // get the values in the row, and check for duplicates and missing numbers
      const row = this.gridInfo[rowId];
      const rowError = this._validateBlock(rowId, undefined, "row", row);
      if (rowError) {
        this.errors.push(rowError);
      }
    }
  }

  private _validateCols(): void {
    for (let colId = 0; colId < 9; colId++) {
      const colCells = [];
      // get all column values first
      for (let rowId = 0; rowId < 9; rowId++) {
        const cell = this.gridInfo[rowId][colId];
        colCells.push(cell);
      }
      // validate for duplicates or missing cells in the column
      const colError = this._validateBlock(undefined, colId, "col", colCells);
      if (colError) {
        this.errors.push(colError);
      }
      break;
    }
  }

  private _validateBlocks(): void {
    for (let rowId = 0; rowId < 9; rowId += 3) {
      for (let colId = 0; colId < 9; colId += 3) {
        // obtain the 9 numbers in the 3x3 block
        const blockCells = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cell = this.gridInfo[rowId + i][colId + j];
            blockCells.push(cell);
          }
        }
        // determine if there are duplicates or missing numbers
        const blockError = this._validateBlock(
          rowId,
          colId,
          "block",
          blockCells,
        );
        if (blockError) {
          this.errors.push(blockError);
        }
      }
    }
  }

  private _validateBlock(
    rowId: number | undefined,
    colId: number | undefined,
    type: "row" | "col" | "block",
    cells: Array<CellInfo>,
  ): SudokuError | null {
    const error: SudokuError = {
      rowId,
      colId,
      errorType: type,
      duplicates: [],
      missing: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };

    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      const value = cell.value;

      if (value === 0) {
        continue;
      }

      // remove the value from the missing numbers
      const index = error.missing.indexOf(value);
      if (index !== -1) {
        // remove numbers that are not missing
        error.missing.splice(index, 1);
      }

      // check for duplicates
      const duplicates = cells.filter((cell) => cell.value === value);
      if (duplicates.length > 1) {
        // mark all cells that have duplicates as having duplicates
        duplicates.forEach((cell) => (cell.isDuplicate = true));

        // create duplicate data object
        const duplicateValue = error.duplicates.find((d) => d.value === value);
        if (duplicateValue) {
          duplicateValue.cells.push(cell);
        } else {
          error.duplicates.push({ value, cells: [cell] });
        }
      }
    }

    // no error if all valid
    if (error.missing.length === 0 && error.duplicates.length === 0) {
      return null;
    }

    // error if there are missing numbers or duplicates
    return error;
  }
}
