export type SudokuGridBorderStyles = {
  borderLeft: string;
  borderTop: string;
  borderRight: string;
  borderBottom: string;
};

export const computeBorder = (
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
