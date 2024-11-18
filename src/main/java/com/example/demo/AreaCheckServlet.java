package com.example.demo;

import java.io.*;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "AreaCheckServlet", value = "/AreaCheckServlet")
public class AreaCheckServlet extends HttpServlet {

    public void init() {
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Получаем параметры, переданные из ControllerServlet
        String x = (String) req.getAttribute("x_field");
        String y = (String) req.getAttribute("y_field");
        String R = (String) req.getAttribute("R_field");

        // Проверка на попадание точки
        boolean ans = IsDotInside(Double.parseDouble(x), Double.parseDouble(y), Double.parseDouble(R));

        resp.setContentType("text/html");
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();

        // Формируем HTML-страницу
        out.println("<html><head><title>Результат проверки</title></head><body>");
        out.println("<div style=\"width: 100%; text-align: center; margin-top: 20vw;\">");
        out.println("<h1>Результат</h1>");
        out.println("<table border='1' style='margin: auto;'>");
        out.println("<tr><td>X:</td><td>" + x + "</td></tr>");
        out.println("<tr><td>Y:</td><td>" + y + "</td></tr>");
        out.println("<tr><td>R:</td><td>" + R + "</td></tr>");
        out.println("<tr><td>Проверка попадания точки:</td><td>" + ans + "</td></tr>");
        out.println("</table>");
        out.println("<a href='index.jsp'>Вернуться к форме</a>");
        out.println("</div>");
        out.println("</body></html>");

        // Получаем сессию
        HttpSession session = req.getSession();

        // Извлекаем объекты из сессии
        However storage = (However) session.getAttribute("storage");

        // Добавляем данные в Bean-компонент
        storage.addResults("{\"x\":" + x + ", " +
                        "\"y\":" + y + ", " +
                        "\"R\":" + R + ", " +
                        "\"res\":" + ans + "}");
        storage.addDot("'" + x + ";" + y + ";" + ans +"'");


    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doPost(req, resp);
    }

    public boolean IsDotInside(double x, double y, double R) {
        // Проверка на четверть круга
        if ((x * x + y * y <= (R / 2) * (R / 2)) && (x <= 0 && y >= 0)) {
            return true;
        }

        // Проверка треугольной части
        if ((-x -y <= R) && (x <= 0 && y <= 0)) {
            return true;
        }

        // Проверка на прямоугольник
        if ((x <= R/2) && (x >= 0) && (y <= 0) && (y >= -R)) {
            return true;
        }

        return false;
    }

    private static String buildJson(String key, String value) {
        StringBuilder json = new StringBuilder("{");
        json.append("\"").append(key).append("\":\"").append(value).append("\",");
        json.deleteCharAt(json.length() - 1);
        json.append("}");
        return json.toString();
    }



    public void destroy() {
    }
}