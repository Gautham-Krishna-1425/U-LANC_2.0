# U-LANC: Universal Lossless-Lossy Adaptive Neural Compression

A cutting-edge AI-powered compression platform that intelligently compresses images, audio, and video while preserving important regions and maintaining optimal quality.

## 🚀 Features

- **AI-Powered Compression**: Uses state-of-the-art neural networks (CompressAI, Encodec) for superior compression
- **Adaptive Processing**: Automatically detects and preserves important regions (faces, text, etc.)
- **Multi-Format Support**: Handles images, audio, and video files
- **Real-time Processing**: Asynchronous task processing with live status updates
- **Modern Web Interface**: Built with Next.js and Tailwind CSS
- **Scalable Architecture**: FastAPI backend with Celery task queue

## 🏗️ Architecture

### Backend (FastAPI + Python)
- **AI Framework**: PyTorch with CompressAI and Encodec
- **Web Framework**: FastAPI for high-performance API
- **Task Queue**: Celery with Redis for asynchronous processing
- **Computer Vision**: OpenCV for region detection
- **Video Processing**: FFmpeg for video manipulation

### Frontend (Next.js + React)
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS for modern UI
- **File Handling**: React Dropzone for drag-and-drop uploads
- **State Management**: Custom hooks for API integration

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- Redis
- Docker (optional, for containerized deployment)

## 🛠️ Installation

### Option 1: Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone <repository-url>
cd U-LANC_2.0
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Manual Installation

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start Redis server:
```bash
redis-server
```

5. Start Celery worker (in a new terminal):
```bash
celery -A app.celery_app worker --loglevel=info
```

6. Start the API server:
```bash
uvicorn app.main:app --reload
```

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

## 🎯 Usage

### Web Interface

1. Open http://localhost:3000 in your browser
2. Select the media type (Image, Audio, or Video)
3. Upload your file using drag-and-drop or file picker
4. Adjust compression settings:
   - **Quality**: Compression level (10-100%)
   - **Adaptive Mode**: AI-powered region detection
   - **Bitrate**: Audio-specific quality setting
5. Start compression and monitor progress
6. Download the compressed file when complete

### API Usage

#### Upload Image
```bash
curl -X POST "http://localhost:8000/upload/image" \
  -F "file=@image.jpg" \
  -F "quality=80" \
  -F "adaptive_mode=true"
```

#### Upload Audio
```bash
curl -X POST "http://localhost:8000/upload/audio" \
  -F "file=@audio.wav" \
  -F "bitrate=6.0"
```

#### Upload Video
```bash
curl -X POST "http://localhost:8000/upload/video" \
  -F "file=@video.mp4" \
  -F "quality=50" \
  -F "adaptive_mode=true"
```

#### Check Task Status
```bash
curl "http://localhost:8000/task/{task_id}"
```

#### Download Result
```bash
curl "http://localhost:8000/download/{task_id}" -o compressed_file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# API Settings
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=true

# Redis Configuration
REDIS_URL=redis://localhost:6379/0

# AI Model Settings
COMPRESSAI_MODEL=bmshj2018-factorized-msssim-1
ENCODEC_MODEL=encodec_24khz

# Compression Settings
DEFAULT_IMAGE_QUALITY=80
DEFAULT_VIDEO_QUALITY=50
DEFAULT_AUDIO_BITRATE=6.0
```

### Frontend Configuration

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 🧠 AI Models

### Image Compression
- **CompressAI**: Neural image compression models
- **OpenCV**: Face and text region detection
- **Fallback**: Adaptive JPEG compression

### Audio Compression
- **Encodec**: Neural audio compression
- **FFmpeg**: Fallback audio compression

### Video Compression
- **FFmpeg**: Video processing with adaptive quality
- **OpenCV**: Frame analysis for region detection

## 📊 Performance

- **Image Compression**: 60-90% size reduction with minimal quality loss
- **Audio Compression**: 80-95% size reduction with configurable bitrates
- **Video Compression**: 70-90% size reduction with adaptive quality
- **Processing Time**: Varies by file size and complexity

## 🚀 Deployment

### Production Deployment

1. Update environment variables for production
2. Use a production WSGI server (Gunicorn)
3. Set up proper Redis configuration
4. Configure reverse proxy (Nginx)
5. Set up SSL certificates
6. Monitor with logging and metrics

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **CompressAI**: Neural image compression library
- **Meta Encodec**: Neural audio compression
- **FastAPI**: Modern Python web framework
- **Next.js**: React framework for production
- **Tailwind CSS**: Utility-first CSS framework

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the API documentation at `/docs`
- Review the troubleshooting section below

## 🔍 Troubleshooting

### Common Issues

1. **Redis Connection Error**
   - Ensure Redis is running: `redis-server`
   - Check Redis URL in environment variables

2. **AI Model Loading Issues**
   - Verify PyTorch installation
   - Check available GPU memory
   - Models will fallback to standard compression

3. **File Upload Errors**
   - Check file size limits (100MB default)
   - Verify file format support
   - Ensure sufficient disk space

4. **Frontend Connection Issues**
   - Verify API URL in environment variables
   - Check CORS configuration
   - Ensure backend is running on correct port

### Performance Optimization

1. **GPU Acceleration**
   - Install CUDA-compatible PyTorch
   - Ensure sufficient GPU memory

2. **Redis Optimization**
   - Configure Redis memory limits
   - Use Redis persistence for task recovery

3. **File Storage**
   - Use SSD storage for better I/O performance
   - Implement file cleanup policies

## 🔮 Future Enhancements

- [ ] Real-time video streaming compression
- [ ] Batch processing capabilities
- [ ] Advanced AI model fine-tuning
- [ ] Cloud storage integration
- [ ] Mobile application
- [ ] Advanced analytics dashboard
- [ ] Custom model training interface
- [ ] Multi-language support
- [ ] testing/delete later
