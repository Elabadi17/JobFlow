package JobFlow.repository;

import JobFlow.entity.CVFile;
import JobFlow.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CVFileRepository extends JpaRepository<CVFile, UUID> {

    Optional<CVFile> findByHash(
            String hash
    );

    List<CVFile> findByUser(User user);

    Optional<CVFile> findByIdAndUser(
            UUID id,
            User user
    );


    Optional<CVFile> findByUserAndIsDefaultTrue(User user);

    boolean existsByUser(User user);

}