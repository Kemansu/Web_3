package com.example.demo;

import java.util.*;

public class However {

    private List<String> dots = new ArrayList<>();

    private List<String> results = new ArrayList<>();

    public List<String> getResults() {
        return results;
    }

    public void addResults(String result) {
        results.add(result);
    }

    public List<String> getDots() {
        return dots;
    }

    public void addDot(String dot) {
        dots.add(dot);
    }


}
