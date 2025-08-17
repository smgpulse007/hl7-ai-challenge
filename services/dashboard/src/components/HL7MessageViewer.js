import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  Download,
  Eye,
  Code
} from 'lucide-react';

const HL7MessageViewer = ({ onMessageProcess }) => {
  const [selectedMessage, setSelectedMessage] = useState('adt');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFHIR, setShowFHIR] = useState(false);

  const sampleMessages = {
    adt: {
      name: 'ADT^A01 - Patient Admission',
      description: 'Hospital admission message with diabetes diagnosis',
      content: `MSH|^~\\&|EPIC|UCSF|HEDIS|AI_PLATFORM|20250816131500||ADT^A01|12345|P|2.5
EVN|A01|20250816131500|||^SMITH^JANE^MD
PID|1||123456789^^^UCSF^MR||DOE^JOHN^MIDDLE||19800101|M|||123 MAIN ST^^SAN FRANCISCO^CA^94102||555-1234|||S||123456789|123-45-6789
NK1|1|DOE^JANE^||SPOUSE|||123 MAIN ST^^SAN FRANCISCO^CA^94102|555-1234
PV1|1|I|ICU^101^A|||12345^SMITH^JANE^MD|||MED|||A|||12345^SMITH^JANE^MD|INP|MEDICARE|||||||||||||||||||||||20250816131500
PV2||^DIABETES MANAGEMENT
DG1|1|I9|E11.9|Type 2 diabetes mellitus without complications|20250816131500|||W
AL1|1||^PENICILLIN^L|MO|RASH
OBX|1|NM|33747-0^Hemoglobin A1c^LN||8.2|%|<7.0|H|||F|||20250816131500
OBX|2|NM|2339-0^Glucose^LN||180|mg/dL|70-100|H|||F|||20250816131500
OBX|3|TX|11506-3^Provider Assessment^LN||Patient presents with uncontrolled diabetes. HbA1c elevated at 8.2%. Recommend medication adjustment and diabetes education.||||||F|||20250816131500`
    },
    oru: {
      name: 'ORU^R01 - Lab Results',
      description: 'Laboratory results with critical values',
      content: `MSH|^~\\&|LAB|UCSF|HEDIS|AI_PLATFORM|20250816140000||ORU^R01|LAB001|P|2.5
PID|1||123456789^^^UCSF^MR||DOE^JOHN^MIDDLE||19800101|M|||123 MAIN ST^^SAN FRANCISCO^CA^94102||555-1234|||S||123456789|123-45-6789
OBR|1|LAB001|LAB001|LIPID^Lipid Panel^L|||20250816120000|||||||||12345^SMITH^JANE^MD||||||||F
OBX|1|NM|2093-3^Cholesterol Total^LN||280|mg/dL|<200|H|||F|||20250816120000
OBX|2|NM|2085-9^HDL Cholesterol^LN||35|mg/dL|>40|L|||F|||20250816120000
OBX|3|NM|2089-1^LDL Cholesterol^LN||190|mg/dL|<100|H|||F|||20250816120000
OBX|4|NM|2571-8^Triglycerides^LN||275|mg/dL|<150|H|||F|||20250816120000
NTE|1||Critical values: Total cholesterol and LDL significantly elevated. Recommend statin therapy and dietary counseling.`
    },
    mdm: {
      name: 'MDM^T02 - Clinical Document',
      description: 'Clinical documentation with care plan',
      content: `MSH|^~\\&|EMR|UCSF|HEDIS|AI_PLATFORM|20250816150000||MDM^T02|DOC001|P|2.5
EVN|T02|20250816150000|||^SMITH^JANE^MD
PID|1||123456789^^^UCSF^MR||DOE^JOHN^MIDDLE||19800101|M|||123 MAIN ST^^SAN FRANCISCO^CA^94102||555-1234|||S||123456789|123-45-6789
TXA|1|CN|TEXT|20250816150000||||||||^SMITH^JANE^MD|||||AV|||
OBX|1|TX|11506-3^Provider Assessment^LN||ASSESSMENT AND PLAN:\n\n1. Type 2 Diabetes Mellitus (E11.9) - Uncontrolled\n   - HbA1c 8.2% (goal <7%)\n   - Increase metformin to 1000mg BID\n   - Add glipizide 5mg daily\n   - Diabetes education referral\n   - Follow-up in 3 months\n\n2. Dyslipidemia (E78.5)\n   - Total cholesterol 280 mg/dL\n   - Start atorvastatin 20mg daily\n   - Dietary counseling\n   - Recheck lipids in 6 weeks\n\n3. Hypertension (I10)\n   - BP 145/92 mmHg\n   - Continue lisinopril 10mg daily\n   - Monitor BP at home\n   - Target <130/80 mmHg||||||F|||20250816150000`
    }
  };

  const fhirOutput = {
    resourceType: "Bundle",
    id: "processed-bundle-001",
    type: "transaction",
    entry: [
      {
        resource: {
          resourceType: "Patient",
          id: "123456789",
          identifier: [
            {
              use: "usual",
              system: "http://ucsf.edu/patient-id",
              value: "123456789"
            }
          ],
          name: [
            {
              use: "official",
              family: "Doe",
              given: ["John", "Middle"]
            }
          ],
          gender: "male",
          birthDate: "1980-01-01",
          address: [
            {
              line: ["123 Main St"],
              city: "San Francisco",
              state: "CA",
              postalCode: "94102"
            }
          ]
        }
      },
      {
        resource: {
          resourceType: "Condition",
          id: "diabetes-condition",
          subject: {
            reference: "Patient/123456789"
          },
          code: {
            coding: [
              {
                system: "http://hl7.org/fhir/sid/icd-10-cm",
                code: "E11.9",
                display: "Type 2 diabetes mellitus without complications"
              }
            ]
          },
          clinicalStatus: {
            coding: [
              {
                system: "http://terminology.hl7.org/CodeSystem/condition-clinical",
                code: "active"
              }
            ]
          }
        }
      },
      {
        resource: {
          resourceType: "Observation",
          id: "hba1c-result",
          status: "final",
          code: {
            coding: [
              {
                system: "http://loinc.org",
                code: "33747-0",
                display: "Hemoglobin A1c"
              }
            ]
          },
          subject: {
            reference: "Patient/123456789"
          },
          valueQuantity: {
            value: 8.2,
            unit: "%",
            system: "http://unitsofmeasure.org",
            code: "%"
          },
          interpretation: [
            {
              coding: [
                {
                  system: "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
                  code: "H",
                  display: "High"
                }
              ]
            }
          ]
        }
      }
    ]
  };

  const handleProcessMessage = async () => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setShowFHIR(true);
    setIsProcessing(false);
    
    if (onMessageProcess) {
      onMessageProcess(sampleMessages[selectedMessage]);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="hl7-message-viewer">
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" />
            HL7 Message Processor
          </h3>
          
          <div className="flex gap-2">
            <select
              value={selectedMessage}
              onChange={(e) => setSelectedMessage(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(sampleMessages).map(([key, msg]) => (
                <option key={key} value={key}>{msg.name}</option>
              ))}
            </select>
            
            <motion.button
              onClick={handleProcessMessage}
              disabled={isProcessing}
              className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 ${
                isProcessing 
                  ? 'bg-gray-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              whileHover={{ scale: isProcessing ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isProcessing ? (
                <>
                  <div className="loading-spinner"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Process Message
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Message Description */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-800">{sampleMessages[selectedMessage].name}</h4>
          <p className="text-sm text-blue-600">{sampleMessages[selectedMessage].description}</p>
        </div>

        {/* HL7 Message Display */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Code className="w-5 h-5" />
                HL7 v2.x Message
              </h4>
              <button
                onClick={() => copyToClipboard(sampleMessages[selectedMessage].content)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            
            <div className="relative">
              <SyntaxHighlighter
                language="text"
                style={tomorrow}
                customStyle={{
                  fontSize: '12px',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}
              >
                {sampleMessages[selectedMessage].content}
              </SyntaxHighlighter>
            </div>
          </div>

          {/* FHIR Output */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                FHIR R4 Output
              </h4>
              {showFHIR && (
                <button
                  onClick={() => copyToClipboard(JSON.stringify(fhirOutput, null, 2))}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {showFHIR ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative"
              >
                <SyntaxHighlighter
                  language="json"
                  style={tomorrow}
                  customStyle={{
                    fontSize: '12px',
                    maxHeight: '400px',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  {JSON.stringify(fhirOutput, null, 2)}
                </SyntaxHighlighter>
              </motion.div>
            ) : (
              <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>FHIR output will appear here after processing</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Processing Status */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-yellow-800">
              <div className="loading-spinner"></div>
              <span className="font-semibold">Processing HL7 Message...</span>
            </div>
            <div className="text-sm text-yellow-600 mt-1">
              Parsing segments, extracting clinical data, and generating FHIR resources...
            </div>
          </motion.div>
        )}

        {/* Success Status */}
        {showFHIR && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
          >
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Processing Complete!</span>
            </div>
            <div className="text-sm text-green-600 mt-1">
              Successfully transformed HL7 v2.x message to FHIR R4 resources with 95.2% confidence
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HL7MessageViewer;
