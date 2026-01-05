package com.dia.app.controller;

import com.dia.app.security.CustomUserDetails;
import com.dia.app.service.GraphService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
class GraphControllerTest {

    @Mock
    private GraphService graphService;

    @InjectMocks
    private GraphController graphController;

    @Test
    void getLastChecks_returnsData() {
        when(graphService.getLastSeenChecks(3L)).thenReturn(List.of());

        com.dia.app.entity.User u = new com.dia.app.entity.User();
        u.setId(3L);
        u.setEmail("u@t");
        u.setName("T");
        u.setPassword("p");

        CustomUserDetails user = new CustomUserDetails(u);

        var resp = graphController.getLastChecks(user);
        assertEquals(200, resp.getStatusCode().value());
    }
}
