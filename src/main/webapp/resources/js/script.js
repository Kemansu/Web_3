// Переменные для пагинации
let currentPage = 1;
const resultsPerPage = 10;  // Количество результатов на странице

window.onload = function () {
    const error_div = document.getElementById('error_div');
    const table_with_results = document.getElementById('table_for_results');


    document.getElementById('j_idt12:R' + r_value.toString().replace(/\./g, '_')).style.color = 'green';


    // Найти элемент selectManyCheckbox по его id
    const checkboxes = document.querySelectorAll('[id$="xValues"] input[type="checkbox"]');

    // Проверить, есть лиx выбранный элемент, если нет, выбрать значение 0
    let selected = Array.from(checkboxes).some(checkbox => checkbox.checked);

    if (!selected) {
        checkboxes.forEach(checkbox => {
            if (checkbox.value === "0") {
                checkbox.checked = true; // Устанавливаем по умолчанию значение "0"
            }
        });
    }

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

    const canvas = document.getElementById('plot');
    const ctx = canvas.getContext('2d');

    // Координаты центра (0, 0) будут в центре холста
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let R_canvas = 100; // Радиус области, масштабируется под размер холста

    if (r_value === 2.5) {
        R_canvas = 100 / 1.2;
    }
    if (r_value === 2) {
        R_canvas = 100 / 1.5;
    }
    if (r_value === 1.5) {
        R_canvas = 100 / 2;
    }
    if (r_value === 1) {
        R_canvas = 100 / 3;
    }

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
        ctx.arc(centerX, centerY, r, Math.PI/2, -Math.PI);
        ctx.lineTo(centerX, centerY);
        ctx.closePath();
        ctx.fill();

        // Треугольник
        ctx.beginPath();
        ctx.moveTo(centerX + r/2, centerY);
        ctx.lineTo(centerX, centerY - r/2);
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
        if (status === "false" || status === false) {
            ctx.fillStyle = "red";
        } else {
            ctx.fillStyle = "green";
        }
        ctx.fill();
    }


    // Обработчик клика на canvas
    canvas.addEventListener('click', function(event) {

        if (r_value === 0) {
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



        callProcessParameters(plotX, plotY);

        let plotXForClalcutating = plotX / 1.62;
        let plotYForClalcutating = plotY / 1.62;

        const inCircle = (plotXForClalcutating * plotXForClalcutating + plotYForClalcutating * plotYForClalcutating <= r_value * r_value) && (plotXForClalcutating <= 0) && (plotYForClalcutating <= 0);
        const inTriangle = (plotYForClalcutating <= -plotXForClalcutating + r_value / 2) && (plotXForClalcutating >= 0) && (plotYForClalcutating >= 0);
        const inRectangle = (plotXForClalcutating >= 0 && (plotXForClalcutating <= (r_value / 2))) && (plotYForClalcutating >= -r_value && plotYForClalcutating <= 0);

        const status = inCircle || inTriangle || inRectangle;



        drawPoint(plotX, plotY, status);
    });

    // Функция для отображения таблицы на текущей странице с новыми результатами первыми
    function renderTable() {
        table_with_results.innerHTML = `
        <th>X</th>
        <th>Y</th>
        <th>R</th>
        <th>результат</th>
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
                            <td>${result.r}</td>
                            <td>${result.result}</td>
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

    renderTable();  // Обновляем таблицу на текущей странице


    // Проверка поля Y
    function validateYField() {
        const yValue = parseFloat(yField.value.replace(',', '.')); // Получаем значение поля Y

        if (!isNaN(yValue) && yValue >= -3 && yValue <= 3) {
            processButton.disabled = false; // Активируем кнопку, если Y корректен
            yField.classList.remove('input-error'); // Убираем визуальную индикацию ошибки
        } else {
            processButton.disabled = true; // Деактивируем кнопку, если Y некорректен
            yField.classList.add('input-error'); // Добавляем визуальную индикацию ошибки
        }
    }

    // Найдем поле Y
    const yField = document.getElementById('j_idt12:yValue');

    const processButton = document.getElementById('j_idt12:processButton');

    // Добавим событие "input", чтобы проверять данные при каждом вводе
    yField.addEventListener('input', function () {
        validateYField();
    });

    function validateY(inputY) {
        if (regex.test(inputY)) {
            return true;
        } else {
            return false;
        }
    }

    const regex = /^-?([0-4](\.\d+)?|3(\.0*)?)$/;

};

// Вспомогательные функции
function showError(msg, delay) {
    error_div.innerText = msg;

    setTimeout(function () {
        error_div.innerText = "";
    }, delay);
}


function validateY(inputY) {
    if (regex.test(inputY)) {
        return true;
    } else {
        return false;
    }
}

function checkOnlyOne(checkbox) {
    // Получаем все чекбоксы с таким же именем, как у переданного чекбокса
    var checkboxes = document.querySelectorAll('input[type="checkbox"][name="' + checkbox.name + '"]');

    // Проходимся по каждому чекбоксу
    checkboxes.forEach(function(item) {
        // Если это не тот чекбокс, который был изменен, снимаем отметку
        if (item !== checkbox) {
            item.checked = false;
        }
    });

    // Проверить, есть лиx выбранный элемент, если нет, выбрать значение 0
    let selected = Array.from(checkboxes).some(checkbox => checkbox.checked);

    if (!selected) {
        checkboxes.forEach(checkbox => {
            if (checkbox.value === "0") {
                checkbox.checked = true; // Устанавливаем по умолчанию значение "0"
            }
        });
    }

}

function callProcessParameters(x, y) {
    processParametersRemote([{name: 'x', value: x}, {name: 'y', value: y}]);
}