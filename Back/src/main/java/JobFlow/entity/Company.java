package JobFlow.entity;


import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Company extends BaseEntity {



    @Column(unique = true)
    private String name;

    private String website;

    private String location;

}