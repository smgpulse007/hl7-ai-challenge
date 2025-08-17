#!/usr/bin/env python3
"""
PDF Conversion Script for HL7 AI Challenge Submission
Converts markdown to properly formatted PDF with page limits and styling
"""

import subprocess
import sys
import os
from pathlib import Path

def install_pandoc():
    """Instructions for installing Pandoc"""
    print("""
    To convert to PDF, you need to install Pandoc and LaTeX:
    
    1. Install Pandoc:
       - Windows: Download from https://pandoc.org/installing.html
       - Or use: winget install pandoc
    
    2. Install LaTeX (for PDF generation):
       - Windows: Install MiKTeX from https://miktex.org/download
       - Or use: winget install MiKTeX.MiKTeX
    
    3. After installation, restart your terminal and run this script again.
    """)

def check_dependencies():
    """Check if required tools are installed"""
    try:
        subprocess.run(['pandoc', '--version'], capture_output=True, check=True)
        print("✅ Pandoc found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ Pandoc not found")
        install_pandoc()
        return False
    
    try:
        subprocess.run(['pdflatex', '--version'], capture_output=True, check=True)
        print("✅ LaTeX found")
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("❌ LaTeX not found")
        install_pandoc()
        return False
    
    return True

def create_latex_template():
    """Create a custom LaTeX template for proper formatting"""
    template_content = r"""
\documentclass[11pt,letterpaper]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage{lmodern}
\usepackage{microtype}
\usepackage[margin=1in]{geometry}
\usepackage{xcolor}
\usepackage{fancyhdr}
\usepackage{titlesec}
\usepackage{enumitem}
\usepackage{graphicx}
\usepackage{hyperref}
\usepackage{booktabs}
\usepackage{longtable}
\usepackage{array}
\usepackage{multirow}
\usepackage{wrapfig}
\usepackage{float}
\usepackage{colortbl}
\usepackage{pdflscape}
\usepackage{tabu}
\usepackage{threeparttable}
\usepackage{threeparttablex}
\usepackage[normalem]{ulem}
\usepackage{makecell}

% Color definitions
\definecolor{primaryblue}{RGB}{0,102,204}
\definecolor{secondarygreen}{RGB}{0,166,81}
\definecolor{accentorange}{RGB}{255,107,53}

% Header and footer
\pagestyle{fancy}
\fancyhf{}
\fancyhead[L]{\textcolor{primaryblue}{\textbf{AI-Powered HEDIS Care Gap Closure Platform}}}
\fancyhead[R]{\textcolor{secondarygreen}{\textbf{HL7 AI Challenge 2025}}}
\fancyfoot[C]{\thepage}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0.4pt}

% Title formatting
\titleformat{\section}
  {\Large\bfseries\color{primaryblue}}
  {\thesection}{1em}{}

\titleformat{\subsection}
  {\large\bfseries\color{secondarygreen}}
  {\thesubsection}{1em}{}

\titleformat{\subsubsection}
  {\normalsize\bfseries\color{accentorange}}
  {\thesubsubsection}{1em}{}

% Hyperlink colors
\hypersetup{
    colorlinks=true,
    linkcolor=primaryblue,
    filecolor=primaryblue,
    urlcolor=primaryblue,
    citecolor=primaryblue
}

% List formatting
\setlist[itemize]{leftmargin=*,topsep=0pt,itemsep=2pt}
\setlist[enumerate]{leftmargin=*,topsep=0pt,itemsep=2pt}

% Paragraph spacing
\setlength{\parskip}{6pt}
\setlength{\parindent}{0pt}

% Table formatting
\renewcommand{\arraystretch}{1.2}

\begin{document}

$body$

\end{document}
"""
    
    template_path = Path("deliverables/latex_template.tex")
    with open(template_path, 'w', encoding='utf-8') as f:
        f.write(template_content)
    
    return template_path

def convert_to_pdf():
    """Convert markdown to PDF with proper formatting"""
    
    if not check_dependencies():
        return False
    
    # Create custom LaTeX template
    template_path = create_latex_template()
    
    # Input and output paths
    input_file = Path("deliverables/HL7_AI_Challenge_Submission.md")
    output_file = Path("deliverables/HL7_AI_Challenge_Submission.pdf")
    
    if not input_file.exists():
        print(f"❌ Input file not found: {input_file}")
        return False
    
    # Pandoc command with proper options
    pandoc_cmd = [
        'pandoc',
        str(input_file),
        '-o', str(output_file),
        '--template', str(template_path),
        '--pdf-engine=pdflatex',
        '--variable', 'geometry:margin=1in',
        '--variable', 'fontsize=11pt',
        '--variable', 'linestretch=1.15',
        '--variable', 'mainfont=Latin Modern Roman',
        '--variable', 'sansfont=Latin Modern Sans',
        '--variable', 'monofont=Latin Modern Mono',
        '--highlight-style=tango',
        '--toc',
        '--toc-depth=2',
        '--number-sections',
        '--standalone',
        '--filter', 'pandoc-crossref',
        '--citeproc'
    ]
    
    try:
        print("🔄 Converting markdown to PDF...")
        result = subprocess.run(pandoc_cmd, capture_output=True, text=True, check=True)
        print(f"✅ PDF created successfully: {output_file}")
        print(f"📄 File size: {output_file.stat().st_size / 1024:.1f} KB")
        
        # Check page count (approximate)
        try:
            page_check = subprocess.run(['pdfinfo', str(output_file)], capture_output=True, text=True)
            if page_check.returncode == 0:
                for line in page_check.stdout.split('\n'):
                    if 'Pages:' in line:
                        pages = line.split(':')[1].strip()
                        print(f"📖 Estimated pages: {pages}")
                        if int(pages) > 10:
                            print("⚠️  Warning: Document exceeds 10-page limit!")
        except:
            print("📖 Page count check not available")
        
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ PDF conversion failed:")
        print(f"Error: {e.stderr}")
        print("\nTroubleshooting tips:")
        print("1. Ensure all LaTeX packages are installed")
        print("2. Try running: tlmgr update --self && tlmgr update --all")
        print("3. Check for special characters or formatting issues")
        return False

def create_alternative_html():
    """Create HTML version as alternative if PDF fails"""
    input_file = Path("deliverables/HL7_AI_Challenge_Submission.md")
    output_file = Path("deliverables/HL7_AI_Challenge_Submission.html")
    
    html_cmd = [
        'pandoc',
        str(input_file),
        '-o', str(output_file),
        '--standalone',
        '--toc',
        '--toc-depth=2',
        '--number-sections',
        '--highlight-style=tango',
        '--css', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
        '--metadata', 'title=AI-Powered HEDIS Care Gap Closure Platform'
    ]
    
    try:
        subprocess.run(html_cmd, capture_output=True, check=True)
        print(f"✅ HTML version created: {output_file}")
        print("💡 You can print this HTML to PDF from your browser")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ HTML conversion also failed: {e}")
        return False

if __name__ == "__main__":
    print("🚀 HL7 AI Challenge Submission PDF Converter")
    print("=" * 50)
    
    # Try PDF conversion first
    if convert_to_pdf():
        print("\n🎉 PDF conversion successful!")
        print("\nNext steps:")
        print("1. Review the PDF for formatting")
        print("2. Ensure it's under 10 pages")
        print("3. Check that all diagrams are readable")
    else:
        print("\n🔄 Trying HTML alternative...")
        if create_alternative_html():
            print("\n💡 HTML created successfully!")
            print("You can:")
            print("1. Open the HTML file in a browser")
            print("2. Print to PDF with proper page breaks")
            print("3. Adjust margins and scaling as needed")
        else:
            print("\n❌ Both conversions failed")
            print("Manual options:")
            print("1. Copy content to Word/Google Docs")
            print("2. Use online markdown to PDF converters")
            print("3. Install Pandoc and LaTeX manually")
