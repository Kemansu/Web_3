const table_with_results = document.getElementById('table_for_results');
const form = document.getElementById('form');
const error_div = document.getElementById('error_div');
const checkboxes = document.querySelectorAll('input[type="checkbox"][name="' + "R_field" + '"]');

let currentIdR;
let r_values = [];


// Переменные для пагинации
let currentPage = 1;
const resultsPerPage = 10;  // Количество результатов на странице

const canvas = document.getElementById('plot');
const ctx = canvas.getContext('2d');

// Координаты центра (0, 0) будут в центре холста
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
let R_canvas = 100; // Радиус области, масштабируется под размер холста

// Функция для отрисовки осей
function drawAxes() {
    // Ось X
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(canvas.width, centerY);
    ctx.stroke();

    // Ось Y
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, canvas.height);
    ctx.stroke();
}

// Функция для отрисовки области
function drawArea(r) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаем холст
    drawAxes(); // Рисуем оси

    // Прямоугольник
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
    ctx.fillRect(centerX, centerY, r/2, r);

    // Четверть круга
    ctx.beginPath();
    ctx.arc(centerX, centerY, r / 2, -Math.PI, -Math.PI/2);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();

    // Треугольник
    ctx.beginPath();
    ctx.moveTo(centerX - r, centerY);
    ctx.lineTo(centerX, centerY + r);
    ctx.lineTo(centerX, centerY);
    ctx.closePath();
    ctx.fill();
}

// вызов функции отрисовки области
drawArea(R_canvas);

// отрисовка точек
Dots.forEach((item) => {
    drawPoint(item.split(";")[0], item.split(";")[1], item.split(";")[2]);
})

function drawPoint(x, y, status) {
    const canvas = document.getElementById('plot');
    const ctx = canvas.getContext('2d');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Преобразуем координаты в пиксели
    const scaleFactor = 20; // Например, 20 пикселей на единицу координатной плоскости
    const canvasX = centerX + x * scaleFactor;
    const canvasY = centerY - y * scaleFactor; // Y инвертирован для корректной работы

    // Рисуем точку
    ctx.beginPath();
    ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI); // Радиус точки — 5 пикселей
    if (status === "false") {
        ctx.fillStyle = "red";
    } else {
        ctx.fillStyle = "green";
    }
    ctx.fill();
}


// Обработчик клика на canvas
canvas.addEventListener('click', function(event) {
    let IsCheckBoxPressd = false;

    checkboxes.forEach((item) => {
        if (item.checked === true) IsCheckBoxPressd = true;
    });
    if (!IsCheckBoxPressd) {
        showError("Радиус не установлен!", 5000); // Сообщение, если радиус не установлен
        return;
    }

    // Получаем координаты клика относительно canvas
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Преобразуем координаты в систему координат, где центр холста — это (0, 0)
    const plotX = (x - canvas.width / 2) / 20;  // 20 — масштаб
    const plotY = -(y - canvas.height / 2) / 20; // Y инвертирован
    const R = r_values[r_values.length - 1];


        drawPoint(plotX, plotY)
        // Создаем объект с данными для отправки
        const data = {
            x: plotX,
            y: plotY,
            R: R,
        };

        // Отправляем данные методом POST
        fetch('http://localhost:8080/WebLab3-1.0-SNAPSHOT/ControllerServlet', {
            method: 'POST',  // Указываем метод POST
            headers: {
                'Content-Type': 'application/json'  // Указываем, что передаем данные в формате JSON
            },
            body: JSON.stringify(data)  // Преобразуем объект в строку JSON для отправки
        })
            .then(response => response.text())
            .then(data => {
                document.body.innerHTML = data; // Замена текущей страницы результатом
            })
            .catch(error => {
                showError("Ошибка при отправке данных", 5000);
            });


});

// Функция для отображения таблицы на текущей странице с новыми результатами первыми
function renderTable() {
    table_with_results.innerHTML = `
        <th width="25%">X</th>
        <th width="25%">Y</th>
        <th width="25%">R</th>
        <th width="25%">результат</th>
    `;

    // Инвертируем массив результатов, чтобы сначала шли новые записи
    const reversedResults = [...allResults].reverse();

    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const resultsToShow = reversedResults.slice(start, end);

    resultsToShow.forEach(result => {
        const new_data = `<tr>
                            <td>${result.x}</td>
                            <td>${result.y}</td>
                            <td>${result.R}</td>
                            <td>${result.res}</td>
                          </tr>`;
        table_with_results.innerHTML += new_data;
    });

    // Обновляем информацию о текущей странице
    document.getElementById('page_info').innerText = `Страница ${currentPage}`;
}

// Обновление состояния кнопок пагинации
function updatePaginationControls() {
    const totalPages = Math.ceil(allResults.length / resultsPerPage);
    document.getElementById('prev_page').disabled = currentPage === 1;
    document.getElementById('next_page').disabled = currentPage === totalPages;
}

// Обработчики для кнопок "Вперед" и "Назад"
document.getElementById('prev_page').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        updatePaginationControls();
    }
});

document.getElementById('next_page').addEventListener('click', () => {
    const totalPages = Math.ceil(allResults.length / resultsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        updatePaginationControls();
    }
});

// Обработка формы и отправка данных
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(form);
    const x = formData.get('x_field');
    const y = formData.get('y_field').replace(',', '.');
    const R = r_values[r_values.length - 1];
    let IsCheckBoxPressd = false;

    checkboxes.forEach((item) => {
        if (item.checked === true) IsCheckBoxPressd = true;
    });

    if (-4 <= x && x <= 4 && -3 <= y && y <= 5 && 1 <= R && R <= 5 && validateY(y) && IsCheckBoxPressd === true) {
        // Создаем объект с данными для отправки
        const data = {
            x: x,
            y: y,
            R: R,
        };

        // Отправляем данные методом POST
        fetch('http://localhost:8080/WebLab3-1.0-SNAPSHOT/ControllerServlet', {
            method: 'POST',  // Указываем метод POST
            headers: {
                'Content-Type': 'application/json'  // Указываем, что передаем данные в формате JSON
            },
            body: JSON.stringify(data)  // Преобразуем объект в строку JSON для отправки
        })
            .then(response => response.text())
            .then(data => {
                document.body.innerHTML = data; // Замена текущей страницы результатом
            })
            .catch(error => {
                showError("Ошибка при отправке данных", 5000);
            });
    } else {
        showError("Проверьте корректность введенных значений!", 5000);
    }
});


// Найдем поле Y
const yField = document.getElementById('y_Field');

// Добавим событие "input", чтобы проверять данные при каждом вводе
yField.addEventListener('input', function () {
    validateYField();
});

// Проверка поля Y
function validateYField() {
    const yValue = parseFloat(yField.value.replace(',', '.')); // Получаем значение поля
    if (isNaN(yValue) || yValue < -3 || yValue > 5) {
        // Если Y не число или выходит за границы -3 и 5, добавляем класс ошибки
        yField.classList.add('input-error');
    } else {
        // Если Y корректен, убираем класс ошибки
        yField.classList.remove('input-error');
    }
}

// Дополнительная проверка перед отправкой формы
form.addEventListener('submit', function (event) {
    if (!validateYField()) {
        event.preventDefault(); // Останавливаем отправку, если поле некорректно
    }
});


// Вспомогательные функции
function showError(msg, delay) {
    error_div.innerText = msg;

    setTimeout(function () {
        error_div.innerText = "";
    }, delay);
}

const regex = /^-?([0-4](\.\d+)?|5(\.0*)?)$/;

function validateY(inputY) {
    if (regex.test(inputY)) {
        return true;
    } else {
        return false;
    }
}

document.querySelectorAll('.R_value').forEach(function (button) {
    button.addEventListener('click', function(event){
        r_values.push(event.target.value);
        // вызов функции отрисовки области
        drawArea(event.target.value * 20);
        Dots.forEach((item) => {
            drawPoint(item.split(";")[0], item.split(";")[1], item.split(";")[2]);
        })
    });
});


function checkOnlyOne(checkbox) {
    var checkboxes = document.querySelectorAll('input[type="checkbox"][name="' + checkbox.name + '"]');
    checkboxes.forEach((item) => {
        if (item !== checkbox) item.checked = false;
    });
}
renderTable();  // Обновляем таблицу на текущей странице