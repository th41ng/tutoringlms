package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class MultipleChoiceAssignment extends Assignment {

    @OneToMany(mappedBy = "multipleChoiceAssignment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;
}
