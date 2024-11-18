<%@ page import="com.example.demo.However" %>
<%@ page import="java.util.*" %>
<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<html>
<head>
    <title>Ракетка, лаба 2</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="icon" href="img/Тамаев.ico" type="image/x-icon">
</head>

<body>
    <jsp:useBean id="storage" class="com.example.demo.However" scope="session"/>
    <form id="form">
        <script>
            let Dots = <%= storage.getDots()%>;
            let allResults = <%= storage.getResults()%>;
        </script>
        <script src="js/script.js" async defer></script>
        <header>Погосов Денис Артурович P3220 Вариант 409352</header>

        <div id="x_container">
            <label>X:</label>
            <input class="x_value" type="radio" name="x_field" value="-4"><label>-4</label>
            <input class="x_value" type="radio" name="x_field" value="-3"><label>-3</label>
            <input class="x_value" type="radio" name="x_field" value="-2"><label>-2</label>
            <input class="x_value" type="radio" name="x_field" value="-1"><label>-1</label>
            <input class="x_value" type="radio" name="x_field" value="0"><label>0</label>
            <input class="x_value" type="radio" name="x_field" value="1"><label>1</label>
            <input class="x_value" type="radio" name="x_field" value="2"><label>2</label>
            <input class="x_value" type="radio" name="x_field" value="3"><label>3</label>
            <input class="x_value" type="radio" name="x_field" value="4"><label>4</label>
        </div>

        <div id="y_container">
            <label for="y_field">Y:</label>
            <input id="y_Field" type="text" name="y_field" placeholder="Введите значение для Y" required="">
        </div>

        <div id="R_container">
            <label>R:</label>
            <input id="buttonR1" class="R_value" type="checkbox" onclick="checkOnlyOne(this)" name="R_field" value="1">1</input>
            <input id="buttonR2" class="R_value" type="checkbox" onclick="checkOnlyOne(this)" name="R_field" value="2">2</input>
            <input id="buttonR3" class="R_value" type="checkbox" onclick="checkOnlyOne(this)" name="R_field" value="3">3</input>
            <input id="buttonR4" class="R_value" type="checkbox" onclick="checkOnlyOne(this)" name="R_field" value="4">4</input>
            <input id="buttonR5" class="R_value" type="checkbox" onclick="checkOnlyOne(this)" name="R_field" value="5">5</input>
        </div>

        <div id="error_div"></div>

        <div id="button_confirm_container">
            <button id="button_confirm" type="submit">отправить</button>
        </div>
    </form>

    <br>
    <br>
    <br>
    <br>
    <br>
    <div style="width: 100%; text-align: center;">
        <canvas id="plot" width="500" height="500" style="border:1px solid #000;"></canvas>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>


    <table id="table_for_results">
        <th width="25%">X</th>
        <th width="25%">Y</th>
        <th width="25%">R</th>
        <th width="25%">результат</th>
    </table>

    <div id="pagination_controls">
        <button id="prev_page" disabled>Назад</button>
        <span id="page_info">Страница 1</span>
        <button id="next_page">Вперед</button>
    </div>
</body>
</html>