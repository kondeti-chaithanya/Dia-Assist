package com.dia.app.repository;

import com.dia.app.entity.Prediction;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PredictionRepositoryTest {

    @Mock
    private PredictionRepository predictionRepository;

    @Test
    void findTop7ByUserId_mocked() {
        Prediction p1 = new Prediction();
        Prediction p2 = new Prediction();

        when(predictionRepository.findTop7ByUser_IdOrderByCreatedAtDesc(1L)).thenReturn(List.of(p2, p1));

        var latest = predictionRepository.findTop7ByUser_IdOrderByCreatedAtDesc(1L);
        assertThat(latest).hasSize(2);
    }
}
