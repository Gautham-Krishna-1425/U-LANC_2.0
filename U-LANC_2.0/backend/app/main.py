"""
U-LANC Backend API
Universal Lossless-Lossy Adaptive Neural Compression
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
import os
from pathlib import Path
import uuid
from typing import Dict, Any
import asyncio

from .models import CompressionTask, TaskStatus
from .compression_engine import CompressionEngine
from .celery_app import celery_app
from .config import settings

app = FastAPI(
    title="U-LANC API",
    description="Universal Lossless-Lossy Adaptive Neural Compression API",
    version="2.0.0"
)

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize compression engine
compression_engine = CompressionEngine()

# In-memory task storage (in production, use Redis or database)
tasks: Dict[str, CompressionTask] = {}

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "U-LANC API is running", "version": "2.0.0"}

@app.post("/upload/image")
async def upload_image(
    file: UploadFile = File(...),
    quality: int = 80,
    adaptive_mode: bool = True
):
    """Upload and compress an image"""
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Generate unique task ID
    task_id = str(uuid.uuid4())
    
    # Save uploaded file
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    
    file_path = upload_dir / f"{task_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create task
    task = CompressionTask(
        id=task_id,
        file_type="image",
        original_filename=file.filename,
        original_size=len(content),
        file_path=str(file_path),
        quality=quality,
        adaptive_mode=adaptive_mode,
        status=TaskStatus.PROCESSING
    )
    
    tasks[task_id] = task
    
    # Start compression task
    compression_task = celery_app.send_task(
        'compress_image',
        args=[task_id, str(file_path), quality, adaptive_mode]
    )
    
    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Image compression started"
    }

@app.post("/upload/audio")
async def upload_audio(
    file: UploadFile = File(...),
    bitrate: float = 6.0
):
    """Upload and compress an audio file"""
    if not file.content_type.startswith('audio/'):
        raise HTTPException(status_code=400, detail="File must be an audio file")
    
    # Generate unique task ID
    task_id = str(uuid.uuid4())
    
    # Save uploaded file
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    
    file_path = upload_dir / f"{task_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create task
    task = CompressionTask(
        id=task_id,
        file_type="audio",
        original_filename=file.filename,
        original_size=len(content),
        file_path=str(file_path),
        bitrate=bitrate,
        status=TaskStatus.PROCESSING
    )
    
    tasks[task_id] = task
    
    # Start compression task
    compression_task = celery_app.send_task(
        'compress_audio',
        args=[task_id, str(file_path), bitrate]
    )
    
    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Audio compression started"
    }

@app.post("/upload/video")
async def upload_video(
    file: UploadFile = File(...),
    quality: int = 50,
    adaptive_mode: bool = True
):
    """Upload and compress a video file"""
    if not file.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="File must be a video file")
    
    # Generate unique task ID
    task_id = str(uuid.uuid4())
    
    # Save uploaded file
    upload_dir = Path("uploads")
    upload_dir.mkdir(exist_ok=True)
    
    file_path = upload_dir / f"{task_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    # Create task
    task = CompressionTask(
        id=task_id,
        file_type="video",
        original_filename=file.filename,
        original_size=len(content),
        file_path=str(file_path),
        quality=quality,
        adaptive_mode=adaptive_mode,
        status=TaskStatus.PROCESSING
    )
    
    tasks[task_id] = task
    
    # Start compression task
    compression_task = celery_app.send_task(
        'compress_video',
        args=[task_id, str(file_path), quality, adaptive_mode]
    )
    
    return {
        "task_id": task_id,
        "status": "processing",
        "message": "Video compression started"
    }

@app.get("/task/{task_id}")
async def get_task_status(task_id: str):
    """Get the status of a compression task"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    return {
        "task_id": task_id,
        "status": task.status.value,
        "progress": task.progress,
        "original_size": task.original_size,
        "compressed_size": task.compressed_size,
        "compression_ratio": task.compression_ratio,
        "download_url": f"/download/{task_id}" if task.status == TaskStatus.COMPLETED else None,
        "error": task.error_message
    }

@app.get("/download/{task_id}")
async def download_compressed_file(task_id: str):
    """Download the compressed file"""
    if task_id not in tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = tasks[task_id]
    if task.status != TaskStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Task not completed")
    
    if not task.compressed_file_path or not os.path.exists(task.compressed_file_path):
        raise HTTPException(status_code=404, detail="Compressed file not found")
    
    from fastapi.responses import FileResponse
    return FileResponse(
        task.compressed_file_path,
        filename=f"compressed_{task.original_filename}",
        media_type='application/octet-stream'
    )

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )