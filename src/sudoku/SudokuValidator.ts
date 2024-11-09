export type SudokuGrid = Array<Array<number>>;
export type GridInfo = Array<Array<CellInfo>>;

type Cell = {
  rowId: number;
  colId: number;
  value: number;
};

export type CellInfo = Cell & {
  // whether the cell is a duplicate number
  isDuplicate: boolean;

  // whether this cell is in an invalid row, col or block
  // isInInvalidRowColOrBlock: boolean;
};

export type DuplicateValues = {
  // the value that is duplicate
  value: number;
  // which cells are the duplicate ones
  cells: [Cell];
};

type SudokuError = {
  // the rowId in case errorType is row or blockb
  rowId: number | undefined;
  // the colId in case errorType is col or block
  colId: number | undefined;
  errorType: "row" | "col" | "block";

  // duplicate numbers
  duplicates: DuplicateValues[];
  // missing numbers
  missing: number[];
};

export class SudokuValidator {
  private grid: SudokuGrid;

  gridInfo: GridInfo;
  errors: SudokuError[] = [];

  constructor(grid: SudokuGrid) {
    this.grid = grid;
    this.gridInfo = this._composeGridInfo();
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
          value: this.grid[rowId][colId],
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
      for (let rowId = 0; rowId < 9; rowId++) {
        const cell = this.gridInfo[rowId][colId];
        colCells.push(cell);
      }
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
        const blockCells = [];
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            const cell = this.gridInfo[rowId + i][colId + j];
            blockCells.push(cell);
          }
        }
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

      // console.log("computing for", value);

      if (value === 0) {
        continue;
      }

      // remove the value from the missing numbers
      const index = error.missing.indexOf(value);
      if (index !== -1) {
        error.missing.splice(index, 1);
      }

      // check for duplicates

      const duplicates = cells.filter((cell) => cell.value === value);
      if (duplicates.length > 1) {
        duplicates.forEach((cell) => (cell.isDuplicate = true));

        // find if error.duplicates contains value
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
