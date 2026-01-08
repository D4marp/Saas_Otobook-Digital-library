import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Code2, CheckCircle, AlertCircle } from "lucide-react";
import { documentationAPI } from "@/lib/api";

const CodeBlock = ({ code, language, id }: { code: string; language: string; id: number }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg overflow-hidden mb-4">
      <div className="flex justify-between items-center bg-gray-800 px-4 py-2 border-b border-gray-700">
        <span className="text-sm font-mono text-gray-400">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition"
        >
          {copied ? (
            <>
              <CheckCircle className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default function OCRDocumentation() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocumentation();
  }, []);

  const fetchDocumentation = async () => {
    try {
      const response = await documentationAPI.getDocumentationByType("OCR");
      setDocs(response.data.data || []);
    } catch (err) {
      setError("Failed to load documentation from backend.");
      console.error("Error fetching documentation:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="OCR Documentation" subtitle="Loading...">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading OCR documentation...</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="OCR Documentation"
      subtitle="Complete guide for OCR implementation on Web, Android & iOS"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Overview */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Code2 className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Optical Character Recognition (OCR)</h2>
              <p className="text-gray-700">
                Extract text from images and documents with high accuracy. Our OCR solutions support Web, Android, and iOS platforms with complete implementation guides and code examples.
              </p>
            </div>
          </div>
        </Card>

        {/* Platform Tabs - Dynamic + Flutter */}
        {docs.length > 0 ? (
          <Tabs defaultValue={docs[0]?.platform || "Web"} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-5">
              {docs.map((doc) => (
                <TabsTrigger key={doc.id} value={doc.platform || ""}>
                  {doc.platform}
                </TabsTrigger>
              ))}
              <TabsTrigger value="Flutter">Flutter</TabsTrigger>
            </TabsList>

            {docs.map((doc) => (
              <TabsContent key={doc.id} value={doc.platform || ""} className="space-y-6 mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">{doc.title}</h3>
                  <p className="text-gray-700 mb-6">{doc.description}</p>
                  <p className="text-gray-600 mb-6">{doc.content}</p>

                  {/* Platform-specific code examples */}
                  {doc.platform === "Web" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">1. Installation</h4>
                        <CodeBlock
                          id={doc.id}
                          code="npm install tesseract.js"
                          language="bash"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">2. Basic Setup</h4>
                        <CodeBlock
                          id={doc.id + 1}
                          code={`import Tesseract from 'tesseract.js';

const performOCR = async (imagePath) => {
  const result = await Tesseract.recognize(imagePath, 'eng');
  return result.data.text;
};`}
                          language="javascript"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">3. React Component</h4>
                        <CodeBlock
                          id={doc.id + 2}
                          code={`import { useState } from 'react';
import Tesseract from 'tesseract.js';

export const OCRUploader = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    setLoading(true);
    const result = await Tesseract.recognize(file, 'eng');
    setText(result.data.text);
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <input type="file" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
      {loading && <p>Processing...</p>}
      {text && <textarea value={text} readOnly />}
    </div>
  );
};`}
                          language="jsx"
                        />
                      </div>
                    </div>
                  )}

                  {doc.platform === "Android" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">1. Add Dependencies</h4>
                        <CodeBlock
                          id={doc.id + 100}
                          code={`dependencies {
  implementation 'com.google.mlkit:text-recognition:16.0.0'
  implementation 'com.google.android.gms:play-services-mlkit-text-recognition:18.0.0'
}`}
                          language="gradle"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">2. Permissions</h4>
                        <CodeBlock
                          id={doc.id + 101}
                          code={`<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />`}
                          language="xml"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">3. Java Implementation</h4>
                        <CodeBlock
                          id={doc.id + 102}
                          code={`import com.google.mlkit.vision.common.InputImage;
import com.google.mlkit.vision.text.TextRecognition;
import android.graphics.Bitmap;

public class OCRProcessor {
  public void recognizeText(Bitmap bitmap, OnResultListener listener) {
    InputImage image = InputImage.fromBitmap(bitmap, 0);
    TextRecognition.getClient()
      .process(image)
      .addOnSuccessListener(result -> {
        listener.onSuccess(result.getText());
      })
      .addOnFailureListener(e -> listener.onFailure(e));
  }
}`}
                          language="java"
                        />
                      </div>
                    </div>
                  )}

                  {doc.platform === "iOS" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">1. Framework Setup</h4>
                        <CodeBlock
                          id={doc.id + 200}
                          code={`import Vision
import CoreML
import UIKit`}
                          language="swift"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">2. Swift Implementation</h4>
                        <CodeBlock
                          id={doc.id + 201}
                          code={`import Vision

class OCRProcessor {
  func recognizeText(image: UIImage, completion: @escaping (String?) -> Void) {
    guard let cgImage = image.cgImage else { return }
    
    let requestHandler = VNImageRequestHandler(cgImage: cgImage)
    let request = VNRecognizeTextRequest { request, _ in
      let observations = request.results as? [VNRecognizedTextObservation] ?? []
      let text = observations.compactMap { $0.topCandidates(1).first?.string }
      completion(text.joined(separator: "\\n"))
    }
    
    try? requestHandler.perform([request])
  }
}`}
                          language="swift"
                        />
                      </div>
                    </div>
                  )}

                  {/* Flutter Hybrid Platform */}
                  {doc.platform === "Flutter" && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">1. Dependencies Setup</h4>
                        <CodeBlock
                          id={doc.id + 300}
                          code={`# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  google_mlkit_text_recognition: ^0.10.0
  image_picker: ^1.0.0
  camera: ^0.10.0`}
                          language="yaml"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">2. Dart Implementation</h4>
                        <CodeBlock
                          id={doc.id + 301}
                          code={`import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class OCRService {
  final textRecognizer = TextRecognizer();

  Future<String> recognizeText(File imageFile) async {
    try {
      final inputImage = InputImage.fromFile(imageFile);
      final recognizedText = await textRecognizer.processImage(inputImage);
      
      String text = '';
      for (TextBlock block in recognizedText.blocks) {
        for (TextLine line in block.lines) {
          text += line.text + '\\n';
        }
      }
      return text;
    } catch (e) {
      print('Error: $e');
      return '';
    }
  }

  void dispose() {
    textRecognizer.close();
  }
}`}
                          language="dart"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">3. Flutter Widget</h4>
                        <CodeBlock
                          id={doc.id + 302}
                          code={`import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class OCRScreen extends StatefulWidget {
  @override
  _OCRScreenState createState() => _OCRScreenState();
}

class _OCRScreenState extends State<OCRScreen> {
  final OCRService _ocrService = OCRService();
  final ImagePicker _picker = ImagePicker();
  String _recognizedText = '';
  bool _isLoading = false;

  Future<void> _pickAndRecognize() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    
    if (image != null) {
      setState(() => _isLoading = true);
      
      final text = await _ocrService.recognizeText(File(image.path));
      
      setState(() {
        _recognizedText = text;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('OCR Recognition')),
      body: Column(
        children: [
          ElevatedButton(
            onPressed: _pickAndRecognize,
            child: Text('Pick Image'),
          ),
          if (_isLoading) CircularProgressIndicator(),
          if (_recognizedText.isNotEmpty)
            Expanded(
              child: SingleChildScrollView(
                child: Text(_recognizedText),
              ),
            ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _ocrService.dispose();
    super.dispose();
  }
}`}
                          language="dart"
                        />
                      </div>
                    </div>
                  )}

                  {/* Best Practices */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Best Practices</h4>
                    <ul className="space-y-2 text-sm text-blue-800">
                      <li>✓ Use high-quality images for better accuracy</li>
                      <li>✓ Preprocess images (resize, denoise) before OCR</li>
                      <li>✓ Implement error handling and retry logic</li>
                      <li>✓ Cache results to reduce processing time</li>
                      <li>✓ Test with various languages and formats</li>
                      <li>✓ Use proper permissions handling (especially Flutter)</li>
                    </ul>
                  </div>
                </Card>
              </TabsContent>
            ))}

            {/* Flutter Tab Content */}
            <TabsContent value="Flutter" className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Flutter Hybrid OCR Implementation</h3>
                <p className="text-gray-700 mb-6">
                  Build cross-platform OCR applications with Flutter. Flutter provides excellent support for integrating native OCR libraries on both Android and iOS through platform channels.
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">1. Project Setup</h4>
                    <CodeBlock
                      id={9999}
                      code={`flutter create ocr_app
cd ocr_app

# Add to pubspec.yaml
flutter pub add google_mlkit_text_recognition image_picker camera`}
                      language="bash"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">2. Android Setup (AndroidManifest.xml)</h4>
                    <CodeBlock
                      id={9998}
                      code={`<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

<application>
  <!-- ML Kit will download models on first use -->
</application>`}
                      language="xml"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">3. iOS Setup (Info.plist)</h4>
                    <CodeBlock
                      id={9997}
                      code={`<key>NSCameraUsageDescription</key>
<string>Camera is needed for OCR scanning</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>Photo library is needed to select images</string>
<key>NSMicrophoneUsageDescription</key>
<string>Microphone is needed for recording</string>`}
                      language="xml"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">4. Complete Flutter App Example</h4>
                    <CodeBlock
                      id={9996}
                      code={`import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:google_mlkit_text_recognition/google_mlkit_text_recognition.dart';
import 'dart:io';

void main() => runApp(OCRApp());

class OCRApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter OCR',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: OCRScreen(),
    );
  }
}

class OCRScreen extends StatefulWidget {
  @override
  _OCRScreenState createState() => _OCRScreenState();
}

class _OCRScreenState extends State<OCRScreen> {
  final textRecognizer = TextRecognizer();
  final ImagePicker _picker = ImagePicker();
  
  File? _selectedImage;
  String _recognizedText = '';
  bool _isProcessing = false;

  Future<void> _pickImage(ImageSource source) async {
    final XFile? image = await _picker.pickImage(source: source);
    if (image != null) {
      await _recognizeText(File(image.path));
    }
  }

  Future<void> _recognizeText(File imageFile) async {
    setState(() => _isProcessing = true);
    
    try {
      final inputImage = InputImage.fromFile(imageFile);
      final recognizedText = await textRecognizer.processImage(inputImage);
      
      String extractedText = '';
      for (TextBlock block in recognizedText.blocks) {
        for (TextLine line in block.lines) {
          extractedText += line.text + '\\n';
        }
      }

      setState(() {
        _selectedImage = imageFile;
        _recognizedText = extractedText;
        _isProcessing = false;
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: $e'))
      );
      setState(() => _isProcessing = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Flutter OCR')),
      body: Column(
        children: [
          if (_selectedImage != null)
            Image.file(_selectedImage!, height: 200),
          if (_isProcessing)
            Center(child: CircularProgressIndicator())
          else
            Expanded(
              child: SingleChildScrollView(
                child: Padding(
                  padding: EdgeInsets.all(16),
                  child: Text(_recognizedText.isEmpty 
                    ? 'No text recognized yet' 
                    : _recognizedText),
                ),
              ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _showImageSourceDialog(),
        label: Text('Pick Image'),
        icon: Icon(Icons.image),
      ),
    );
  }

  void _showImageSourceDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Select Image Source'),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _pickImage(ImageSource.camera);
            },
            child: Text('Camera'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _pickImage(ImageSource.gallery);
            },
            child: Text('Gallery'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    textRecognizer.close();
    super.dispose();
  }
}`}
                      language="dart"
                    />
                  </div>
                </div>

                {/* Best Practices */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-blue-900 mb-3">Flutter Best Practices</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>✓ Use FutureBuilder or Riverpod for state management</li>
                    <li>✓ Implement proper error handling with try-catch</li>
                    <li>✓ Request permissions using permission_handler package</li>
                    <li>✓ Cache text recognition models for better performance</li>
                    <li>✓ Test on both Android and iOS simulators/devices</li>
                    <li>✓ Use platform channels for complex native features</li>
                  </ul>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-600">No documentation available. Please check backend connection.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
