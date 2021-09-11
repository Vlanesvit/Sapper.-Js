let matrix = null;
let running = null;

let width = document.getElementById('width');
let height = document.getElementById('height');
let skills = document.getElementsByName('difficulty');

let columns = width.value;
let rows = height.value;
let mines = Math.round(width.value * height.value / 15);

width.onchange = function() {
    columns = width.value;
}

height.onchange = function() {
    rows = height.value;
}

for (let i = 0; i < skills.length; i++) {
    skills[i].onchange = minesNum;
}

function minesNum() {
    mines = Math.round(columns * rows / 10 * this.value);
}


init(columns, rows, mines);

  // кнопка рестарт
  document
      .querySelector('.restart')
      .addEventListener('click', () => init(columns, rows, mines));

// инициализация игры
function init (columns, rows, mines) {
    matrix = getMatrix(columns, rows);
    running = true;

    for (let i = 0; i < mines; i++) {
        setRandomMine(matrix);
    }

    update();
}

// обновление графической части
function update () {
    if (!running) {
        return;
    }

    const gameElement = matrixToHtml(matrix);

    const appElement = document.querySelector('#app');
    appElement.innerHTML = '';
    appElement.append(gameElement);

    appElement
        .querySelectorAll('img')
        .forEach(imgElement => {
            imgElement.addEventListener('mousedown', mousedownHandler);
            imgElement.addEventListener('mouseup', mouseupHandler);
            imgElement.addEventListener('mouseleave', mouseleaveHandler)
        });

    if (isLoose(matrix)) {
        alert('Вы проиграли :(')
        running = false;
    } else if (isWin(matrix)) {
        alert('Вы победили!')
        running = false;
    }
}

// прожатие кнопки
function mousedownHandler (event) {
    const {cell, left, right } = getInfo(event);

    if (left) {
        cell.left = true;
    }

    if (right) {
        cell.right = true;
    }

    if (cell.left && cell.right) {
        bothHandler(cell);
    }

    update();
}

// отжатие кнопки
function mouseupHandler (event) {
    const {left, right, cell } = getInfo(event);

    const both = cell.right && cell.left && (left || right);
    const leftMouse = !both && cell.left && left;
    const rightMouse = !both && cell.right && right;

    if (both) {
        forEach(matrix, x => x.potencial = false);
    }

    if (left) {
        cell.left = false;
    }

    if (right) {
        cell.right = false;
    }

    if (leftMouse) {
        leftHandler(cell)
    }

    else if (rightMouse) {
        rightHandler(cell)
    }

    update();
}

// потеря курсора
function mouseleaveHandler (event) {
    const info = getInfo(event);

        info.cell.left = false;
        info.cell.right = false;

    update();
}

// возврат клетки, прожатой кнопкой
function getInfo (event) {
    const element = event.target;
    const cellId = parseInt(element.getAttribute('data-cell-id'));

    return {
        left: event.which === 1,
        right: event.which === 3,
        cell: getCellById(matrix, cellId)
    }
}

// левая кнопка мыши
function leftHandler (cell) {
    if (cell.show || cell.flag) {
        return;
    }
    cell.show = true;

    openSpace(matrix, cell.x, cell.y);
}

// правая кнопка мыши
function rightHandler (cell) {
    if (!cell.show) {
         cell.flag = !cell.flag;
    }
}

// обе кнопки мыши
function bothHandler (cell) {
    if (!cell.show || !cell.number) {
        return;
    }

    const cells = getAroundCells(matrix, cell.x, cell.y);
    const flags = cells.filter(x => x.flag).length;

    if (flags === cell.number) {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => {
                cell.show = true
                openSpace(matrix, cell.x, cell.y)
            })
    }

    else {
        cells
            .filter(x => !x.flag && !x.show)
            .forEach(cell => cell.potencial = true)
    }
}