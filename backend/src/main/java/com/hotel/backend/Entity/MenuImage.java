package com.hotel.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "menu_image")
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

    public Long getFimageId() { return fimageId; }
    public void setFimageId(Long fimageId) { this.fimageId = fimageId; }

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getFimageUrl() { return fimageUrl; }
    public void setFimageUrl(String fimageUrl) { this.fimageUrl = fimageUrl; }

    public Boolean getIsMain() { return isMain; }
    public void setIsMain(Boolean isMain) { this.isMain = isMain; }
}
