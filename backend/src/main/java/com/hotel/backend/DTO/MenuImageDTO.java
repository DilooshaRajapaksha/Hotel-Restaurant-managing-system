package com.hotel.backend.DTO;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class MenuImageDTO {
    private Long Fimage_id;
    private String Fimage_url;
    private Boolean is_main;

}