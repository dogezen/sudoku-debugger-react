import { Box } from "@mantine/core";
import { CellInfo, SudokuValidator } from "./sudoku/SudokuValidator";
import {
  computeGridCellBackground,
  computeGridCellBorder,
} from "./sudokuGridCellStyleUtils";

type SudokuGridCellProps = {
  cell: CellInfo;
  validator: SudokuValidator;
};

const SudokuGridCell = ({ cell, validator }: SudokuGridCellProps) => {
  const cellHasError = cell.isDuplicate;
  const rowHasError = validator.rowHasError(cell.rowId);
  const colHasError = validator.colHasError(cell.colId);
  const blockHasError = rowHasError || colHasError;
  return (
    <Box
      style={{
        ...computeGridCellBorder(cell.rowId, cell.colId),
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
      bg={computeGridCellBackground(cellHasError, blockHasError)}
      c={cellHasError || blockHasError ? "dark.8" : "gray.6"}
      fw={cellHasError ? "bold" : "normal"}
    >
      {cell.value}
    </Box>
  );
};

export default SudokuGridCell;
