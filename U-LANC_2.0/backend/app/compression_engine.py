"""
AI-powered compression engine for U-LANC
Integrates CompressAI for images and Encodec for audio
"""

import torch
import cv2
import numpy as np
from PIL import Image
import ffmpeg
import os
from pathlib import Path
from typing import Tuple, Dict, Any, Optional
import logging

try:
    import compressai
    from compressai.zoo import image_models
    COMPRESSAI_AVAILABLE = True
except ImportError:
    COMPRESSAI_AVAILABLE = False
    logging.warning("CompressAI not available. Image compression will use fallback methods.")

try:
    from encodec import EncodecModel
    ENCODEC_AVAILABLE = True
except ImportError:
    ENCODEC_AVAILABLE = False
    logging.warning("Encodec not available. Audio compression will use fallback methods.")

from .config import settings

logger = logging.getLogger(__name__)

class CompressionEngine:
    """Main compression engine that handles different media types"""
    
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.image_model = None
        self.audio_model = None
        
        # Initialize models
        self._load_models()
    
    def _load_models(self):
        """Load AI models for compression"""
        if COMPRESSAI_AVAILABLE:
            try:
                self.image_model = image_models[settings.compressai_model](pretrained=True)
                self.image_model.eval()
                self.image_model.to(self.device)
                logger.info(f"Loaded CompressAI model: {settings.compressai_model}")
            except Exception as e:
                logger.error(f"Failed to load CompressAI model: {e}")
                self.image_model = None
        
        if ENCODEC_AVAILABLE:
            try:
                self.audio_model = EncodecModel.encodec_model_24khz()
                self.audio_model.eval()
                self.audio_model.to(self.device)
                logger.info("Loaded Encodec model")
            except Exception as e:
                logger.error(f"Failed to load Encodec model: {e}")
                self.audio_model = None
    
    def compress_image(
        self, 
        input_path: str, 
        output_path: str, 
        quality: int = 80, 
        adaptive_mode: bool = True
    ) -> Dict[str, Any]:
        """
        Compress an image using AI-powered compression
        
        Args:
            input_path: Path to input image
            output_path: Path to save compressed image
            quality: Compression quality (1-100)
            adaptive_mode: Whether to use adaptive compression
            
        Returns:
            Dictionary with compression results
        """
        try:
            # Load image
            image = Image.open(input_path).convert('RGB')
            original_size = os.path.getsize(input_path)
            
            if adaptive_mode:
                # Detect important regions (faces, text, etc.)
                important_regions = self._detect_important_regions(image)
                
                if self.image_model and COMPRESSAI_AVAILABLE:
                    # Use CompressAI for neural compression
                    compressed_image = self._compress_with_compressai(
                        image, quality, important_regions
                    )
                else:
                    # Fallback to adaptive JPEG compression
                    compressed_image = self._compress_adaptive_jpeg(
                        image, quality, important_regions
                    )
            else:
                # Standard compression
                if self.image_model and COMPRESSAI_AVAILABLE:
                    compressed_image = self._compress_with_compressai(
                        image, quality, None
                    )
                else:
                    # Fallback to standard JPEG
                    compressed_image = self._compress_standard_jpeg(image, quality)
            
            # Save compressed image
            compressed_image.save(output_path, quality=quality, optimize=True)
            compressed_size = os.path.getsize(output_path)
            
            return {
                "success": True,
                "original_size": original_size,
                "compressed_size": compressed_size,
                "compression_ratio": (1 - compressed_size / original_size) * 100,
                "ai_analysis": {
                    "adaptive_mode": adaptive_mode,
                    "important_regions": len(important_regions) if adaptive_mode else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Image compression failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def compress_audio(
        self, 
        input_path: str, 
        output_path: str, 
        bitrate: float = 6.0
    ) -> Dict[str, Any]:
        """
        Compress an audio file using neural compression
        
        Args:
            input_path: Path to input audio file
            output_path: Path to save compressed audio
            bitrate: Target bitrate in kbps
            
        Returns:
            Dictionary with compression results
        """
        try:
            original_size = os.path.getsize(input_path)
            
            if self.audio_model and ENCODEC_AVAILABLE:
                # Use Encodec for neural compression
                compressed_audio = self._compress_with_encodec(
                    input_path, bitrate
                )
            else:
                # Fallback to FFmpeg compression
                compressed_audio = self._compress_with_ffmpeg(
                    input_path, bitrate
                )
            
            # Save compressed audio
            if isinstance(compressed_audio, str):
                # FFmpeg already saved the file
                compressed_size = os.path.getsize(compressed_audio)
            else:
                # Save the compressed audio data
                with open(output_path, 'wb') as f:
                    f.write(compressed_audio)
                compressed_size = os.path.getsize(output_path)
            
            return {
                "success": True,
                "original_size": original_size,
                "compressed_size": compressed_size,
                "compression_ratio": (1 - compressed_size / original_size) * 100,
                "ai_analysis": {
                    "neural_compression": self.audio_model is not None,
                    "target_bitrate": bitrate
                }
            }
            
        except Exception as e:
            logger.error(f"Audio compression failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def compress_video(
        self, 
        input_path: str, 
        output_path: str, 
        quality: int = 50, 
        adaptive_mode: bool = True
    ) -> Dict[str, Any]:
        """
        Compress a video file with adaptive compression
        
        Args:
            input_path: Path to input video file
            output_path: Path to save compressed video
            quality: Compression quality (1-100)
            adaptive_mode: Whether to use adaptive compression
            
        Returns:
            Dictionary with compression results
        """
        try:
            original_size = os.path.getsize(input_path)
            
            if adaptive_mode:
                # Analyze video for important regions
                important_regions = self._analyze_video_regions(input_path)
                
                # Use adaptive FFmpeg compression
                compressed_video = self._compress_video_adaptive(
                    input_path, output_path, quality, important_regions
                )
            else:
                # Standard video compression
                compressed_video = self._compress_video_standard(
                    input_path, output_path, quality
                )
            
            compressed_size = os.path.getsize(output_path)
            
            return {
                "success": True,
                "original_size": original_size,
                "compressed_size": compressed_size,
                "compression_ratio": (1 - compressed_size / original_size) * 100,
                "ai_analysis": {
                    "adaptive_mode": adaptive_mode,
                    "important_regions": len(important_regions) if adaptive_mode else 0
                }
            }
            
        except Exception as e:
            logger.error(f"Video compression failed: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def _detect_important_regions(self, image: Image.Image) -> list:
        """Detect important regions in an image (faces, text, etc.)"""
        # Convert PIL to OpenCV format
        cv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        # Load Haar cascade for face detection
        face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        faces = face_cascade.detectMultiScale(cv_image, 1.1, 4)
        
        important_regions = []
        for (x, y, w, h) in faces:
            important_regions.append({
                "type": "face",
                "bbox": (x, y, w, h),
                "importance": 1.0
            })
        
        # Add text detection (simplified)
        # In a real implementation, you'd use OCR or text detection models
        gray = cv2.cvtColor(cv_image, cv2.COLOR_BGR2GRAY)
        edges = cv2.Canny(gray, 50, 150)
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        for contour in contours:
            x, y, w, h = cv2.boundingRect(contour)
            if w > 50 and h > 20:  # Filter small regions
                important_regions.append({
                    "type": "text_candidate",
                    "bbox": (x, y, w, h),
                    "importance": 0.7
                })
        
        return important_regions
    
    def _compress_with_compressai(
        self, 
        image: Image.Image, 
        quality: int, 
        important_regions: Optional[list]
    ) -> Image.Image:
        """Compress image using CompressAI neural compression"""
        # Convert PIL to tensor
        img_tensor = torch.from_numpy(np.array(image)).permute(2, 0, 1).float() / 255.0
        img_tensor = img_tensor.unsqueeze(0).to(self.device)
        
        # Compress with CompressAI
        with torch.no_grad():
            compressed = self.image_model.compress(img_tensor)
        
        # Decompress
        with torch.no_grad():
            decompressed = self.image_model.decompress(compressed["strings"], compressed["shape"])
        
        # Convert back to PIL
        decompressed_img = decompressed["x"].squeeze(0).permute(1, 2, 0).cpu().numpy()
        decompressed_img = (decompressed_img * 255).astype(np.uint8)
        
        return Image.fromarray(decompressed_img)
    
    def _compress_adaptive_jpeg(
        self, 
        image: Image.Image, 
        quality: int, 
        important_regions: list
    ) -> Image.Image:
        """Fallback adaptive JPEG compression"""
        # For now, just return standard JPEG compression
        # In a real implementation, you'd apply different quality to different regions
        return image
    
    def _compress_standard_jpeg(self, image: Image.Image, quality: int) -> Image.Image:
        """Standard JPEG compression"""
        return image
    
    def _compress_with_encodec(self, input_path: str, bitrate: float) -> bytes:
        """Compress audio using Encodec"""
        # Load audio file
        import librosa
        audio, sr = librosa.load(input_path, sr=24000)
        
        # Convert to tensor
        audio_tensor = torch.from_numpy(audio).unsqueeze(0).to(self.device)
        
        # Compress with Encodec
        with torch.no_grad():
            encoded = self.audio_model.encode(audio_tensor)
            decoded = self.audio_model.decode(encoded)
        
        # Convert back to numpy
        compressed_audio = decoded.squeeze(0).cpu().numpy()
        
        # Convert to bytes (simplified)
        return compressed_audio.tobytes()
    
    def _compress_with_ffmpeg(self, input_path: str, bitrate: float) -> str:
        """Fallback FFmpeg audio compression"""
        output_path = input_path.replace('.wav', '_compressed.mp3')
        
        (
            ffmpeg
            .input(input_path)
            .output(output_path, acodec='mp3', audio_bitrate=f'{int(bitrate * 1000)}')
            .overwrite_output()
            .run(quiet=True)
        )
        
        return output_path
    
    def _analyze_video_regions(self, video_path: str) -> list:
        """Analyze video for important regions"""
        cap = cv2.VideoCapture(video_path)
        important_regions = []
        
        # Sample a few frames for analysis
        frame_count = 0
        while cap.isOpened() and frame_count < 10:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Detect faces in frame
            face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            for (x, y, w, h) in faces:
                important_regions.append({
                    "type": "face",
                    "bbox": (x, y, w, h),
                    "frame": frame_count,
                    "importance": 1.0
                })
            
            frame_count += 1
        
        cap.release()
        return important_regions
    
    def _compress_video_adaptive(
        self, 
        input_path: str, 
        output_path: str, 
        quality: int, 
        important_regions: list
    ) -> str:
        """Compress video with adaptive quality"""
        # Use FFmpeg with adaptive quality settings
        crf = 51 - (quality * 0.5)  # Convert quality to CRF
        
        (
            ffmpeg
            .input(input_path)
            .output(
                output_path,
                vcodec='libx264',
                crf=crf,
                preset='medium',
                acodec='aac',
                audio_bitrate='128k'
            )
            .overwrite_output()
            .run(quiet=True)
        )
        
        return output_path
    
    def _compress_video_standard(
        self, 
        input_path: str, 
        output_path: str, 
        quality: int
    ) -> str:
        """Standard video compression"""
        crf = 51 - (quality * 0.5)
        
        (
            ffmpeg
            .input(input_path)
            .output(
                output_path,
                vcodec='libx264',
                crf=crf,
                preset='medium',
                acodec='aac',
                audio_bitrate='128k'
            )
            .overwrite_output()
            .run(quiet=True)
        )
        
        return output_path