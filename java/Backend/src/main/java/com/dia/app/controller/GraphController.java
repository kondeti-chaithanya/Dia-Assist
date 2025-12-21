package com.dia.app.controller;

import com.dia.app.security.CustomUserDetails;
import com.dia.app.service.GraphService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/graph")
@RequiredArgsConstructor
public class GraphController {

    private final GraphService graphService;

    @GetMapping("/last-checks")
    public ResponseEntity<?> getLastChecks(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Long userId = userDetails.getId(); // 🔥 FROM JWT
        return ResponseEntity.ok(
                graphService.getLastSeenChecks(userId)
        );
    }
}
