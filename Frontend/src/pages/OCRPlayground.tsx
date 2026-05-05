import { useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  FileImage, 
  Zap,
  CheckCircle, 
  Clock,
  Loader2,
  Copy,
  AlertCircle,
  X
} from "lucide-react";
import { ocrAPI } from "@/lib/api";

interface OCRResult {
  success: boolean;
  provider: string;
  providerName: string;
  processingTime: number;
  language: string;
  outputFormat: string;
  result: {
    text?: string;
  };
  confidence: number;
  metadata: {
    timestamp: string;
    wordCount: number;
  };
  isDemo?: boolean;
  note?: string;
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

export default function OCRPlayground() {
  const [selectedLanguage, setSelectedLanguage] = useState<string>("eng");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OCRResult | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [messageKey, setMessageKey] = useState<string>("");

  const languages = [
    { code: "eng", name: "English" },
    { code: "ind", name: "Indonesian" },
    { code: "jpn", name: "Japanese" },
    { code: "chi", name: "Chinese" },
  ];

  const handleDemoOCR = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await ocrAPI.demo({
        provider: "tesseract",
        language: selectedLanguage,
        outputFormat: "text"
      });
      if (response.data && response.data.success) {
        setResult(response.data);
      } else {
        setError(response.data?.error || "Error processing demo OCR");
      }
    } catch (err: unknown) {
      console.error("Demo OCR error:", err);
      setError(getErrorMessage(err, "Error processing demo OCR"));
    } finally {
      setLoading(false);
    }
  };

  const prepareImageForOCR = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      img.onload = () => {
        try {
          const maxDimension = 1800;
          const longestSide = Math.max(img.width, img.height);
          const scale = longestSide > maxDimension ? maxDimension / longestSide : 1;

          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Canvas context not available"));
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const targetType = file.type === "image/png" ? "image/png" : "image/jpeg";
          const optimizedDataUrl =
            targetType === "image/png"
              ? canvas.toDataURL(targetType)
              : canvas.toDataURL(targetType, 0.85);

          resolve(optimizedDataUrl);
        } catch (error: unknown) {
          reject(error);
        } finally {
          URL.revokeObjectURL(objectUrl);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error("Failed to load image for optimization"));
      };

      img.src = objectUrl;
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/tiff', 'image/bmp'];

    if (file.size > maxSize) {
      setError("File size exceeds 10MB limit");
      return;
    }

    if (!allowedFormats.includes(file.type)) {
      setError("Invalid format. Supported: PNG, JPG, TIFF, BMP");
      return;
    }

    setError(null);
    setUploadedFile(file);
    setResult(null);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProcessUploadedFile = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const base64Data = await prepareImageForOCR(uploadedFile);
      console.log("Processing image:", uploadedFile.name);
      const response = await ocrAPI.processImage({
        imageData: base64Data,
        provider: "tesseract",
        language: selectedLanguage,
          outputFormat: "text",
          messageKey: messageKey || undefined
      });

      if (response.data && response.data.success) {
        setResult(response.data);
        setError(null);
      } else {
        setError(response.data?.error || "Error processing image");
      }
    } catch (err: unknown) {
      console.error("Process error:", err);
      setError(getErrorMessage(err, "Error preparing/processing image"));
    } finally {
      setLoading(false);
    }
  };

  const clearUpload = () => {
    setUploadedFile(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <DashboardLayout
      title="OCR Playground"
      subtitle="Extract text from images using Tesseract OCR (Free & Offline)"
    >
      <div className="space-y-6 max-w-4xl">
        {/* Header Card */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileImage className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">Tesseract OCR</h2>
              <p className="text-sm text-gray-600 mt-1">
                Free, open-source image-to-text conversion. No API keys needed, fully offline.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">✓ Multi-language</Badge>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">✓ No API Key</Badge>
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">✓ Offline</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Configuration */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue />
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
              <label className="block text-sm font-medium mb-2">Message Key (optional)</label>
              <Input
                value={messageKey}
                onChange={(e) => setMessageKey(e.target.value)}
                placeholder="e.g. txn_12345 or ticket-abc"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Action</label>
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
                    Run Demo
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Upload Section */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
          
          {!uploadedFile ? (
            <div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                <FileImage className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-700 font-medium">Choose image to extract text</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, TIFF, BMP (Max 10MB)</p>
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/tiff,image/bmp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button type="button" className="w-full" variant="outline" onClick={openFilePicker}>
                Select Image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* File Info */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <Button size="sm" variant="ghost" onClick={clearUpload}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Preview */}
              {imagePreview && (
                <div className="border rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="max-h-60 max-w-full mx-auto object-contain" />
                </div>
              )}

              {/* Processing Info */}
              {loading && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
                  <Loader2 className="w-5 h-5 text-yellow-600 flex-shrink-0 animate-spin mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Processing image...</p>
                    <p className="text-xs mt-1">First run bisa 20-60 detik, setelah warm-up biasanya lebih cepat</p>
                  </div>
                </div>
              )}

              {/* Process Button */}
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
                    Extract Text
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-xs text-red-700 mt-1">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Extracted Text
              </h3>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => copyToClipboard(result.result.text || "")}
              >
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 mb-1">Confidence</p>
                <p className="font-semibold text-sm">{result.confidence.toFixed(1)}%</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-purple-600 mb-1">Time</p>
                <p className="font-semibold text-sm">{result.processingTime}ms</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs text-orange-600 mb-1">Words</p>
                <p className="font-semibold text-sm">{result.metadata.wordCount}</p>
              </div>
            </div>

            {/* Confidence Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">Confidence</span>
                <span className="font-medium">{result.confidence.toFixed(1)}%</span>
              </div>
              <Progress value={result.confidence} className="h-2" />
            </div>

            {/* Extracted Text */}
            <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm">
              <pre className="whitespace-pre-wrap text-xs">{result.result.text}</pre>
            </div>

            {/* Demo Note */}
            {result.isDemo && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                {result.note}
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
