package com.dia.app.service.impl;

import com.dia.app.entity.Prediction;
import com.dia.app.repository.PredictionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GraphServiceImplTest {

    @Mock
    private PredictionRepository predictionRepository;

    @InjectMocks
    private GraphServiceImpl graphService;

    @Test
    void getLastSeenChecks_returnsMappedListInAscendingOrder() {
        Prediction p1 = new Prediction();
        p1.setCreatedAt(LocalDateTime.now().minusDays(2));
        p1.setHba1c(5.0);
        p1.setBloodGlucose(100);

        Prediction p2 = new Prediction();
        p2.setCreatedAt(LocalDateTime.now().minusDays(1));
        p2.setHba1c(5.2);
        p2.setBloodGlucose(110);

        // repository returns newest first; service reverses to oldest->newest
        List<Prediction> repoList = new ArrayList<>();
        repoList.add(p2);
        repoList.add(p1);

        when(predictionRepository.findTop7ByUser_IdOrderByCreatedAtDesc(9L)).thenReturn(repoList);

        List<Map<String, Object>> result = graphService.getLastSeenChecks(9L);

        assertEquals(2, result.size());
        assertEquals("Check 1", result.get(0).get("check"));
        assertEquals(5.0, result.get(0).get("hba1c"));
        assertEquals(100, result.get(0).get("glucose"));
    }
}
