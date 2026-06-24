package JobFlow.repository;

import JobFlow.entity.CVFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface CVFileRepository extends JpaRepository<CVFile, UUID> {

    Optional<CVFile> findByHash(
            String hash
    );
}