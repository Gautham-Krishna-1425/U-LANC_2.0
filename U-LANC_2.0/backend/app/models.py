"""
Data models for U-LANC application
"""

from pydantic import BaseModel
from enum import Enum
from typing import Optional
from datetime import datetime

class TaskStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class CompressionTask(BaseModel):
    id: str
    file_type: str  # "image", "audio", "video"
    original_filename: str
    original_size: int  # in bytes
    file_path: str
    compressed_file_path: Optional[str] = None
    compressed_size: Optional[int] = None
    compression_ratio: Optional[float] = None
    status: TaskStatus = TaskStatus.PENDING
    progress: int = 0  # 0-100
    error_message: Optional[str] = None
    created_at: datetime = datetime.now()
    completed_at: Optional[datetime] = None
    
    # Image/Video specific
    quality: Optional[int] = None  # 1-100
    adaptive_mode: Optional[bool] = None
    
    # Audio specific
    bitrate: Optional[float] = None  # in kbps
    
    # AI Analysis results
    ai_analysis: Optional[dict] = None

class CompressionRequest(BaseModel):
    quality: int = 80
    adaptive_mode: bool = True
    bitrate: Optional[float] = None

class CompressionResponse(BaseModel):
    task_id: str
    status: str
    message: str
    download_url: Optional[str] = None