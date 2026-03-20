package com.hotel.backend.DTO;

public class MenuImageDTO {
    private Long Fimage_id;
    private String Fimage_url;
    private Boolean is_main;

    public Long getFimage_id() { return Fimage_id; }
    public void setFimage_id(Long fimage_id) { Fimage_id = fimage_id; }

    public String getFimage_url() { return Fimage_url; }
    public void setFimage_url(String fimage_url) { Fimage_url = fimage_url; }

    public Boolean getIs_main() { return is_main; }
    public void setIs_main(Boolean is_main) { this.is_main = is_main; }
}