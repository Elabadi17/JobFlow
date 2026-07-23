package JobFlow.repository;

import JobFlow.entity.AgentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentStatusRepository
        extends JpaRepository<AgentStatus, Long> {

}