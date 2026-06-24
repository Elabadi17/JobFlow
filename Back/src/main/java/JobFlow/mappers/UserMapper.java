package JobFlow.mappers;


import JobFlow.dtos.responses.UserResponse;
import JobFlow.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserResponse entityToResponse(User entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "password", ignore = true)
    void updateFromDto(User updateEntity, @MappingTarget User entity);

}
