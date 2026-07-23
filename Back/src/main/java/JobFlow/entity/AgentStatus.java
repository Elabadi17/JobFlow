package JobFlow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.Instant;

@Entity
@Data
public class AgentStatus {

    @Id
    private Long id = 1L;

    private Instant lastHeartbeat;
}