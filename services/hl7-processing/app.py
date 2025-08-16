"""
HL7 Processing Service - HEDIS AI Platform
Processes HL7 messages with NER + RAG for clinical evidence extraction
Based on existing Layer 1 extraction engine
"""

import os
import sys
import logging
import json
import base64
import tempfile
from typing import Dict, Any, Optional, List
from datetime import datetime

# Add shared modules to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'shared'))

from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# NLP and PDF processing
import spacy
from spacy.matcher import Matcher
import PyPDF2
from langchain_community.llms import Ollama

# Shared modules
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))

try:
    from shared.config import config
    from shared.rabbitmq_client import MessageConsumer, MessagePublisher
except ImportError:
    # Fallback for Docker environment
    sys.path.append('/app')
    from shared.config import config
    from shared.rabbitmq_client import MessageConsumer, MessagePublisher

# Local modules
from fhir_processor import FHIRProcessor

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="HL7 Processing Service",
    description="Processes HL7 messages with NER + RAG for clinical evidence extraction",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class HL7Processor:
    """Main HL7 processing class with NER and RAG capabilities"""
    
    def __init__(self):
        self.nlp = None
        self.matcher = None
        self.llm = None
        self.publisher = None
        self.consumer = None
        self.setup_nlp_models()
        # Don't setup messaging on init - do it later to avoid blocking
        self.publisher = None
        self.consumer = None
    
    def setup_nlp_models(self):
        """Initialize NLP models and patterns"""
        try:
            # Load spaCy model
            self.nlp = spacy.load("en_core_web_sm")
            self.matcher = Matcher(self.nlp.vocab)
            
            # Define CCS patterns (from your notebook)
            ccs_patterns = [
                [{"LOWER": "pap"}],
                [{"LOWER": "cytology"}],
                [{"LOWER": "hpv"}],
                [{"LOWER": "hrhpv"}],
                [{"LOWER": "cervical"}, {"LOWER": "cancer"}],
                [{"LOWER": "papsmear"}],
                [{"LOWER": "hysterectomy"}]
            ]
            self.matcher.add("CCS_Keywords", ccs_patterns)
            
            # Define COL patterns
            col_patterns = [
                [{"LOWER": "colonoscopy"}],
                [{"LOWER": "colon"}, {"LOWER": "cancer"}],
                [{"LOWER": "colorectal"}],
                [{"LOWER": "sigmoidoscopy"}],
                [{"LOWER": "fit"}, {"LOWER": "test"}],
                [{"LOWER": "cologuard"}]
            ]
            self.matcher.add("COL_Keywords", col_patterns)
            
            # Initialize Llama3 for RAG
            self.llm = Ollama(model="llama3")
            
            logger.info("NLP models initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize NLP models: {e}")
            raise
    
    def setup_messaging(self):
        """Initialize RabbitMQ connections"""
        try:
            self.publisher = MessagePublisher()
            self.consumer = MessageConsumer("hl7-processing")
            logger.info("RabbitMQ connections initialized")
        except Exception as e:
            logger.error(f"Failed to initialize messaging: {e}")
            # Don't raise - continue without RabbitMQ for testing
            self.publisher = None
            self.consumer = None
            logger.warning("Continuing without RabbitMQ connections")
    
    def extract_pdf_from_hl7(self, hl7_message: str) -> Optional[str]:
        """Extract PDF content from HL7 message (based on your notebook logic)"""
        try:
            # Look for base64 encoded PDF (JVBER pattern)
            if ('base64' in hl7_message) or ('Base64' in hl7_message) or ('BASE64' in hl7_message):
                # Split by ^ and look for JVBER
                for segment in hl7_message.split("^"):
                    if segment.startswith("JVBER"):
                        pdf_data = segment.split("|")[0]
                        return self._decode_and_extract_pdf_text(pdf_data)
            else:
                # Split by | and look for JVBER
                for segment in hl7_message.split("|"):
                    if segment.startswith("JVBER"):
                        pdf_data = segment.split("\\r")[0]
                        return self._decode_and_extract_pdf_text(pdf_data)
            
            return None
            
        except Exception as e:
            logger.error(f"Error extracting PDF from HL7: {e}")
            return None
    
    def _decode_and_extract_pdf_text(self, pdf_base64: str) -> Optional[str]:
        """Decode base64 PDF and extract text"""
        try:
            # Decode base64
            pdf_bytes = base64.b64decode(pdf_base64, validate=True)
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(pdf_bytes)
                temp_file_path = temp_file.name
            
            # Extract text from PDF
            text_content = self._extract_text_from_pdf(temp_file_path)
            
            # Clean up temporary file
            os.unlink(temp_file_path)
            
            return text_content
            
        except Exception as e:
            logger.error(f"Error decoding PDF: {e}")
            return None
    
    def _extract_text_from_pdf(self, pdf_path: str) -> str:
        """Extract text from PDF file (based on your notebook logic)"""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                
                # Combine all pages
                all_pages = []
                for page in pdf_reader.pages:
                    all_pages.append(page.extract_text())
                
                # Join all pages and clean
                all_text = "\n".join(all_pages)
                cleaned_text = all_text.replace('•', ' ')
                
                return cleaned_text
                
        except Exception as e:
            logger.error(f"Error extracting text from PDF: {e}")
            return ""
    
    def run_ner_extraction(self, text: str) -> Dict[str, List[str]]:
        """Run NER extraction on text (based on your notebook logic)"""
        try:
            results = {"ccs_matches": [], "col_matches": [], "matched_lines": []}
            
            # Split text into lines
            lines = text.split('\n')
            
            for i, line in enumerate(lines):
                if not line.strip():
                    continue
                
                # Process line with spaCy
                doc = self.nlp(line)
                matches = self.matcher(doc)
                
                if matches:
                    # Get the matched text and context
                    matched_line = line.strip()
                    context_line = lines[i + 1].strip() if i + 1 < len(lines) else ""
                    
                    combined_text = f"{matched_line} {context_line}".strip()
                    results["matched_lines"].append(combined_text)
                    
                    # Categorize matches
                    for match_id, start, end in matches:
                        label = self.nlp.vocab.strings[match_id]
                        if label == "CCS_Keywords":
                            results["ccs_matches"].append(combined_text)
                        elif label == "COL_Keywords":
                            results["col_matches"].append(combined_text)
            
            return results
            
        except Exception as e:
            logger.error(f"Error in NER extraction: {e}")
            return {"ccs_matches": [], "col_matches": [], "matched_lines": []}
    
    def run_rag_validation(self, matched_text: str, measure_type: str) -> str:
        """Run RAG validation using Llama3 (based on your notebook logic)"""
        try:
            if measure_type.upper() == "CCS":
                rule = 'Please use one sentence to summarize when this patient had pap smear and the result. If no pap smear was done, just say "No pap smear was done". y/o means years ago.'
            elif measure_type.upper() == "COL":
                rule = 'Please use one sentence to summarize when this patient had colonoscopy. If no colonoscopy was done, just say "No colonoscopy was done". y/o means years ago.'
            else:
                rule = 'Please summarize the clinical evidence in this text in one sentence.'
            
            prompt = f"{rule} {matched_text}"
            result = self.llm.invoke(prompt)
            
            return result.strip()
            
        except Exception as e:
            logger.error(f"Error in RAG validation: {e}")
            return "Error processing clinical evidence"
    
    def process_hl7_message(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """Main processing function for HL7 messages"""
        try:
            # Extract message details
            message_id = message_data.get('id', 'unknown')
            hl7_content = message_data.get('data', {}).get('message', '')
            member_id = message_data.get('data', {}).get('member_id', '')
            message_type = message_data.get('data', {}).get('message_type', '')
            
            logger.info(f"Processing HL7 message {message_id} for member {member_id}")
            
            # Step 1: Extract PDF from HL7 message
            pdf_text = self.extract_pdf_from_hl7(hl7_content)
            if not pdf_text:
                logger.warning(f"No PDF content found in message {message_id}")
                return self._create_no_evidence_result(message_data)
            
            # Step 2: Run NER extraction
            ner_results = self.run_ner_extraction(pdf_text)
            
            if not ner_results["matched_lines"]:
                logger.info(f"No clinical keywords found in message {message_id}")
                return self._create_no_evidence_result(message_data)
            
            # Step 3: Run RAG validation for each type of match
            rag_results = {}
            
            if ner_results["ccs_matches"]:
                combined_ccs_text = " ".join(ner_results["ccs_matches"])
                rag_results["ccs_evidence"] = self.run_rag_validation(combined_ccs_text, "CCS")
            
            if ner_results["col_matches"]:
                combined_col_text = " ".join(ner_results["col_matches"])
                rag_results["col_evidence"] = self.run_rag_validation(combined_col_text, "COL")
            
            # Create result
            result = {
                "message_id": message_id,
                "member_id": member_id,
                "message_type": message_type,
                "processing_timestamp": datetime.utcnow().isoformat(),
                "pdf_extracted": True,
                "ner_results": ner_results,
                "rag_results": rag_results,
                "evidence_found": len(rag_results) > 0,
                "measures_detected": list(rag_results.keys())
            }
            
            logger.info(f"Successfully processed message {message_id}: {len(rag_results)} evidence types found")
            return result
            
        except Exception as e:
            logger.error(f"Error processing HL7 message: {e}")
            return self._create_error_result(message_data, str(e))
    
    def _create_no_evidence_result(self, message_data: Dict[str, Any]) -> Dict[str, Any]:
        """Create result for messages with no evidence"""
        return {
            "message_id": message_data.get('id', 'unknown'),
            "member_id": message_data.get('data', {}).get('member_id', ''),
            "message_type": message_data.get('data', {}).get('message_type', ''),
            "processing_timestamp": datetime.utcnow().isoformat(),
            "pdf_extracted": False,
            "ner_results": {"ccs_matches": [], "col_matches": [], "matched_lines": []},
            "rag_results": {},
            "evidence_found": False,
            "measures_detected": []
        }
    
    def _create_error_result(self, message_data: Dict[str, Any], error_msg: str) -> Dict[str, Any]:
        """Create result for processing errors"""
        return {
            "message_id": message_data.get('id', 'unknown'),
            "member_id": message_data.get('data', {}).get('member_id', ''),
            "message_type": message_data.get('data', {}).get('message_type', ''),
            "processing_timestamp": datetime.utcnow().isoformat(),
            "error": error_msg,
            "evidence_found": False,
            "measures_detected": []
        }


# Global processor instances
processor = HL7Processor()
fhir_processor = FHIRProcessor()


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "hl7-processing",
        "timestamp": datetime.utcnow().isoformat(),
        "nlp_models_loaded": processor.nlp is not None and processor.llm is not None
    }


@app.post("/process")
async def process_hl7_message(message_data: Dict[str, Any]):
    """Process a single HL7 message (for testing)"""
    try:
        result = processor.process_hl7_message(message_data)
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Error in process endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process-fhir")
async def process_fhir_resource(fhir_resource: Dict[str, Any]):
    """Process a FHIR R4 resource"""
    try:
        result = fhir_processor.process_fhir_resource(fhir_resource)
        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Error in FHIR process endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/process-unified")
async def process_unified_input(input_data: Dict[str, Any]):
    """Process either HL7 v2.x or FHIR R4 input automatically"""
    try:
        # Detect input type
        if 'resourceType' in input_data:
            # FHIR R4 resource
            result = fhir_processor.process_fhir_resource(input_data)
            result['input_detected'] = 'FHIR_R4'
        else:
            # HL7 v2.x message
            result = processor.process_hl7_message(input_data)
            result['input_detected'] = 'HL7_v2x'

        return {"success": True, "result": result}
    except Exception as e:
        logger.error(f"Error in unified process endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def message_callback(message: Dict[str, Any]) -> bool:
    """Callback function for RabbitMQ message processing"""
    try:
        # Process the HL7 message
        result = processor.process_hl7_message(message)

        # Publish result to risk prediction service (if publisher available)
        if processor.publisher:
            success = processor.publisher.publish_processed_hl7(result)

            if success:
                logger.info(f"Successfully processed and published message {result['message_id']}")
                return True
            else:
                logger.error(f"Failed to publish processed message {result['message_id']}")
                return False
        else:
            logger.info(f"Successfully processed message {result['message_id']} (no publisher available)")
            return True

    except Exception as e:
        logger.error(f"Error in message callback: {e}")
        return False


@app.on_event("startup")
async def startup_event():
    """Initialize service on startup"""
    logger.info("Starting HL7 Processing Service...")

    # Try RabbitMQ connection in background (non-blocking)
    try:
        processor.setup_messaging()
        logger.info("RabbitMQ setup attempted")
    except Exception as e:
        logger.error(f"RabbitMQ setup failed: {e}")
        logger.info("Service will continue in API-only mode")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down HL7 Processing Service...")
    if processor.publisher:
        processor.publisher.close()
    if processor.consumer:
        processor.consumer.close()


def start_consumer():
    """Start RabbitMQ consumer in background"""
    if processor.consumer:
        logger.info("Starting RabbitMQ consumer for HL7 messages...")
        processor.consumer.consume_hl7_messages(message_callback)
    else:
        logger.warning("No RabbitMQ consumer available - running in API-only mode")


if __name__ == "__main__":
    import threading
    
    # Start consumer in background thread
    consumer_thread = threading.Thread(target=start_consumer, daemon=True)
    consumer_thread.start()
    
    # Start FastAPI server
    service_config = config.get_service_config("hl7_processing")
    uvicorn.run(
        app,
        host=service_config.host,
        port=service_config.port,
        log_level=service_config.log_level.lower()
    )
