package com.example.backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
<<<<<<< HEAD
                                "http://10.190.74.125",
=======
                    "http://10.190.74.125",
>>>>>>> ae0d04e131fcf4644f78210dd53de9906db8a4dc
                                "http://192.168.10.125",
                                "http://10.155.160.253")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };

    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
