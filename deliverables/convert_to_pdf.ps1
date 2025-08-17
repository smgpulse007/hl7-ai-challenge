# HL7 AI Challenge Submission PDF Converter
# PowerShell script for Windows

Write-Host "🚀 HL7 AI Challenge Submission PDF Converter" -ForegroundColor Cyan
Write-Host "=" * 50

# Check if Pandoc is installed
function Test-Pandoc {
    try {
        $pandocVersion = pandoc --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Pandoc found" -ForegroundColor Green
            return $true
        }
    }
    catch {
        Write-Host "❌ Pandoc not found" -ForegroundColor Red
        return $false
    }
    return $false
}

# Install Pandoc using winget
function Install-Pandoc {
    Write-Host "📦 Installing Pandoc..." -ForegroundColor Yellow
    try {
        winget install --id=JohnMacFarlane.Pandoc -e --silent
        Write-Host "✅ Pandoc installed successfully" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ Failed to install Pandoc automatically" -ForegroundColor Red
        Write-Host "Please install manually from: https://pandoc.org/installing.html" -ForegroundColor Yellow
        return $false
    }
}

# Convert using simple HTML to PDF method
function Convert-MarkdownToHTML {
    $inputFile = "deliverables/HL7_AI_Challenge_Submission.md"
    $outputFile = "deliverables/HL7_AI_Challenge_Submission.html"
    
    if (-not (Test-Path $inputFile)) {
        Write-Host "❌ Input file not found: $inputFile" -ForegroundColor Red
        return $false
    }
    
    # Create HTML with embedded CSS for better formatting
    $htmlTemplate = @"
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>AI-Powered HEDIS Care Gap Closure Platform - HL7 AI Challenge 2025</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 1in;
            color: #333;
        }
        h1 {
            color: #0066CC;
            border-bottom: 3px solid #0066CC;
            padding-bottom: 10px;
        }
        h2 {
            color: #00A651;
            border-bottom: 2px solid #00A651;
            padding-bottom: 5px;
            margin-top: 30px;
        }
        h3 {
            color: #FF6B35;
            margin-top: 25px;
        }
        h4 {
            color: #8B5CF6;
            margin-top: 20px;
        }
        .page-break {
            page-break-before: always;
        }
        .no-break {
            page-break-inside: avoid;
        }
        code {
            background-color: #f4f4f4;
            padding: 2px 4px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        pre {
            background-color: #f8f8f8;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            overflow-x: auto;
        }
        blockquote {
            border-left: 4px solid #0066CC;
            margin: 0;
            padding-left: 20px;
            font-style: italic;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 15px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 0.9em;
            color: #666;
        }
        @media print {
            body { margin: 0.5in; }
            .page-break { page-break-before: always; }
            .no-break { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
"@
    
    try {
        # Convert markdown to HTML
        $pandocCmd = "pandoc `"$inputFile`" -t html --standalone --toc --toc-depth=2 --number-sections"
        $htmlContent = Invoke-Expression $pandocCmd
        
        # Combine template with content
        $fullHtml = $htmlTemplate + $htmlContent + "</body></html>"
        
        # Write to file
        $fullHtml | Out-File -FilePath $outputFile -Encoding UTF8
        
        Write-Host "✅ HTML created: $outputFile" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ HTML conversion failed: $_" -ForegroundColor Red
        return $false
    }
}

# Main conversion function
function Convert-ToPDF {
    # Check for Pandoc
    if (-not (Test-Pandoc)) {
        Write-Host "📦 Attempting to install Pandoc..." -ForegroundColor Yellow
        if (-not (Install-Pandoc)) {
            return $false
        }
        # Refresh PATH
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
    }
    
    # Try HTML conversion first (more reliable)
    if (Convert-MarkdownToHTML) {
        Write-Host ""
        Write-Host "🎉 HTML conversion successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Next steps to create PDF:" -ForegroundColor Cyan
        Write-Host "1. Open deliverables/HL7_AI_Challenge_Submission.html in Chrome/Edge" -ForegroundColor White
        Write-Host "2. Press Ctrl+P to print" -ForegroundColor White
        Write-Host "3. Select 'Save as PDF' as destination" -ForegroundColor White
        Write-Host "4. In 'More settings':" -ForegroundColor White
        Write-Host "   - Paper size: Letter" -ForegroundColor White
        Write-Host "   - Margins: Default" -ForegroundColor White
        Write-Host "   - Scale: 100%" -ForegroundColor White
        Write-Host "   - Options: ✓ Headers and footers, ✓ Background graphics" -ForegroundColor White
        Write-Host "5. Click 'Save' and name it 'HL7_AI_Challenge_Submission.pdf'" -ForegroundColor White
        Write-Host ""
        Write-Host "💡 This method gives you the best formatting control!" -ForegroundColor Yellow
        
        # Try to open the HTML file
        try {
            Start-Process "deliverables/HL7_AI_Challenge_Submission.html"
            Write-Host "🌐 Opening HTML file in default browser..." -ForegroundColor Green
        }
        catch {
            Write-Host "📁 HTML file location: $(Get-Location)/deliverables/HL7_AI_Challenge_Submission.html" -ForegroundColor Yellow
        }
        
        return $true
    }
    
    return $false
}

# Alternative method using Word (if available)
function Convert-UsingWord {
    Write-Host ""
    Write-Host "📝 Alternative: Using Microsoft Word" -ForegroundColor Cyan
    Write-Host "1. Copy content from deliverables/HL7_AI_Challenge_Submission.md" -ForegroundColor White
    Write-Host "2. Paste into Word" -ForegroundColor White
    Write-Host "3. Apply heading styles (Heading 1, 2, 3)" -ForegroundColor White
    Write-Host "4. Insert page breaks where needed" -ForegroundColor White
    Write-Host "5. Save as PDF" -ForegroundColor White
}

# Run the conversion
if (Convert-ToPDF) {
    Write-Host ""
    Write-Host "✅ Conversion process completed!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Automatic conversion failed" -ForegroundColor Red
    Convert-UsingWord
    Write-Host ""
    Write-Host "🌐 Online alternatives:" -ForegroundColor Cyan
    Write-Host "- https://pandoc.org/try/" -ForegroundColor White
    Write-Host "- https://dillinger.io/" -ForegroundColor White
    Write-Host "- https://markdowntopdf.com/" -ForegroundColor White
}

Write-Host ""
Write-Host "📄 Remember: Final PDF should be ≤10 pages!" -ForegroundColor Yellow
Write-Host "🔍 Check that all formatting, headings, and content are preserved" -ForegroundColor Yellow
