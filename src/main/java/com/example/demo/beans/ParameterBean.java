package com.example.demo.beans;

import com.example.demo.utils.HibernateUtil;
import com.example.demo.utils.Result;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.faces.context.FacesContext;
import jakarta.inject.Named;
import org.primefaces.PrimeFaces;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Named
@ApplicationScoped
public class ParameterBean {
    private List<String> selectedXValues;
    private double yValue;
    private List<String> dots = new ArrayList<>();
    private double rValue = 3;
    private HibernateUtil hibernateUtil = new HibernateUtil();
    private List<Result> resultList = hibernateUtil.getResults();
    //private int currentPage = 1;


    {
        resultList.forEach((result_item) -> {dots.add("'" + result_item.getX() + ";" + result_item.getY() + ";" + result_item.isResult() +"'");});
    }

    // Геттеры и сеттеры
    public List<String> getSelectedXValues() {
        return selectedXValues;
    }

    public void setSelectedXValues(List<String> selectedXValues) {
        if (selectedXValues != null && selectedXValues.size() > 1) {
            throw new IllegalArgumentException("Можно выбрать только одно значение X.");
        }
        this.selectedXValues = selectedXValues;
    }

    public double getYValue() {
        return yValue;
    }

    public void setYValue(double yValue) {
        this.yValue = yValue;
    }

    public double getRValue() {
        return rValue;
    }

    public void setRValue(double rValue) {
        this.rValue = rValue;
    }

    public List<Result> getResultList() {
        return resultList;
    }


    // Метод для обработки значения R через commandLink
    public void selectR(double value) {
        this.rValue = value;
    }

    public List<String> getDots() {
        return dots;
    }

    public void setDots(List<String> dots) {
        this.dots = dots;
    }

    // Метод для обработки всех параметров
    public void processParameters() {
        double x = Double.parseDouble(selectedXValues.get(0));
        boolean resultOfDot = isPointInArea(x, yValue, rValue);
        Result result = new Result(x, yValue, rValue, resultOfDot);
        hibernateUtil.addResult(result);
        resultList.add(result);
        dots.add("'" + result.getX() + ";" + result.getY() + ";" + result.isResult() +"'");
    }

    public void processParametersR(double x, double y, double r) {
        boolean resultOfDot = isPointInArea(x, y, r);
        Result result = new Result(x, y, r, resultOfDot);
        hibernateUtil.addResult(result);
        resultList.add(result);
        dots.add("'" + result.getX() * 1.62 + ";" + result.getY() * 1.62 + ";" + result.isResult() +"'");
    }

    // Ваши текущие поля и методы

    // Новый метод для вызова через PrimeFaces
    public void processParametersRemote() {
        // Получение параметров из контекста
        Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
        System.out.println(params.get("x"));
        System.out.println(params.get("y"));

        double x = Double.parseDouble(params.get("x"));
        double y = Double.parseDouble(params.get("y"));

        // Вызов метода с логикой
        processParametersR(x / 1.62, y / 1.62, rValue);
    }

    // Метод для преобразования списка результатов в JSON
    public String getResultListAsJson(int currentPage) {
        ObjectMapper mapper = new ObjectMapper();
        List<Result> resultListOnly10 = new ArrayList<>();

        for (int i=(10 * (currentPage - 1)); i < resultList.size() && i < (10 * currentPage); i++){
            resultListOnly10.add(resultList.get(i));
        }


        try {
            return mapper.writeValueAsString(resultListOnly10);
        } catch (Exception e) {
            e.printStackTrace();
            return "[]"; // Возвращаем пустой массив в случае ошибки
        }
    }

    public void getResultListAsJsonRemote() {
        ObjectMapper mapper = new ObjectMapper();
        List<Result> resultListOnly10 = new ArrayList<>();

        // Получение параметров из контекста
        Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
        int currentPage = Integer.parseInt(params.get("currentPage"));

        for (int i=(10 * (currentPage - 1)); i < resultList.size() && i < (10 * currentPage); i++){
            resultListOnly10.add(resultList.get(i));
        }


        String resultsJson = null;
        try {
            resultsJson = mapper.writeValueAsString(resultListOnly10);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        int totalPages = (int) Math.ceil((double) resultList.size() / 10);

        PrimeFaces.current().ajax().addCallbackParam("results", resultsJson);
        PrimeFaces.current().ajax().addCallbackParam("totalPages", totalPages);
    }

    public boolean isPointInArea(double x, double y, double R) {
        boolean inCircle = (x * x + y * y <= R * R) && (x <= 0) && (y <= 0);
        boolean inTriangle = (y <= -x + R / 2) && (x >= 0) && (y >= 0);
        boolean inRectangle = (x >= 0 && x <= R/2) && (y >= -R && y <= 0);
        return inCircle || inTriangle || inRectangle;
    }

//    public void setCurrentPage(int currentPage) {
//        this.currentPage = currentPage;
//    }
//
//    public void setCurrentPageRemote() {
//        // Получение параметров из контекста
//        Map<String, String> params = FacesContext.getCurrentInstance().getExternalContext().getRequestParameterMap();
//        setCurrentPage(Integer.parseInt(params.get("currentPage")));
//        System.out.println(currentPage);
//    }
}
