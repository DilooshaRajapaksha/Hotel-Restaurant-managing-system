package com.hotel.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MenuCategoryDTO {
    private Long category_id;
    private String category_name;
    private String description;
    private Boolean is_active;

}
