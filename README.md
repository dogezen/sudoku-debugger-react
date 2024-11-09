# React Sudoku Debugger

Run

```bash
npm install
npm run dev
```

To change the display to a working grid, edit `App.tsx` and change the input grid at the start of the App component.

The debugger shows rows and columns that have errors and indicates which cells have duplicate values.

The debugger then displays a summary of all detected errors.

If more time available:
- add live edititng of numbers in the grid
- with live editing of numbers in the grid, then extract out as a separate hook (or just as useEffect + state in App.tsx) the logic to send the updated grid and re-validate it with new results; custom hook component preferable, to abstract out the business logic; `const {validator, originalGrid, updateGrid} = useSudokuValidator(initialGrid);`
- add buttons to switch between preset grids
- add full logic to colour in all the cells in incorrect blocks - currently not implemented
- in the error summary: correctly display the row or column numbers alongside the duplicate values
- add hover detection to interactively highlight the row and column of the cell being hovered over and emphasize the error description
- responsiveness
