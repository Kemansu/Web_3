package com.example.demo.utils;


import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

import java.util.List;

public class HibernateUtil {

    public void addResult(Result result){
        Configuration configuration = new Configuration().addAnnotatedClass(Result.class);
        SessionFactory sessionFactory = configuration.buildSessionFactory();
        Session session = sessionFactory.getCurrentSession();
        try {
            session.beginTransaction();

            session.save(result);

            session.getTransaction().commit();
        } finally {
            sessionFactory.close();
        }
    }

    public List<Result> getResults() {
        List<Result> results;
        Configuration configuration = new Configuration().addAnnotatedClass(Result.class);
        SessionFactory sessionFactory = configuration.buildSessionFactory();
        Session session = sessionFactory.getCurrentSession();
        try {
            session.beginTransaction();

            results = session.createQuery("FROM Result").getResultList();

            session.getTransaction().commit();
        } finally {
            sessionFactory.close();
        }
        return results;
    }
}
