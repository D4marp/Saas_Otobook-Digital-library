# Otobook SaaS API Documentation

## Overview

Otobook adalah platform SaaS untuk OCR (Optical Character Recognition) dan RPA (Robotic Process Automation) yang dapat diintegrasikan dengan berbagai platform seperti WordPress, Shopify, WooCommerce, dan custom platform lainnya.

## Base URL

```
http://localhost:5000/api
```

Untuk production, gunakan URL dari PaaS provider Anda.

---

## OCR API

### 1. Get All OCR Providers

Mendapatkan daftar semua provider OCR yang tersedia.

```http
GET /api/ocr/providers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "tesseract",
      "name": "Tesseract OCR",
      "description": "Open-source OCR engine, best for printed text",
      "features": ["Multi-language", "Free", "Offline capable"],
      "supportedFormats": ["png", "jpg", "jpeg", "tiff", "bmp", "gif", "webp"],
      "pricing": "Free"
    }
  ]
}
```

### 2. Demo OCR Processing

Mencoba OCR tanpa perlu upload gambar (demo mode).

```http
POST /api/ocr/demo
```

**Request Body:**
```json
{
  "provider": "tesseract",
  "language": "eng",
  "outputFormat": "text"
}
```

**Response:**
```json
{
  "success": true,
  "provider": "tesseract",
  "providerName": "Tesseract OCR",
  "processingTime": 800,
  "language": "eng",
  "confidence": 87.5,
  "result": {
    "text": "This is a sample OCR result..."
  },
  "metadata": {
    "timestamp": "2024-01-15T10:30:00.000Z",
    "wordCount": 25
  },
  "isDemo": true
}
```

### 3. Process Image with OCR

Memproses gambar dengan OCR.

```http
POST /api/ocr/process
```

**Request Body:**
```json
{
  "imageData": "base64_encoded_image_data",
  "provider": "google_vision",
  "language": "eng",
  "outputFormat": "json",
  "enhanceImage": true
}
```

### 4. Extract Structured Data

Mengekstrak data terstruktur (tabel/form) dari dokumen.

```http
POST /api/ocr/extract
```

**Request Body:**
```json
{
  "imageData": "base64_encoded_image_data",
  "provider": "aws_textract",
  "dataType": "table"
}
```

### 5. Get Platform Configuration

Mendapatkan konfigurasi untuk platform tertentu.

```http
GET /api/ocr/platform/:platform
```

**Platforms:** `wordpress`, `shopify`, `wix`, `custom`

---

## RPA API

### 1. Get All Action Types

Mendapatkan semua tipe aksi yang tersedia untuk workflow.

```http
GET /api/rpa/actions
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "browser",
      "name": "Browser Automation",
      "description": "Automate web browser interactions",
      "actions": ["navigate", "click", "type", "scroll", "screenshot", "extract_data"]
    }
  ]
}
```

### 2. Get All Platforms

Mendapatkan daftar platform yang dapat diintegrasikan.

```http
GET /api/rpa/platforms
```

### 3. Get Workflow Templates

Mendapatkan template workflow yang sudah siap pakai.

```http
GET /api/rpa/templates
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "invoice_processing",
      "name": "Invoice Processing",
      "description": "Extract data from invoices and update records",
      "steps": [
        { "type": "ocr", "action": "extract_form", "config": {} },
        { "type": "data", "action": "validate", "config": {} },
        { "type": "database", "action": "insert", "config": {} }
      ]
    }
  ]
}
```

### 4. Create Workflow

Membuat workflow baru.

```http
POST /api/rpa/workflows
```

**Request Body:**
```json
{
  "name": "My Custom Workflow",
  "description": "Description of the workflow",
  "steps": [
    {
      "type": "browser",
      "action": "navigate",
      "config": { "url": "https://example.com" }
    },
    {
      "type": "ocr",
      "action": "extract_text",
      "config": { "provider": "tesseract" }
    }
  ],
  "schedule": {
    "type": "cron",
    "pattern": "0 9 * * *"
  }
}
```

### 5. Execute Workflow

Menjalankan workflow.

```http
POST /api/rpa/workflows/:workflowId/execute
```

### 6. Demo Workflow Execution

Menjalankan demo workflow dari template.

```http
POST /api/rpa/demo
```

**Request Body:**
```json
{
  "templateId": "invoice_processing"
}
```

### 7. Test Platform Connection

Menguji koneksi ke platform tertentu.

```http
POST /api/rpa/test-connection
```

**Request Body:**
```json
{
  "platformId": "wordpress",
  "credentials": {
    "apiUrl": "https://your-site.com",
    "apiKey": "your_api_key"
  }
}
```

---

## Platform Integration API

### 1. Get Deployment Platforms

Mendapatkan platform deployment yang tersedia.

```http
GET /api/platform/deployments/platforms
```

### 2. Get Available Integrations

Mendapatkan integrasi yang tersedia berdasarkan kategori.

```http
GET /api/platform/integrations?category=cms
```

**Categories:** `cms`, `ecommerce`, `productivity`, `storage`, `crm`, `database`

### 3. Create Connection

Membuat koneksi ke platform.

```http
POST /api/platform/connections
```

**Request Body:**
```json
{
  "platform": "wordpress",
  "name": "My WordPress Site",
  "category": "cms",
  "credentials": {
    "apiUrl": "https://mysite.com",
    "apiKey": "key_123"
  }
}
```

### 4. Generate Docker Compose

Menghasilkan konfigurasi Docker Compose.

```http
POST /api/platform/generate/docker-compose
```

**Request Body:**
```json
{
  "services": ["ocr", "rpa"]
}
```

### 5. Get PaaS Configuration

Mendapatkan konfigurasi untuk integrasi dengan PaaS.

```http
GET /api/platform/paas-config?provider=custom
```

---

## Integration Examples

### WordPress Plugin Integration

```php
<?php
// WordPress Plugin Example
function otobook_ocr_process($image_url) {
    $api_url = 'https://your-otobook-instance.com/api/ocr/process';
    
    $response = wp_remote_post($api_url, array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . OTOBOOK_API_KEY
        ),
        'body' => json_encode(array(
            'imageData' => base64_encode(file_get_contents($image_url)),
            'provider' => 'tesseract',
            'language' => 'eng'
        ))
    ));
    
    return json_decode(wp_remote_retrieve_body($response), true);
}
```

### JavaScript/Node.js Integration

```javascript
// Node.js Integration
const axios = require('axios');

const otobookAPI = axios.create({
  baseURL: 'https://your-otobook-instance.com/api',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

// OCR Demo
async function runOCRDemo() {
  const result = await otobookAPI.post('/ocr/demo', {
    provider: 'google_vision',
    language: 'eng',
    outputFormat: 'json'
  });
  console.log(result.data);
}

// RPA Workflow Execution
async function executeWorkflow(workflowId) {
  const result = await otobookAPI.post(`/rpa/workflows/${workflowId}/execute`);
  return result.data;
}
```

### Python Integration

```python
import requests

class OtobookAPI:
    def __init__(self, base_url, api_key):
        self.base_url = base_url
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def ocr_demo(self, provider='tesseract', language='eng'):
        response = requests.post(
            f'{self.base_url}/ocr/demo',
            json={'provider': provider, 'language': language},
            headers=self.headers
        )
        return response.json()
    
    def execute_workflow(self, workflow_id):
        response = requests.post(
            f'{self.base_url}/rpa/workflows/{workflow_id}/execute',
            headers=self.headers
        )
        return response.json()

# Usage
api = OtobookAPI('https://your-otobook-instance.com/api', 'YOUR_API_KEY')
result = api.ocr_demo(provider='google_vision')
print(result)
```

---

## Docker Deployment

### Quick Start

```bash
# Clone repository
git clone https://github.com/your-repo/otobook-saas.git
cd otobook-saas

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `5000` |
| `DB_HOST` | MySQL host | `mysql` |
| `DB_NAME` | Database name | `otobook_saas` |
| `REDIS_HOST` | Redis host | `redis` |
| `OCR_PROVIDER` | Default OCR provider | `tesseract` |
| `RPA_WORKERS` | Number of RPA workers | `2` |

### PaaS Integration

Untuk integrasi dengan PaaS teman Anda:

1. Build Docker images:
```bash
docker build -t otobook-backend ./Backend
docker build -t otobook-frontend ./Frontend
```

2. Push ke registry PaaS:
```bash
docker tag otobook-backend your-paas-registry/otobook-backend
docker push your-paas-registry/otobook-backend
```

3. Configure PaaS dengan endpoint API:
```
POST /api/v1/deploy
{
  "image": "your-paas-registry/otobook-backend",
  "env": {
    "PORT": "5000",
    "DB_HOST": "managed-mysql.paas.com"
  }
}
```

---

## Support

- GitHub Issues: [Link]
- Documentation: [Link]
- Email: support@otobook.com
