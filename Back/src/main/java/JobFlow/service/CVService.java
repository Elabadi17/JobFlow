package JobFlow.service;

import JobFlow.dtos.requests.CVFileRequest;
import JobFlow.dtos.responses.CVFileResponse;
import JobFlow.entity.CVFile;
import JobFlow.entity.User;
import JobFlow.mappers.CVFileMapper;
import JobFlow.repository.CVFileRepository;

import JobFlow.service.storage.StorageFactory;
import JobFlow.service.storage.UploadResult;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CVService {

    private final CVFileRepository repository;
    private final CVFileMapper mapper;
    private final StorageFactory storageFactory;
    private final AuthService authenticationService;


    public CVFileResponse create(
            MultipartFile file,
            CVFileRequest request
    ) {

        User user = authenticationService.getCurrentUser();

        UploadResult upload =
                storageFactory
                        .getStorage()
                        .upload(file);

        Optional<CVFile> existing =
                repository.findByHash(
                        upload.getHash()
                );

        if (existing.isPresent()) {
            return mapper.toResponse(
                    existing.get()
            );
        }

        CVFile cv =
                new CVFile();

        cv.setHash(
                upload.getHash()
        );

        cv.setFileUrl(
                upload.getPath()
        );

        cv.setFileName(
                file.getOriginalFilename()
        );

        cv.setLabel(
                request.getLabel()
        );

        cv.setNote(
                request.getNote()
        );

        cv.setUser(user);

        cv.setDefault(!repository.existsByUser(user));

        return mapper.toResponse(
                repository.save(cv)
        );

    }
    public List<CVFileResponse> getAll() {

        User currentUser = authenticationService.getCurrentUser();

        return repository.findByUser(currentUser)
                .stream()
                .map(mapper::toResponse)
                .toList();
    }

    public CVFileResponse getById(UUID id) {

        User currentUser = authenticationService.getCurrentUser();

        return repository.findByIdAndUser(
                        id,
                        currentUser
                )
                .map(mapper::toResponse)
                .orElseThrow(() ->
                        new RuntimeException("CV not found"));
    }

    public void delete(UUID id) {

        User currentUser = authenticationService.getCurrentUser();

        CVFile cv =
                repository.findByIdAndUser(
                                id,
                                currentUser
                        )
                        .orElseThrow(() ->
                                new RuntimeException("CV not found"));


        if(cv.isDefault()) {
            throw new RuntimeException("Cannot delete default CV");
        }
        storageFactory
                .getStorage()
                .delete(cv.getFileUrl());

        repository.delete(cv);
    }


    @Transactional
    public CVFileResponse setAsDefault(UUID id) {

        User currentUser = authenticationService.getCurrentUser();

        CVFile newDefault = repository.findByIdAndUser(id, currentUser)
                .orElseThrow(() -> new RuntimeException("CV not found"));

        repository.findByUserAndIsDefaultTrue(currentUser)
                .ifPresent(cv -> cv.setDefault(false));

        newDefault.setDefault(true);

        return mapper.toResponse(newDefault);
    }

    public CVFile getDefaultCvId() {
        User user = authenticationService.getCurrentUser();
        return repository.findByUserAndIsDefaultTrue(user)
                .orElseThrow(() -> new EntityNotFoundException("Default CV not found"));
    }



}