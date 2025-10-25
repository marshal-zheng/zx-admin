@echo off
chcp 65001 >nul
title Evaluation System

REM Project path configuration - Please modify this variable according to actual deployment path
set "PROJECT_PATH=D:\HQ\evaluate-system"

REM Check if project directory exists
if not exist "%PROJECT_PATH%" (
    echo Error: Project directory does not exist: %PROJECT_PATH%
    echo Please modify PROJECT_PATH variable in this script
    pause
    exit /b 1
)

REM Switch to project directory
cd /d "%PROJECT_PATH%"

REM Check if package.json exists
if not exist "package.json" (
    echo Error: package.json not found in project directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Start development server
echo Starting development server...
npm run dev

REM If startup fails, pause to view error information
if errorlevel 1 (
    echo.
    echo Error: Failed to start development server
    pause
)