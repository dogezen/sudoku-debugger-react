import { Flex, Text, List, ListItem } from "@mantine/core";
import { SudokuValidator } from "./sudoku/SudokuValidator";

const SudokuValidationErrors = ({
  validator,
}: {
  validator: SudokuValidator;
}) => {
  if (validator.errors.length === 0) return <h2>No Errors found</h2>;

  return (
    <>
      <h2>Errors</h2>
      <Flex direction="column">
        {validator.errors.map((error, index) => {
          const errorType = error.errorType;

          let id = "";
          if (errorType === "row") {
            id = `Row ${error.rowId + 1}`;
          } else if (errorType === "col") {
            id = `Col ${error.colId + 1}`;
          } else if (errorType === "block") {
            id = `Block ${error.rowId + 1}-${error.colId + 1}`;
          }

          const duplicates = error.duplicates.map((duplicate, index) => {
            return (
              <ListItem key={index}>
                <Text>Duplicate number {duplicate.value}</Text>
              </ListItem>
            );
          });

          return (
            <div key={index}>
              <Text fw="bold">{id}</Text>
              <List>
                <ListItem>
                  <Text> Missing Numbers: {error.missing.join(", ")} </Text>
                </ListItem>
                {duplicates}
              </List>
            </div>
          );
        })}
      </Flex>
    </>
  );
};

export default SudokuValidationErrors;
