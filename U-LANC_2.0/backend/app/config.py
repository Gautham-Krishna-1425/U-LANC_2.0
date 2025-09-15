"""
Configuration settings for U-LANC application
"""

import os
from pathlib import Path
from pydantic import BaseSettings

class Settings(BaseSettings):
    # API Settings
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    
    # File Storage
    upload_dir: str = "uploads"
    output_dir: str = "outputs"
    max_file_size: int = 100 * 1024 * 1024  # 100MB
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379/0"
    
    # Celery Configuration
    celery_broker_url: str = "redis://localhost:6379/0"
    celery_result_backend: str = "redis://localhost:6379/0"
    
    # AI Model Settings
    compressai_model: str = "bmshj2018-factorized-msssim-1"
    encodec_model: str = "encodec_24khz"
    
    # Compression Settings
    default_image_quality: int = 80
    default_video_quality: int = 50
    default_audio_bitrate: float = 6.0
    
    # CORS Settings
    allowed_origins: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False

# Create settings instance
settings = Settings()

# Ensure directories exist
Path(settings.upload_dir).mkdir(exist_ok=True)
Path(settings.output_dir).mkdir(exist_ok=True)