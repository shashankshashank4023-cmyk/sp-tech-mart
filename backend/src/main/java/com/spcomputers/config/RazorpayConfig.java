package com.spcomputers.config;
import com.razorpay.RazorpayClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnExpression;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class RazorpayConfig {
 @Bean @ConditionalOnExpression("'${razorpay.key-id:}'.length() > 0 && '${razorpay.key-secret:}'.length() > 0")
 RazorpayClient razorpayClient(@Value("${razorpay.key-id}") String keyId,@Value("${razorpay.key-secret}") String keySecret) throws Exception {return new RazorpayClient(keyId,keySecret);}
}
