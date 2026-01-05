//package com.dia.app.service.impl;
//
//import com.dia.app.dto.UserResponseDTO;
//import com.dia.app.entity.User;
//import com.dia.app.repository.UserRepository;
//import com.dia.app.security.JWTService;
//import com.dia.app.service.UserService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.HashMap;
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//public class UserServiceImpl implements UserService {
//    private final UserRepository repo;
//    private final JWTService jwt;
//
//    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//
//    @Override
//    public String register(User user){
//        user.setPassword(passwordEncoder.encode(user.getPassword()));
//        repo.save(user);
//        return "Register Sucessful";
//    }
//
//    @Override
//    public Map<String, Object> login(String email, String password){
//
//        User user = repo.findByEmail(email);
//
//        if (user == null)
//            throw new RuntimeException("Invalid credentials");
//
//        if (!passwordEncoder.matches(password, user.getPassword()))
//            throw new RuntimeException("Invalid credentials");
//
//        String token = jwt.generateToken(user.getEmail(), user.getId());
//
//        //  Prepare user DTO
//        UserResponseDTO userDto = new UserResponseDTO();
//        userDto.setId(user.getId());
//        userDto.setName(user.getName());
//        userDto.setEmail(user.getEmail());
//
//        //  Final response
//        Map<String, Object> response = new HashMap<>();
//        response.put("token", token);
//        response.put("user", userDto);
//
//        return response;
//    }
//}


package com.dia.app.service.impl;

import com.dia.app.dto.UserResponseDTO;
import com.dia.app.entity.User;
import com.dia.app.repository.UserRepository;
import com.dia.app.security.JWTService;
import com.dia.app.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final JWTService jwt;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public String register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        repo.save(user);
        return "Register Successful";
    }

    @Override
    public UserResponseDTO login(String email, String password) {

        User user = repo.findByEmail(email);

        if (user == null || !passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        return new UserResponseDTO(user.getId(), user.getName(), user.getEmail());
    }


    public String generateToken(User user) {
        return jwt.generateToken(user.getEmail(), user.getId());
    }

    @Override
    public User findByEmail(String email) {
        return repo.findByEmail(email);
    }

}
