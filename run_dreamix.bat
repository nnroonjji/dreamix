@echo off
title 🚀 Launching Dreamix (Stable Diffusion + Ollama + Flask + React)

:: 0. Stable Diffusion 실행
echo [0/4] Launching Stable Diffusion (AUTOMATIC1111)...
start "" /min cmd /c "cd /d C:\Users\rkdmf\stable-diffusion-webui && webui-user.bat"

:: 1. Ollama 실행
echo [1/4] Starting Ollama model (mistral)...
start "" /min cmd /c "ollama run mistral"

:: 2. Flask 백엔드 실행
echo [2/4] Starting Flask backend (app.py)...
start "" /min cmd /c "python app.py"

:: 3. React 프론트엔드 실행 (포트 지정)
echo [3/4] Starting React frontend on port 3001...
set PORT=3001
npm start