"""
Celery tasks for U-LANC compression operations
"""

import os
import logging
from pathlib import Path
from typing import Dict, Any

from .celery_app import celery_app
from .compression_engine import CompressionEngine
from .models import CompressionTask, TaskStatus

# Global compression engine instance
compression_engine = CompressionEngine()

# In-memory task storage (in production, use Redis or database)
tasks: Dict[str, CompressionTask] = {}

logger = logging.getLogger(__name__)

@celery_app.task(bind=True)
def compress_image(self, task_id: str, file_path: str, quality: int, adaptive_mode: bool):
    """Compress an image asynchronously"""
    try:
        # Update task status
        if task_id in tasks:
            tasks[task_id].status = TaskStatus.PROCESSING
            tasks[task_id].progress = 10
        
        # Generate output path
        input_path = Path(file_path)
        output_path = Path("outputs") / f"compressed_{input_path.name}"
        output_path.parent.mkdir(exist_ok=True)
        
        # Update progress
        if task_id in tasks:
            tasks[task_id].progress = 30
        
        # Compress image
        result = compression_engine.compress_image(
            file_path, 
            str(output_path), 
            quality, 
            adaptive_mode
        )
        
        if result["success"]:
            # Update task with results
            if task_id in tasks:
                tasks[task_id].status = TaskStatus.COMPLETED
                tasks[task_id].progress = 100
                tasks[task_id].compressed_file_path = str(output_path)
                tasks[task_id].compressed_size = result["compressed_size"]
                tasks[task_id].compression_ratio = result["compression_ratio"]
                tasks[task_id].ai_analysis = result["ai_analysis"]
            
            logger.info(f"Image compression completed for task {task_id}")
            return {
                "success": True,
                "task_id": task_id,
                "compressed_size": result["compressed_size"],
                "compression_ratio": result["compression_ratio"]
            }
        else:
            # Handle compression failure
            if task_id in tasks:
                tasks[task_id].status = TaskStatus.FAILED
                tasks[task_id].error_message = result["error"]
            
            logger.error(f"Image compression failed for task {task_id}: {result['error']}")
            return {
                "success": False,
                "task_id": task_id,
                "error": result["error"]
            }
            
    except Exception as e:
        # Handle unexpected errors
        if task_id in tasks:
            tasks[task_id].status = TaskStatus.FAILED
            tasks[task_id].error_message = str(e)
        
        logger.error(f"Unexpected error in image compression task {task_id}: {e}")
        return {
            "success": False,
            "task_id": task_id,
            "error": str(e)
        }

@celery_app.task(bind=True)
def compress_audio(self, task_id: str, file_path: str, bitrate: float):
    """Compress an audio file asynchronously"""
    try:
        # Update task status
        if task_id in tasks:
            tasks[task_id].status = TaskStatus.PROCESSING
            tasks[task_id].progress = 10
        
        # Generate output path
        input_path = Path(file_path)
        output_path = Path("outputs") / f"compressed_{input_path.stem}.mp3"
        output_path.parent.mkdir(exist_ok=True)
        
        # Update progress
        if task_id in tasks:
            tasks[task_id].progress = 30
        
        # Compress audio
        result = compression_engine.compress_audio(
            file_path, 
            str(output_path), 
            bitrate
        )
        
        if result["success"]:
            # Update task with results
            if task_id in tasks:
                tasks[task_id].status = TaskStatus.COMPLETED
                tasks[task_id].progress = 100
                tasks[task_id].compressed_file_path = str(output_path)
                tasks[task_id].compressed_size = result["compressed_size"]
                tasks[task_id].compression_ratio = result["compression_ratio"]
                tasks[task_id].ai_analysis = result["ai_analysis"]
            
            logger.info(f"Audio compression completed for task {task_id}")
            return {
                "success": True,
                "task_id": task_id,
                "compressed_size": result["compressed_size"],
                "compression_ratio": result["compression_ratio"]
            }
        else:
            # Handle compression failure
            if task_id in tasks:
                tasks[task_id].status = TaskStatus.FAILED
                tasks[task_id].error_message = result["error"]
            
            logger.error(f"Audio compression failed for task {task_id}: {result['error']}")
            return {
                "success": False,
                "task_id": task_id,
                "error": result["error"]
            }
            
    except Exception as e:
        # Handle unexpected errors
        if task_id in tasks:
            tasks[task_id].status = TaskStatus.FAILED
            tasks[task_id].error_message = str(e)
        
        logger.error(f"Unexpected error in audio compression task {task_id}: {e}")
        return {
            "success": False,
            "task_id": task_id,
            "error": str(e)
        }

@celery_app.task(bind=True)
def compress_video(self, task_id: str, file_path: str, quality: int, adaptive_mode: bool):
    """Compress a video file asynchronously"""
    try:
        # Update task status
        if task_id in tasks:
            tasks[task_id].status = TaskStatus.PROCESSING
            tasks[task_id].progress = 10
        
        # Generate output path
        input_path = Path(file_path)
        output_path = Path("outputs") / f"compressed_{input_path.name}"
        output_path.parent.mkdir(exist_ok=True)
        
        # Update progress
        if task_id in tasks:
            tasks[task_id].progress = 30
        
        # Compress video
        result = compression_engine.compress_video(
            file_path, 
            str(output_path), 
            quality, 
            adaptive_mode
        )
        
        if result["success"]:
            # Update task with results
            if task_id in tasks:
                tasks[task_id].status = TaskStatus.COMPLETED
                tasks[task_id].progress = 100
                tasks[task_id].compressed_file_path = str(output_path)
                tasks[task_id].compressed_size = result["compressed_size"]
                tasks[task_id].compression_ratio = result["compression_ratio"]
                tasks[task_id].ai_analysis = result["ai_analysis"]
            
            logger.info(f"Video compression completed for task {task_id}")
            return {
                "success": True,
                "task_id": task_id,
                "compressed_size": result["compressed_size"],
                "compression_ratio": result["compression_ratio"]
            }
        else:
            # Handle compression failure
            if task_id in tasks:
                tasks[task_id].status = TaskStatus.FAILED
                tasks[task_id].error_message = result["error"]
            
            logger.error(f"Video compression failed for task {task_id}: {result['error']}")
            return {
                "success": False,
                "task_id": task_id,
                "error": result["error"]
            }
            
    except Exception as e:
        # Handle unexpected errors
        if task_id in tasks:
            tasks[task_id].status = TaskStatus.FAILED
            tasks[task_id].error_message = str(e)
        
        logger.error(f"Unexpected error in video compression task {task_id}: {e}")
        return {
            "success": False,
            "task_id": task_id,
            "error": str(e)
        }