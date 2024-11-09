export type SudokuGridBorderStyles = {
  borderLeft: string;
  borderTop: string;
  borderRight: string;
  borderBottom: string;
};

export const computeGridCellBorder = (
  rowIndex: number,
  colIndex: number,
): SudokuGridBorderStyles => {
  // top left corner
  let leftBorderWidth = "1px";
  let bottomBorderWidth = "1px";

  // make width 3 px for every 3rd cell
  if (colIndex % 3 === 0) {
    leftBorderWidth = "3px";
  }

  // make height 3 px for every 3rd row
  if ((rowIndex + 1) % 3 === 0) {
    bottomBorderWidth = "3px";
  }

  return {
    borderLeft: `${leftBorderWidth} solid white`,
    borderTop: rowIndex === 0 ? "3px solid white" : "",
    borderRight: colIndex === 8 ? "3px solid white" : "",
    borderBottom: `${bottomBorderWidth} solid white`,
  };
};

export const computeGridCellBackground = (
  cellHasError: boolean,
  blockHasError: boolean,
) => {
  if (cellHasError) {
    return "pink.7";
  } else if (blockHasError) {
    return "orange.5";
  } else {
    return "dark.6";
  }
};
