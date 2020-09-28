// creating matrix
function getMartix(columns, rows) {
  const matrix = [];

  let idCounter = 1;

  for (let y = 0; y < rows; y++) {
    const row = [];

    for (let x = 0; x < columns; x++) {
      row.push({
        id: idCounter++,
        show: true,
        flag: false,
        mine: false,
        number: 0,
        x: x,
        y: y,
      });
    }

    matrix.push(row);
  }

  return matrix;
}

// returns free cell
function getRandomFreeCell(matrix) {
  const freeCells = [];

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const cell = matrix[y][x];

      if (!cell.mine) {
        freeCells.push(cell);
      }
    }
  }

  const index = Math.floor(Math.random() * freeCells.length);
  return freeCells[index];
}

// spawn mines
function setRandomMine(matrix) {
  const cell = getRandomFreeCell(matrix);
  cell.mine = true;

  // request for neighboring cells
  const cells = getAroundCells(matrix, cell.x, cell.y);
  for (const cell of cells) {
    cell.number++;
  }
}

// returns the cell value
function getCell(matrix, x, y) {
  if (!matrix[y] || !matrix[y][x]) {
    return false;
  }

  return matrix[y][x];
}

// around the cell
function getAroundCells(matrix, x, y) {
  const cells = [];

  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }

      const cell = getCell(matrix, x + dx, y + dy);

      if (cell) {
        cells.push(cell);
      }
    }
  }

  return cells;
}

// visible "sapper" in browser
function matrixToHtml(matrix) {
  const gameElement = document.createElement("div");
  gameElement.classList.add("sapper");

  for (let y = 0; y < matrix.length; y++) {
    const rowElement = document.createElement("div");
    rowElement.classList.add("row");

    for (let x = 0; x < matrix[y].length; x++) {
      const cell = matrix[y][x];
      const imgElement = document.createElement("img");
      imgElement.draggable = false;

      rowElement.append(imgElement);

      if (cell.flag) {
        imgElement.src = "./assets/svg/flag.svg";
        continue;
      }

      if (!cell.show) {
        imgElement.src = "./assets/svg/none.svg";
        continue;
      }

      if (cell.mine) {
        imgElement.src = "./assets/svg/bomb.svg";
        continue;
      }

      if (cell.number) {
        imgElement.src = "./assets/svg/" + cell.number + ".svg";
        continue;
      }

      imgElement.src = "./assets/svg/none.svg";
    }
    gameElement.append(rowElement);
  }

  return gameElement;
}
