package com.spcomputers.exception;
import com.spcomputers.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.Instant;
import java.util.stream.Collectors;
@RestControllerAdvice
public class GlobalExceptionHandler {
 @ExceptionHandler(ApiException.class) public ResponseEntity<ErrorResponse> api(ApiException e,HttpServletRequest r){return response(e.getStatus(),e.getMessage(),r);}
 @ExceptionHandler(MethodArgumentNotValidException.class) public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException e,HttpServletRequest r){String m=e.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage).distinct().collect(Collectors.joining("; "));return response(HttpStatus.BAD_REQUEST,m.isBlank()?"Request validation failed":m,r);}
 @ExceptionHandler(BadCredentialsException.class) public ResponseEntity<ErrorResponse> credentials(Exception e,HttpServletRequest r){return response(HttpStatus.UNAUTHORIZED,"Invalid email or password",r);}
 @ExceptionHandler(DataIntegrityViolationException.class) public ResponseEntity<ErrorResponse> duplicate(Exception e,HttpServletRequest r){return response(HttpStatus.CONFLICT,"The request conflicts with existing data",r);}
 @ExceptionHandler(Exception.class) public ResponseEntity<ErrorResponse> unexpected(Exception e,HttpServletRequest r){return response(HttpStatus.INTERNAL_SERVER_ERROR,"An unexpected server error occurred",r);}
 private ResponseEntity<ErrorResponse> response(HttpStatus s,String m,HttpServletRequest r){return ResponseEntity.status(s).body(new ErrorResponse(Instant.now(),s.value(),s.getReasonPhrase(),m,r.getRequestURI()));}
}
