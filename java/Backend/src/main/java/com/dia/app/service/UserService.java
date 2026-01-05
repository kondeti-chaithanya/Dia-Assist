package com.dia.app.service;

import com.dia.app.dto.UserResponseDTO;
import com.dia.app.entity.User;

public interface UserService {

    public String register(User user);

    public UserResponseDTO login(String email, String password);

    User findByEmail(String email);
}
