package com.talentpulse.application.exception;

public class UnauthorizedApplicationAccessException extends RuntimeException {

    public UnauthorizedApplicationAccessException(String message) {
        super(message);
    }
}
