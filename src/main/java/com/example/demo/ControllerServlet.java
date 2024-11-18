package com.example.demo;

import java.io.*;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

@WebServlet(name = "ControllerServlet", value = "/ControllerServlet")
public class ControllerServlet extends HttpServlet {

    public void init() {
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        // Чтение тела запроса (JSON)
        StringBuilder sb = new StringBuilder();
        BufferedReader reader = req.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }

        // Извлечение данных из JSON
        Map<String, String> Elements = parseJSON(String.valueOf(sb));

        // Устанавливаем эти параметры для запроса
        req.setAttribute("x_field", Elements.get("x"));
        req.setAttribute("y_field", Elements.get("y"));
        req.setAttribute("R_field", Elements.get("R"));

        // Перенаправляем запрос на AreaCheckServlet
        RequestDispatcher dispatcher = req.getRequestDispatcher("AreaCheckServlet");
        dispatcher.forward(req, resp);
    }

    public Map<String, String> parseJSON(String content) {
        Map<String, String> mapOfContent  = new HashMap<>();

        content = content.replaceAll("\\{", "");
        content = content.replaceAll("}", "");
        content = content.replaceAll("\"", "");
        String[] ArrayOfElements = content.split(",");

        for (int i = 0; i < ArrayOfElements.length; i++) {
            String key = ArrayOfElements[i].split(":")[0];
            String value = ArrayOfElements[i].split(":")[1];
            mapOfContent.put(key, value);
        }

        return mapOfContent;

    }

    public void destroy() {
    }


}