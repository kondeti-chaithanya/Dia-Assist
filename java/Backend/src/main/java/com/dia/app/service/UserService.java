package com.dia.app.service;

import com.dia.app.entity.User;

import java.util.Map;

public interface UserService {

    public String register(User user);

    public Map<String, Object> login(String email, String password);
}
