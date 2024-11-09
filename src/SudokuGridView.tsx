import { SimpleGrid } from "@mantine/core";
import { SudokuValidator } from "./sudoku/SudokuValidator";
import SudokuGridCell from "./SudokuGridCell";

type SudokuGridProps = {
  validator: SudokuValidator;
};

const SudokuGridView = ({ validator }: SudokuGridProps) => {
  return (
    <SimpleGrid cols={9} m={20} spacing="none" w={450} h={450}>
      {validator.gridInfo.map((row, rowId) =>
        row.map((cell, colId) => (
          <SudokuGridCell
            key={`${rowId}-${colId}`}
            cell={cell}
            validator={validator}
          />
        )),
      )}
    </SimpleGrid>
  );
};

export default SudokuGridView;
