package com.dia.app.service;

import java.util.List;
import java.util.Map;

public interface GraphService {
    List<Map<String, Object>> getLastSeenChecks(Long userId);
}
