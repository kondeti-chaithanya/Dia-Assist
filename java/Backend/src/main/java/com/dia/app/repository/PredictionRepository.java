package com.dia.app.repository;

import com.dia.app.dto.PredictionHistoryDTO;
import com.dia.app.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Prediction> findTop7ByUser_IdOrderByCreatedAtDesc(Long userId);

    @Query("""
        SELECT new com.dia.app.dto.PredictionHistoryDTO(
            p.createdAt,
            p.result,
            p.bloodGlucose,
            p.bmi,
            p.hba1c
        )
        FROM Prediction p
        WHERE p.user.id = :userId
        ORDER BY p.createdAt DESC
    """)
    List<PredictionHistoryDTO> findHistoryByUserId(Long userId);
}
