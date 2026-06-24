package JobFlow.dtos.responses;


import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.util.UUID;


@Data
@EqualsAndHashCode
public class BaseResponse {
    protected UUID id;
    protected Instant createdAt;
    protected Instant modifiedAt;
}
