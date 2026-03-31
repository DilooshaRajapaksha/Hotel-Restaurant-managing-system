package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "MENU_IMAGE")
public class MenuImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Fimage_id")
    private Long fimageId;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(name = "Fimage_url", nullable = false, length = 500)
    private String fimageUrl;

    @Column(name = "is_main")
    private Boolean isMain = false;

}
