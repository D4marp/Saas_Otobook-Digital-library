import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  FileImage, 
  Upload, 
  Play, 
  Zap,
  CheckCircle, 
  Clock,
  Server,
  Globe,
  Table,
  FileText,
  Loader2,
  Copy,
  Download,
  AlertCircle,
  X,
  FileUp
} from "lucide-react";
import { ocrAPI } from "@/lib/api";

interface OCRProvider {
  id: string;
  name: string;
  description: string;
  features: string[];
  supportedFormats: string[];
  pricing: string;
}

interface TextBlock {
  type: string;
  content: string;
  bounds?: { x: number; y: number; width: number; height: number };
}

interface TextWord {
  text: string;
  confidence: number;
  bounds?: { x: number; y: number; width: number; height: number };
}

interface OCRTable {
  confidence: number;
  data: string[][];
}

interface OCRField {
  key: string;
  value: string;
  confidence: number;
}

interface OCRResult {
  success: boolean;
  provider: string;
  providerName: string;
  processingTime: number;
  language: string;
  outputFormat: string;
  result: {
    text?: string;
    blocks?: TextBlock[];
    words?: TextWord[];
  };
  confidence: number;
  metadata: {
    timestamp: string;
    imageEnhanced: boolean;
    wordCount: number;
  };
  isDemo?: boolean;
  note?: string;
}

export default function OCRPlayground() {
  // Tesseract OCR (Free - No API keys needed)
  const tesseractProvider: OCRProvider = {
    id: "tesseract",
    name: "Tesseract OCR",
    description: "Free & open-source OCR engine. No API keys needed, fully offline capable.",
    features: ["Multi-language (100+)", "Free Forever", "Offline capable", "No API key required"],
    supportedFormats: ["png", "jpg", "jpeg", "tiff", "bmp", "gif", "webp", "pdf"],
    pricing: "Free"
  };

  const [selectedLanguage, setSelectedLanguage] = useState<string>("eng");
  const [outputFormat, setOutputFormat] = useState<string>("text");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [activeTab, setActiveTab] = useState<"demo" | "upload" | "structured" | "platforms">("demo");
  const [structuredData, setStructuredData] = useState<{ type: string; tables?: OCRTable[]; fields?: OCRField[] } | null>(null);
  const [structuredType, setStructuredType] = useState<string>("table");
  
  // File upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const languages = [
    { code: "eng", name: "English" },
    { code: "ind", name: "Indonesian" },
    { code: "jpn", name: "Japanese" },
    { code: "chi", name: "Chinese" },
    { code: "kor", name: "Korean" },
    { code: "ara", name: "Arabic" },
    { code: "fra", name: "French" },
    { code: "deu", name: "German" },
    { code: "spa", name: "Spanish" },
    { code: "por", name: "Portuguese" },
  ];

  const handleDemoOCR = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await ocrAPI.demo({
        provider: "tesseract",
        language: selectedLanguage,
        outputFormat: outputFormat
      });
      setResult(response.data);
    } catch (error) {
      console.error("Error processing OCR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/bmp', 'image/gif', 'image/webp', 'application/pdf'];

    // Validate file
    if (file.size > maxSize) {
      setUploadError("File size exceeds 10MB limit");
      return;
    }

    if (!allowedFormats.includes(file.type)) {
      setUploadError("Invalid file format. Supported: PNG, JPG, TIFF, BMP, GIF, WebP, PDF");
      return;
    }

    setUploadError(null);
    setUploadedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleProcessUploadedFile = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setResult(null);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        try {
          const response = await ocrAPI.processImage({
            imageData: base64Data,
            provider: "tesseract",
            language: selectedLanguage,
            outputFormat: outputFormat
          });
          setResult(response.data);
        } catch (error) {
          console.error("Error processing uploaded image:", error);
          setUploadError("Error processing image. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(uploadedFile);
    } catch (error) {
      console.error("Error reading file:", error);
      setUploadError("Error reading file");
      setLoading(false);
    }
  };

  const clearUploadedFile = () => {
    setUploadedFile(null);
    setImagePreview(null);
    setUploadError(null);
    setResult(null);
  };

  const handleExtractStructured = async () => {
    setLoading(true);
    setStructuredData(null);
    try {
      const response = await ocrAPI.extractStructuredData({
        imageData: "demo_image",
        provider: "tesseract",
        dataType: structuredType
      });
      setStructuredData(response.data.data);
    } catch (error) {
      console.error("Error extracting data:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout
      title="OCR Playground"
      subtitle="Try OCR with multiple providers - Demo Mode"
    >
      <div className="space-y-6">
        {/* Tesseract OCR - Free Provider */}
        <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FileImage className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Tesseract OCR (Free)</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {tesseractProvider.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {tesseractProvider.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                      ✓ {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Badge className="bg-green-600 text-white text-sm">Free Forever</Badge>
          </div>
        </Card>

        {/* Tabs for different operations */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "demo" | "upload" | "structured" | "platforms")}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Demo OCR
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <FileUp className="w-4 h-4" />
              Upload Image
            </TabsTrigger>
            <TabsTrigger value="structured" className="flex items-center gap-2">
              <Table className="w-4 h-4" />
              Extract Data
            </TabsTrigger>
            <TabsTrigger value="platforms" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Platforms
            </TabsTrigger>
          </TabsList>

          {/* Demo OCR Tab */}
          <TabsContent value="demo" className="space-y-4 mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">OCR Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Output Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Plain Text</SelectItem>
                      <SelectItem value="json">JSON with Details</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleDemoOCR} 
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Run Demo OCR
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Demo Upload Area */}
              <div className="border-2 border-dashed border-green-300 rounded-lg p-8 text-center bg-green-50">
                <FileImage className="w-12 h-12 mx-auto text-green-400 mb-4" />
                <p className="text-green-700 font-medium mb-2">Tesseract OCR Demo</p>
                <p className="text-sm text-green-600">
                  Click "Run Demo OCR" to see how Tesseract extracts text from images (free & offline capable)
                </p>
              </div>
            </Card>

            {/* Results */}
            {result && (
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    OCR Result
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(result.result.text || "")}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Provider</p>
                    <p className="font-semibold">{result.providerName}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Confidence</p>
                    <p className="font-semibold">{result.confidence.toFixed(1)}%</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-600 mb-1">Processing Time</p>
                    <p className="font-semibold">{result.processingTime}ms</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-orange-600 mb-1">Word Count</p>
                    <p className="font-semibold">{result.metadata.wordCount}</p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Confidence Score</span>
                    <span>{result.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>

                {/* Extracted Text */}
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
                  <pre className="whitespace-pre-wrap">{result.result.text}</pre>
                </div>

                {/* Demo Notice */}
                {result.isDemo && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                    <strong>Note:</strong> {result.note}
                  </div>
                )}
              </Card>
            )}
          </TabsContent>

          {/* Upload Image Tab */}
          <TabsContent value="upload" className="space-y-4 mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Upload Image for OCR</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Language</label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Output Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="text">Plain Text</SelectItem>
                      <SelectItem value="json">JSON with Details</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <label className="w-full">
                    <span className="sr-only">Upload image</span>
                    <Input
                      type="file"
                      accept=".png,.jpg,.jpeg,.tiff,.bmp,.gif,.webp,.pdf"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-md file:border-0
                        file:text-sm file:font-semibold
                        file:bg-orange-50 file:text-orange-700
                        hover:file:bg-orange-100"
                    />
                  </label>
                </div>
              </div>

              {/* Error Display */}
              {uploadError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-6">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-red-800 font-medium">Upload Error</p>
                      <p className="text-xs text-red-700 mt-1">{uploadError}</p>
                    </div>
                    <button onClick={() => setUploadError(null)} className="text-red-600 hover:text-red-800">
                      ✕
                    </button>
                  </div>
                </div>
              )}

              {/* File Preview */}
              {uploadedFile && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-medium text-sm">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {(uploadedFile.size / 1024).toFixed(2)} KB • {uploadedFile.type}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearUploadedFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-600 mb-2">Preview:</p>
                      <div className="relative bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 max-w-full mx-auto object-contain p-2"
                        />
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleProcessUploadedFile}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Process Image
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Upload Area */}
              {!uploadedFile && (
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
                  <FileImage className="w-12 h-12 mx-auto text-blue-400 mb-4" />
                  <p className="text-blue-700 font-medium mb-2">Upload an Image or Document</p>
                  <p className="text-sm text-blue-600 mb-3">
                    Supported formats: PNG, JPG, TIFF, BMP, GIF, WebP, PDF (Max 10MB)
                  </p>
                  <p className="text-xs text-blue-500">
                    Click the file input above to select an image to extract text from
                  </p>
                </div>
              )}
            </Card>

            {/* Results for Uploaded File */}
            {result && activeTab === "upload" && (
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    OCR Result
                  </h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(result.result.text || "")}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-1" />
                      Export
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Provider</p>
                    <p className="font-semibold text-sm">{result.providerName}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Confidence</p>
                    <p className="font-semibold text-sm">{result.confidence.toFixed(1)}%</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-600 mb-1">Processing Time</p>
                    <p className="font-semibold text-sm">{result.processingTime}ms</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-orange-600 mb-1">Word Count</p>
                    <p className="font-semibold text-sm">{result.metadata.wordCount}</p>
                  </div>
                </div>

                {/* Confidence Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Confidence Score</span>
                    <span>{result.confidence.toFixed(1)}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2" />
                </div>

                {/* Extracted Text */}
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{result.result.text}</pre>
                </div>
              </Card>
            )}
          </TabsContent>
          <TabsContent value="structured" className="space-y-4 mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Extract Structured Data</h3>
              <p className="text-gray-600 mb-4">
                Extract tables, forms, and structured data from documents using AWS Textract.
              </p>
              <div className="flex gap-4 mb-6">
                <Select value={structuredType} onValueChange={setStructuredType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="table">Table Extraction</SelectItem>
                    <SelectItem value="form">Form Fields</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExtractStructured} disabled={loading}>
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Table className="w-4 h-4 mr-2" />
                  )}
                  Extract Data
                </Button>
              </div>

              {structuredData && (
                <div className="space-y-4">
                  {structuredData.type === "table" && structuredData.tables && (
                    <div className="overflow-x-auto">
                      {structuredData.tables.map((table: OCRTable, idx: number) => (
                        <div key={idx} className="mb-4">
                          <h4 className="font-medium mb-2">Table {idx + 1} (Confidence: {table.confidence}%)</h4>
                          <table className="w-full border-collapse border border-gray-300">
                            <tbody>
                              {table.data.map((row: string[], rowIdx: number) => (
                                <tr key={rowIdx} className={rowIdx === 0 ? "bg-gray-100" : ""}>
                                  {row.map((cell: string, cellIdx: number) => (
                                    <td key={cellIdx} className="border border-gray-300 px-3 py-2 text-sm">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  )}

                  {structuredData.type === "form" && structuredData.fields && (
                    <div className="space-y-2">
                      {structuredData.fields.map((field: OCRField, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{field.key}:</span>
                            <span>{field.value}</span>
                          </div>
                          <Badge variant="outline">{field.confidence.toFixed(1)}%</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-4 mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Multi-Platform Integration</h3>
              <p className="text-gray-600 mb-6">
                Connect OCR service to various platforms for seamless integration.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {["wordpress", "shopify", "wix", "custom"].map((platform) => (
                  <div key={platform} className="p-4 border rounded-lg">
                    <h4 className="font-semibold capitalize mb-2">{platform}</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      {platform === "wordpress" && "WordPress REST API integration"}
                      {platform === "shopify" && "Shopify Admin API integration"}
                      {platform === "wix" && "Wix Data API integration"}
                      {platform === "custom" && "Custom REST API endpoint"}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Configure
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Integration</h3>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                <pre>{`// JavaScript/TypeScript Integration
const response = await fetch('http://localhost:5000/api/ocr/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    imageData: 'base64_encoded_image',
    provider: 'tesseract',
    language: 'eng',
    outputFormat: 'text'
  })
});

const result = await response.json();
console.log(result.result.text);`}</pre>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
