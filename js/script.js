// creating matrix
const matrix = getMartix(10, 10)

// cell with mines
for (let i = 0; i < 10; i++) {
  setRandomMine(matrix)
}

const gameElement = matrixToHtml(matrix)
const appElement = document.querySelector('#app')
appElement.append(gameElement);