package JobFlow.entity;


import jakarta.persistence.*;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import java.util.UUID;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@MappedSuperclass
@Getter
@Setter
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity implements Serializable {
    @Column(updatable = false, nullable = false)
    @CreatedDate
    protected Instant createdAt;

    @LastModifiedDate protected Instant modifiedAt;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    protected UUID id;

    @Override
    public boolean equals(Object obj) {
        if (obj == null) {
            return false;
        }

        if (this == obj) {
            return true;
        }

        if (!Objects.equals(getClass(), obj.getClass())) {
            return false;
        }

        BaseEntity that = (BaseEntity) obj;
        return this.id != null && Objects.equals(this.id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
