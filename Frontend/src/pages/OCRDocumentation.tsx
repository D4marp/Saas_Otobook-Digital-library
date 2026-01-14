import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Code2, FileImage, Globe } from "lucide-react";

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
  return (
    <DashboardLayout
      title="OCR API Documentation"
      subtitle="Complete API reference for Tesseract OCR integration - Free, no API keys"
    >
      <div className="space-y-6">
        {/* Overview */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <Code2 className="w-8 h-8 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tesseract OCR API</h2>
              <p className="text-gray-700">
                Free, open-source optical character recognition. Extract text from images in 100+ languages. No API keys required. Fully offline capable.
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="platforms">Multi-Platform</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="deployment">Deploy</TabsTrigger>
          </TabsList>

          {/* API Endpoints */}
          <TabsContent value="endpoints" className="space-y-6 mt-6">
            {/* GET /api/ocr/providers */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Get Providers</h3>
                <Badge>GET</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/ocr/providers</code>
              <p className="text-sm text-gray-600 mb-4">List all available OCR providers</p>
              <CodeBlock id={1} language="bash" code="curl http://localhost:5000/api/ocr/providers" />
            </Card>

            {/* POST /api/ocr/demo */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Demo OCR</h3>
                <Badge variant="outline">POST</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/ocr/demo</code>
              <p className="text-sm text-gray-600 mb-4">Test OCR processing with demo image</p>
              <CodeBlock id={2} language="bash" code={`curl -X POST http://localhost:5000/api/ocr/demo \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "tesseract",
    "language": "eng",
    "outputFormat": "text"
  }'`} />
            </Card>

            {/* POST /api/ocr/process */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Process Image</h3>
                <Badge variant="outline">POST</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/ocr/process</code>
              <p className="text-sm text-gray-600 mb-4">Upload and process image file</p>
              <CodeBlock id={3} language="bash" code={`curl -X POST http://localhost:5000/api/ocr/process \\
  -F "image=@image.jpg" \\
  -F "language=eng" \\
  -F "outputFormat=text"`} />
            </Card>

            {/* POST /api/ocr/batch */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Batch Processing</h3>
                <Badge variant="outline">POST</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/ocr/batch</code>
              <p className="text-sm text-gray-600 mb-4">Process multiple images</p>
              <CodeBlock id={4} language="json" code={`{
  "images": ["base64_image_1", "base64_image_2"],
  "language": "eng",
  "outputFormat": "text"
}`} />
            </Card>

            {/* POST /api/ocr/extract */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Extract Structured Data</h3>
                <Badge variant="outline">POST</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/ocr/extract</code>
              <p className="text-sm text-gray-600 mb-4">Extract tables and form fields</p>
              <CodeBlock id={5} language="json" code={`{
  "imageData": "base64_image",
  "provider": "tesseract",
  "dataType": "table"
}`} />
            </Card>
          </TabsContent>

          {/* Multi-Platform Integration */}
          <TabsContent value="platforms" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Send to Multiple Platforms</h3>
              <p className="text-gray-600 mb-6">Auto-send OCR results to WordPress, Shopify, Notion, Airtable, Google Sheets, and more</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: "WordPress", endpoint: "/wp-json/posts", auth: "Bearer Token" },
                  { name: "Shopify", endpoint: "/admin/api/products", auth: "OAuth" },
                  { name: "WooCommerce", endpoint: "/wp-json/wc/v3/products", auth: "API Key" },
                  { name: "Notion", endpoint: "/v1/pages", auth: "Bearer Token" },
                  { name: "Airtable", endpoint: "/v0/records", auth: "API Key" },
                  { name: "Google Sheets", endpoint: "/v4/spreadsheets", auth: "Service Account" }
                ].map((p, i) => (
                  <Card key={i} className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="font-semibold text-sm mb-1">{p.name}</h4>
                    <p className="text-xs text-gray-600">{p.endpoint}</p>
                    <Badge className="text-xs mt-2">{p.auth}</Badge>
                  </Card>
                ))}
              </div>
            </Card>

            {/* WordPress Integration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                WordPress Integration
              </h3>
              <CodeBlock id={6} language="javascript" code={`// 1. Extract with OCR
const ocrResult = await fetch('http://localhost:5000/api/ocr/demo', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ provider: 'tesseract', language: 'eng' })
}).then(r => r.json());

// 2. Send to WordPress
await fetch('https://yoursite.com/wp-json/posts', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'OCR Document',
    content: ocrResult.result.text,
    status: 'draft'
  })
});`} />
            </Card>

            {/* Notion Integration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-purple-600" />
                Notion Integration
              </h3>
              <CodeBlock id={7} language="javascript" code={`await fetch('https://api.notion.com/v1/pages', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer NOTION_TOKEN',
    'Notion-Version': '2022-06-28'
  },
  body: JSON.stringify({
    parent: { database_id: 'DB_ID' },
    properties: {
      'Title': { title: [{ text: { content: 'OCR Result' } }] },
      'Content': { rich_text: [{ text: { content: ocrResult.result.text } }] },
      'Confidence': { number: ocrResult.confidence }
    }
  })
});`} />
            </Card>

            {/* Airtable Integration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-600" />
                Airtable Integration
              </h3>
              <CodeBlock id={8} language="javascript" code={`await fetch('https://api.airtable.com/v0/BASE_ID/TABLE_ID', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer AIRTABLE_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    records: [{
      fields: {
        'Text': ocrResult.result.text,
        'Confidence': ocrResult.confidence,
        'Language': 'eng',
        'Processing Time': ocrResult.processingTime
      }
    }]
  })
});`} />
            </Card>
          </TabsContent>

          {/* Code Examples */}
          <TabsContent value="examples" className="space-y-6 mt-6">
            {/* JavaScript */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">JavaScript/Node.js</h3>
              <CodeBlock id={9} language="javascript" code={`const axios = require('axios');

async function ocrProcess() {
  const result = await axios.post('http://localhost:5000/api/ocr/demo', {
    provider: 'tesseract',
    language: 'eng',
    outputFormat: 'text'
  });
  
  console.log('Text:', result.data.result.text);
  console.log('Confidence:', result.data.confidence);
}

ocrProcess();`} />
            </Card>

            {/* Python */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Python</h3>
              <CodeBlock id={10} language="python" code={`import requests

response = requests.post('http://localhost:5000/api/ocr/demo', json={
    'provider': 'tesseract',
    'language': 'eng',
    'outputFormat': 'text'
})

result = response.json()
print('Text:', result['result']['text'])
print('Confidence:', result['confidence'])`} />
            </Card>

            {/* PHP */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">PHP</h3>
              <CodeBlock id={11} language="php" code={`<?php
$ch = curl_init('http://localhost:5000/api/ocr/demo');
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    'provider' => 'tesseract',
    'language' => 'eng',
    'outputFormat' => 'text'
]));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result = json_decode(curl_exec($ch), true);
echo $result['result']['text'];
?>`} />
            </Card>

            {/* React Component */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">React Component</h3>
              <CodeBlock id={12} language="jsx" code={`import { useState } from 'react';

export function OCRComponent() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOCR = async () => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/ocr/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'tesseract',
        language: 'eng'
      })
    });
    const data = await res.json();
    setText(data.result.text);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleOCR} disabled={loading}>
        {loading ? 'Processing...' : 'Run OCR'}
      </button>
      {text && <pre>{text}</pre>}
    </div>
  );
}`} />
            </Card>
          </TabsContent>

          {/* Deployment */}
          <TabsContent value="deployment" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Docker Deployment</h3>
              <CodeBlock id={13} language="yaml" code={`version: '3.9'

services:
  ocr:
    image: tesseractshadow/tesseract:latest
    ports:
      - "3001:3001"
    environment:
      OCR_PROVIDER: tesseract
      MAX_WORKERS: 2
      OFFLINE_MODE: "true"
    volumes:
      - ./uploads:/app/uploads
      - ./output:/app/output
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s`} />

              <h4 className="font-semibold text-sm mt-6 mb-2">Start Service</h4>
              <CodeBlock id={14} language="bash" code={`docker-compose up -d
docker-compose logs -f ocr
curl http://localhost:3001/health`} />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Environment Variables</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-blue-500 pl-4">
                  <code className="text-sm font-semibold">OCR_PROVIDER=tesseract</code>
                  <p className="text-xs text-gray-600">Provider type</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <code className="text-sm font-semibold">MAX_WORKERS=2</code>
                  <p className="text-xs text-gray-600">Parallel workers</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <code className="text-sm font-semibold">OFFLINE_MODE=true</code>
                  <p className="text-xs text-gray-600">Run offline only</p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <code className="text-sm font-semibold">CACHE_ENABLED=true</code>
                  <p className="text-xs text-gray-600">Enable caching</p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Base URL:</strong> <code>http://localhost:5000/api</code> | <strong>Free:</strong> No API keys | <strong>Offline:</strong> Fully offline capable
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
