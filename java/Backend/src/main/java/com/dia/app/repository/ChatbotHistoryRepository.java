package com.dia.app.repository;

import com.dia.app.entity.ChatbotHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatbotHistoryRepository extends JpaRepository<ChatbotHistory, Long> {
}
