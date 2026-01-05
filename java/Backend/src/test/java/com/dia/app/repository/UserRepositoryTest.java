package com.dia.app.repository;

import com.dia.app.entity.User;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserRepositoryTest {

    @Mock
    private UserRepository userRepository;

    @Test
    void saveAndFindByEmail_mocked() {
        User u = new User();
        u.setEmail("repo@test");
        u.setName("RepoTest");
        u.setPassword("p");

        when(userRepository.findByEmail("repo@test")).thenReturn(u);

        User found = userRepository.findByEmail("repo@test");
        assertThat(found).isNotNull();
        assertThat(found.getEmail()).isEqualTo("repo@test");
    }
}
