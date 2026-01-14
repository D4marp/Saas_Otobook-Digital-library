import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Copy, CheckCircle, Code2, Zap, Globe } from "lucide-react";

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

export default function RPADocumentation() {
  return (
    <DashboardLayout
      title="RPA API Documentation"
      subtitle="Complete API reference for Robotic Process Automation workflows"
    >
      <div className="space-y-6">
        {/* Overview */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <div className="flex items-start gap-4">
            <Zap className="w-8 h-8 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">RPA Automation Engine</h2>
              <p className="text-gray-700">
                Real executable workflows. 7 action types (OCR, API, Data, Browser, File, Database, Email). Multi-platform support. Execute and monitor automation tasks across WordPress, Shopify, Notion, Airtable, Google Sheets, and more.
              </p>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="deployment">Deploy</TabsTrigger>
          </TabsList>

          {/* API Endpoints */}
          <TabsContent value="endpoints" className="space-y-6 mt-6">
            {/* GET /api/rpa/platforms */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Get Platforms</h3>
                <Badge>GET</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/rpa/platforms</code>
              <p className="text-sm text-gray-600 mb-4">List all supported platforms</p>
              <CodeBlock id={1} language="bash" code="curl http://localhost:5000/api/rpa/platforms" />
            </Card>

            {/* GET /api/rpa/templates */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Get Templates</h3>
                <Badge>GET</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/rpa/templates</code>
              <p className="text-sm text-gray-600 mb-4">List workflow templates</p>
              <CodeBlock id={2} language="bash" code="curl http://localhost:5000/api/rpa/templates" />
            </Card>

            {/* GET /api/rpa/actions */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Get Action Types</h3>
                <Badge>GET</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/rpa/actions</code>
              <p className="text-sm text-gray-600 mb-4">List available action types</p>
              <CodeBlock id={3} language="json" code={`[
  { type: "ocr", actions: ["extract_text", "extract_form", "extract_table"] },
  { type: "api", actions: ["get", "post", "put", "delete"] },
  { type: "data", actions: ["transform", "validate", "classify", "merge"] },
  { type: "browser", actions: ["navigate", "click", "extract_data"] },
  { type: "file", actions: ["read", "write", "delete", "zip"] },
  { type: "database", actions: ["query", "insert", "update", "delete"] },
  { type: "email", actions: ["send", "read", "forward"] }
]`} />
            </Card>

            {/* POST /api/rpa/create */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Create Workflow</h3>
                <Badge variant="outline">POST</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/rpa/create</code>
              <p className="text-sm text-gray-600 mb-4">Create a new RPA workflow</p>
              <CodeBlock id={4} language="json" code={`{
  "name": "Invoice to Airtable",
  "description": "Extract invoice and save to Airtable",
  "steps": [
    {
      "type": "ocr",
      "action": "extract_text",
      "config": { "language": "eng" }
    },
    {
      "type": "api",
      "action": "post",
      "config": {
        "url": "https://api.airtable.com/v0/BASE/TABLE",
        "headers": { "Authorization": "Bearer TOKEN" }
      }
    }
  ]
}`} />
            </Card>

            {/* POST /api/rpa/execute */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Execute Workflow</h3>
                <Badge variant="outline">POST</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/rpa/execute</code>
              <p className="text-sm text-gray-600 mb-4">Execute a workflow and get results</p>
              <CodeBlock id={5} language="bash" code={`curl -X POST http://localhost:5000/api/rpa/execute \\
  -H "Content-Type: application/json" \\
  -d '{
    "workflowId": "workflow_123",
    "input": {
      "imageData": "base64_image_string",
      "targetPlatform": "airtable"
    }
  }'`} />
            </Card>

            {/* POST /api/rpa/test-connection */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Test Platform Connection</h3>
                <Badge variant="outline">POST</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/rpa/test-connection</code>
              <p className="text-sm text-gray-600 mb-4">Verify connection to platform</p>
              <CodeBlock id={6} language="json" code={`{
  "platform": "wordpress",
  "config": {
    "url": "https://yoursite.com",
    "username": "admin",
    "password": "token"
  }
}`} />
            </Card>

            {/* POST /api/rpa/deploy */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Deploy Workflow</h3>
                <Badge variant="outline">POST</Badge>
              </div>
              <code className="text-sm bg-gray-100 p-3 rounded block mb-4">/api/rpa/deploy</code>
              <p className="text-sm text-gray-600 mb-4">Deploy workflow to production</p>
              <CodeBlock id={7} language="json" code={`{
  "workflowId": "workflow_123",
  "schedule": "0 0 * * *",
  "retryPolicy": {
    "maxRetries": 3,
    "backoffMultiplier": 2
  },
  "notifications": ["email@example.com"]
}`} />
            </Card>
          </TabsContent>

          {/* Workflow Templates */}
          <TabsContent value="workflows" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Invoice Processing", desc: "Extract invoice data and save to platform" },
                { name: "Product Sync", desc: "Sync products between Shopify and WordPress" },
                { name: "Document Archiving", desc: "Classify and archive documents" },
                { name: "Data Backup", desc: "Backup data to Google Sheets/Airtable" },
                { name: "Web Scraping", desc: "Extract web content to database" },
                { name: "Email Automation", desc: "Process emails and trigger actions" }
              ].map((t, i) => (
                <Card key={i} className="p-4 bg-blue-50 border-blue-200">
                  <h4 className="font-semibold text-sm mb-1">{t.name}</h4>
                  <p className="text-xs text-gray-600">{t.desc}</p>
                </Card>
              ))}
            </div>

            {/* Invoice Processing Example */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Invoice Processing Workflow</h3>
              <CodeBlock id={8} language="json" code={`{
  "id": "invoice_processing",
  "name": "Invoice Processing",
  "steps": [
    {
      "stepId": 1,
      "type": "ocr",
      "action": "extract_form",
      "input": { "image": "invoice.pdf" },
      "output": { "invoiceNumber": "", "amount": "", "date": "" }
    },
    {
      "stepId": 2,
      "type": "data",
      "action": "validate",
      "rules": { "invoiceNumber": "required", "amount": "numeric" }
    },
    {
      "stepId": 3,
      "type": "api",
      "action": "post",
      "url": "https://api.airtable.com/v0/base/invoices",
      "headers": { "Authorization": "Bearer TOKEN" }
    }
  ]
}`} />
            </Card>

            {/* Product Sync Example */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Product Sync (Shopify → WordPress)</h3>
              <CodeBlock id={9} language="json" code={`{
  "id": "product_sync",
  "name": "Product Sync",
  "steps": [
    {
      "stepId": 1,
      "type": "api",
      "action": "get",
      "url": "https://your-store.myshopify.com/admin/api/2024-01/products.json",
      "headers": { "X-Shopify-Access-Token": "TOKEN" }
    },
    {
      "stepId": 2,
      "type": "data",
      "action": "transform",
      "mapping": {
        "shopify_title": "post_title",
        "shopify_description": "post_content",
        "shopify_price": "post_meta.price"
      }
    },
    {
      "stepId": 3,
      "type": "api",
      "action": "post",
      "url": "https://yoursite.com/wp-json/wc/v3/products",
      "headers": { "Authorization": "Bearer TOKEN" }
    }
  ]
}`} />
            </Card>
          </TabsContent>

          {/* Code Examples */}
          <TabsContent value="examples" className="space-y-6 mt-6">
            {/* JavaScript */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">JavaScript/Node.js</h3>
              <CodeBlock id={10} language="javascript" code={`const axios = require('axios');

async function executeRPA() {
  // 1. Get available templates
  const templates = await axios.get('http://localhost:5000/api/rpa/templates');
  console.log('Templates:', templates.data);

  // 2. Create custom workflow
  const workflow = await axios.post('http://localhost:5000/api/rpa/create', {
    name: 'My Workflow',
    steps: [
      { type: 'ocr', action: 'extract_text' },
      { type: 'api', action: 'post', url: 'https://api.airtable.com/...' }
    ]
  });

  // 3. Execute workflow
  const result = await axios.post('http://localhost:5000/api/rpa/execute', {
    workflowId: workflow.data.id,
    input: { imageData: 'base64_string' }
  });

  console.log('Execution result:', result.data);
}

executeRPA();`} />
            </Card>

            {/* Python */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Python</h3>
              <CodeBlock id={11} language="python" code={`import requests

# 1. Get platforms
platforms = requests.get('http://localhost:5000/api/rpa/platforms').json()
print('Platforms:', [p['name'] for p in platforms])

# 2. Create workflow
workflow = requests.post('http://localhost:5000/api/rpa/create', json={
    'name': 'Invoice Processing',
    'steps': [
        {'type': 'ocr', 'action': 'extract_form'},
        {'type': 'data', 'action': 'validate'},
        {'type': 'api', 'action': 'post', 'url': 'https://api.example.com'}
    ]
}).json()

# 3. Execute
result = requests.post('http://localhost:5000/api/rpa/execute', json={
    'workflowId': workflow['id'],
    'input': {'imageData': 'base64_data'}
}).json()

print('Result:', result)`} />
            </Card>

            {/* React Component */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">React Component</h3>
              <CodeBlock id={12} language="jsx" code={`import { useState } from 'react';

export function RPAExecutor() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleExecute = async (workflowId) => {
    setLoading(true);
    const res = await fetch('http://localhost:5000/api/rpa/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        workflowId,
        input: { imageData: 'base64_image' }
      })
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={() => handleExecute('workflow_123')}>
        {loading ? 'Executing...' : 'Execute Workflow'}
      </button>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}`} />
            </Card>

            {/* API to API Integration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Integration</h3>
              <CodeBlock id={13} language="javascript" code={`// Example: Extract invoice with OCR, store to Airtable, notify via email

const workflow = {
  name: 'Complete Invoice Workflow',
  steps: [
    // Step 1: Extract with OCR
    {
      type: 'ocr',
      action: 'extract_form',
      config: { targetFields: ['invoiceNumber', 'amount', 'date', 'vendor'] }
    },
    // Step 2: Validate
    {
      type: 'data',
      action: 'validate',
      rules: { invoiceNumber: 'required', amount: 'numeric|>0' }
    },
    // Step 3: Store to Airtable
    {
      type: 'api',
      action: 'post',
      config: {
        url: 'https://api.airtable.com/v0/BASE/Invoices',
        headers: { 'Authorization': 'Bearer PAT' }
      }
    },
    // Step 4: Email notification
    {
      type: 'email',
      action: 'send',
      config: {
        to: 'accounting@company.com',
        subject: 'Invoice processed: {invoiceNumber}',
        template: 'invoice_notification'
      }
    }
  ]
};`} />
            </Card>
          </TabsContent>

          {/* Deployment */}
          <TabsContent value="deployment" className="space-y-6 mt-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Docker Deployment</h3>
              <CodeBlock id={14} language="yaml" code={`version: '3.9'

services:
  rpa:
    image: otobook/rpa-engine:latest
    ports:
      - "5000:5000"
    environment:
      NODE_ENV: production
      REDIS_URL: redis://redis:6379
      DB_HOST: mysql
      DB_PORT: 3306
      MAX_PARALLEL_WORKFLOWS: 5
      WORKFLOW_TIMEOUT: 3600
      LOG_LEVEL: info
    depends_on:
      - mysql
      - redis
    volumes:
      - ./workflows:/app/workflows
      - ./logs:/app/logs
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  scheduler:
    image: otobook/rpa-scheduler:latest
    environment:
      REDIS_URL: redis://redis:6379
      API_URL: http://rpa:5000
    depends_on:
      - redis
      - rpa
    
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: otobook_saas
    volumes:
      - mysql_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  mysql_data:
  redis_data:`} />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Deployment Steps</h3>
              <CodeBlock id={15} language="bash" code={`# 1. Build Docker image
docker build -t otobook/rpa-engine:latest .

# 2. Start all services
docker-compose -f docker-compose.yml up -d

# 3. Verify deployment
docker-compose logs -f rpa

# 4. Check health
curl http://localhost:5000/api/health

# 5. List available platforms
curl http://localhost:5000/api/rpa/platforms`} />
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Environment Variables</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-500 pl-4">
                  <code className="text-sm font-semibold">MAX_PARALLEL_WORKFLOWS=5</code>
                  <p className="text-xs text-gray-600">Concurrent workflow limit</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <code className="text-sm font-semibold">WORKFLOW_TIMEOUT=3600</code>
                  <p className="text-xs text-gray-600">Workflow max duration (seconds)</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <code className="text-sm font-semibold">REDIS_URL=redis://redis:6379</code>
                  <p className="text-xs text-gray-600">Queue and cache server</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <code className="text-sm font-semibold">LOG_LEVEL=info</code>
                  <p className="text-xs text-gray-600">Logging level</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold mb-3">Supported Platforms</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {['WordPress', 'Shopify', 'WooCommerce', 'Notion', 'Airtable', 'Google Sheets'].map((p) => (
                  <Badge key={p} variant="outline" className="w-full text-center justify-center">
                    {p}
                  </Badge>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-sm text-yellow-800">
            <strong>Base URL:</strong> <code>http://localhost:5000/api</code> | <strong>Action Types:</strong> 7 (OCR, API, Data, Browser, File, Database, Email) | <strong>Platforms:</strong> 6+ supported
          </p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
