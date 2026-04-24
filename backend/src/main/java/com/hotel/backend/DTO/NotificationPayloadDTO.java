package com.hotel.backend.DTO;

import java.time.LocalDateTime;

public class NotificationPayloadDTO {

    public enum Type { ORDER, BOOKING }

    private Type   type;
    private Long   id;
    private String title;
    private String message;
    private String timestamp;

    public NotificationPayloadDTO() {}

    public NotificationPayloadDTO(Type type, Long id, String title, String message) {
        this.type      = type;
        this.id        = id;
        this.title     = title;
        this.message   = message;
        this.timestamp = LocalDateTime.now().toString();
    }

    public Type   getType()                        { return type; }
    public void   setType(Type type)               { this.type = type; }
    public Long   getId()                          { return id; }
    public void   setId(Long id)                   { this.id = id; }
    public String getTitle()                       { return title; }
    public void   setTitle(String title)           { this.title = title; }
    public String getMessage()                     { return message; }
    public void   setMessage(String message)       { this.message = message; }
    public String getTimestamp()                   { return timestamp; }
    public void   setTimestamp(String timestamp)   { this.timestamp = timestamp; }
}

