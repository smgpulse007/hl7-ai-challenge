@echo off
echo.
echo HL7 AI Challenge Submission PDF Converter
echo ==========================================
echo.

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo PowerShell not found. Please install PowerShell.
    pause
    exit /b 1
)

REM Run the PowerShell script
echo Running PDF conversion script...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0convert_to_pdf.ps1"

echo.
echo Conversion process completed.
echo Check the deliverables folder for output files.
echo.
pause
