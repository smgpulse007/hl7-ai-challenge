"""
FHIR R4 Resource Processor for HEDIS AI Platform
Processes FHIR R4 resources alongside HL7 v2.x messages
"""

import json
import logging
from datetime import datetime
from typing import Dict, Any, List, Optional
import re

logger = logging.getLogger(__name__)

class FHIRProcessor:
    """Process FHIR R4 resources for clinical evidence extraction"""
    
    def __init__(self):
        self.supported_resources = [
            'Patient',
            'DiagnosticReport', 
            'Observation',
            'DocumentReference',
            'Encounter',
            'Procedure',
            'Condition'
        ]
        
        # HEDIS measure patterns for FHIR resources
        self.measure_patterns = {
            'CCS': {
                'codes': ['169550002', '439958008', '86662002'],  # SNOMED codes for cervical screening
                'loinc': ['33717-0', '10524-7', '19765-7'],  # Pap smear LOINC codes
                'procedures': ['440623000', '243877001']  # Cervical screening procedures
            },
            'COL': {
                'codes': ['73761001', '174158000', '396226005'],  # Colonoscopy SNOMED codes
                'loinc': ['27925-7', '27926-5', '58453-2'],  # Colonoscopy LOINC codes
                'procedures': ['73761001', '174158000']  # Colonoscopy procedures
            },
            'WCV': {
                'codes': ['410620009', '390906007', '185349003'],  # Well-child visit codes
                'encounters': ['AMB', 'WELLNESS', 'CHECKUP']  # Encounter types
            }
        }
    
    def process_fhir_resource(self, fhir_resource: Dict[str, Any]) -> Dict[str, Any]:
        """Process a FHIR R4 resource and extract clinical evidence"""
        try:
            resource_type = fhir_resource.get('resourceType')
            
            if resource_type not in self.supported_resources:
                return {
                    'success': False,
                    'error': f'Unsupported resource type: {resource_type}'
                }
            
            # Extract patient information
            patient_info = self._extract_patient_info(fhir_resource)
            
            # Extract clinical evidence based on resource type
            evidence = self._extract_clinical_evidence(fhir_resource)
            
            # Determine HEDIS measures
            measures = self._identify_hedis_measures(fhir_resource, evidence)
            
            result = {
                'success': True,
                'input_type': 'FHIR_R4',
                'resource_type': resource_type,
                'patient_info': patient_info,
                'clinical_evidence': evidence,
                'hedis_measures': measures,
                'processing_timestamp': datetime.utcnow().isoformat(),
                'confidence_score': self._calculate_confidence(evidence, measures)
            }
            
            logger.info(f"Processed FHIR {resource_type} resource successfully")
            return result
            
        except Exception as e:
            logger.error(f"Error processing FHIR resource: {e}")
            return {
                'success': False,
                'error': str(e),
                'input_type': 'FHIR_R4'
            }
    
    def _extract_patient_info(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Extract patient information from FHIR resource"""
        patient_info = {}
        
        if resource.get('resourceType') == 'Patient':
            # Direct patient resource
            patient_info = {
                'id': resource.get('id'),
                'name': self._extract_name(resource.get('name', [])),
                'gender': resource.get('gender'),
                'birthDate': resource.get('birthDate'),
                'identifier': self._extract_identifiers(resource.get('identifier', []))
            }
        else:
            # Extract patient reference from other resources
            subject = resource.get('subject', {})
            if subject:
                patient_info = {
                    'reference': subject.get('reference'),
                    'display': subject.get('display')
                }
        
        return patient_info
    
    def _extract_name(self, names: List[Dict[str, Any]]) -> str:
        """Extract formatted name from FHIR name array"""
        if not names:
            return "Unknown"
        
        name = names[0]  # Use first name
        given = name.get('given', [])
        family = name.get('family', '')
        
        full_name = ' '.join(given + [family])
        return full_name.strip() or "Unknown"
    
    def _extract_identifiers(self, identifiers: List[Dict[str, Any]]) -> Dict[str, str]:
        """Extract identifiers from FHIR identifier array"""
        id_dict = {}
        for identifier in identifiers:
            system = identifier.get('system', '')
            value = identifier.get('value', '')
            
            if 'ssn' in system.lower():
                id_dict['ssn'] = value
            elif 'mrn' in system.lower() or 'medical-record' in system.lower():
                id_dict['mrn'] = value
            elif 'member' in system.lower():
                id_dict['member_id'] = value
        
        return id_dict
    
    def _extract_clinical_evidence(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Extract clinical evidence based on resource type"""
        resource_type = resource.get('resourceType')
        evidence = {}
        
        if resource_type == 'DiagnosticReport':
            evidence = self._process_diagnostic_report(resource)
        elif resource_type == 'Observation':
            evidence = self._process_observation(resource)
        elif resource_type == 'DocumentReference':
            evidence = self._process_document_reference(resource)
        elif resource_type == 'Procedure':
            evidence = self._process_procedure(resource)
        elif resource_type == 'Condition':
            evidence = self._process_condition(resource)
        elif resource_type == 'Encounter':
            evidence = self._process_encounter(resource)
        
        return evidence
    
    def _process_diagnostic_report(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Process DiagnosticReport resource"""
        return {
            'type': 'diagnostic_report',
            'status': resource.get('status'),
            'category': resource.get('category', []),
            'code': resource.get('code', {}),
            'effective_date': resource.get('effectiveDateTime'),
            'conclusion': resource.get('conclusion'),
            'coded_diagnosis': resource.get('codedDiagnosis', [])
        }
    
    def _process_observation(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Process Observation resource"""
        return {
            'type': 'observation',
            'status': resource.get('status'),
            'category': resource.get('category', []),
            'code': resource.get('code', {}),
            'value': resource.get('valueString') or resource.get('valueQuantity'),
            'effective_date': resource.get('effectiveDateTime'),
            'interpretation': resource.get('interpretation', [])
        }
    
    def _process_document_reference(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Process DocumentReference resource"""
        return {
            'type': 'document_reference',
            'status': resource.get('status'),
            'type_code': resource.get('type', {}),
            'category': resource.get('category', []),
            'date': resource.get('date'),
            'description': resource.get('description'),
            'content': resource.get('content', [])
        }
    
    def _process_procedure(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Process Procedure resource"""
        return {
            'type': 'procedure',
            'status': resource.get('status'),
            'code': resource.get('code', {}),
            'performed_date': resource.get('performedDateTime'),
            'outcome': resource.get('outcome', {}),
            'note': resource.get('note', [])
        }
    
    def _process_condition(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Process Condition resource"""
        return {
            'type': 'condition',
            'clinical_status': resource.get('clinicalStatus', {}),
            'verification_status': resource.get('verificationStatus', {}),
            'code': resource.get('code', {}),
            'onset_date': resource.get('onsetDateTime'),
            'recorded_date': resource.get('recordedDate')
        }
    
    def _process_encounter(self, resource: Dict[str, Any]) -> Dict[str, Any]:
        """Process Encounter resource"""
        return {
            'type': 'encounter',
            'status': resource.get('status'),
            'class': resource.get('class', {}),
            'type_codes': resource.get('type', []),
            'period': resource.get('period', {}),
            'reason_code': resource.get('reasonCode', [])
        }
    
    def _identify_hedis_measures(self, resource: Dict[str, Any], evidence: Dict[str, Any]) -> List[str]:
        """Identify applicable HEDIS measures from FHIR resource"""
        measures = []
        
        # Extract codes from the resource
        codes = self._extract_all_codes(resource)
        
        # Check each measure pattern
        for measure, patterns in self.measure_patterns.items():
            if self._matches_measure_pattern(codes, patterns):
                measures.append(measure)
        
        return measures
    
    def _extract_all_codes(self, resource: Dict[str, Any]) -> List[str]:
        """Extract all coding values from FHIR resource"""
        codes = []
        
        def extract_codes_recursive(obj):
            if isinstance(obj, dict):
                if 'coding' in obj:
                    for coding in obj['coding']:
                        if 'code' in coding:
                            codes.append(coding['code'])
                for value in obj.values():
                    extract_codes_recursive(value)
            elif isinstance(obj, list):
                for item in obj:
                    extract_codes_recursive(item)
        
        extract_codes_recursive(resource)
        return codes
    
    def _matches_measure_pattern(self, codes: List[str], patterns: Dict[str, List[str]]) -> bool:
        """Check if codes match any measure pattern"""
        for pattern_type, pattern_codes in patterns.items():
            for code in codes:
                if code in pattern_codes:
                    return True
        return False
    
    def _calculate_confidence(self, evidence: Dict[str, Any], measures: List[str]) -> float:
        """Calculate confidence score for FHIR processing"""
        base_confidence = 0.9  # FHIR resources are structured, so high base confidence
        
        # Adjust based on evidence completeness
        if evidence.get('status') == 'final':
            base_confidence += 0.05
        
        # Adjust based on measures identified
        if measures:
            base_confidence += 0.05
        
        return min(base_confidence, 1.0)
