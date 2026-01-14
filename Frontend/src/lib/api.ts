import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userAPI = {
  getAllUsers: () => apiClient.get('/users'),
  getUserById: (id: string | number) => apiClient.get(`/users/${id}`),
  createUser: (userData: any) => apiClient.post('/users', userData),
  updateUser: (id: string | number, userData: any) => apiClient.put(`/users/${id}`, userData),
  deleteUser: (id: string | number) => apiClient.delete(`/users/${id}`),
  getUserStats: () => apiClient.get('/users/stats'),
  seedDemoData: () => apiClient.post('/users/seed-demo'),
};

// Documentation APIs
export const documentationAPI = {
  getAllDocumentation: () => apiClient.get('/documentation'),
  getDocumentationByType: (type: string) => apiClient.get(`/documentation/${type}`),
  seedDocumentation: () => apiClient.post('/documentation/seed'),
};

// OCR APIs
export const ocrAPI = {
  // Get all OCR providers
  getProviders: () => apiClient.get('/ocr/providers'),
  
  // Get specific provider
  getProvider: (providerId: string) => apiClient.get(`/ocr/providers/${providerId}`),
  
  // Compare providers
  compareProviders: () => apiClient.get('/ocr/providers/compare'),
  
  // Demo OCR processing (no image required)
  demo: (options: { provider?: string; language?: string; outputFormat?: string }) => 
    apiClient.post('/ocr/demo', options),
  
  // Process image with OCR
  processImage: (data: { imageData: string; provider?: string; language?: string; outputFormat?: string; enhanceImage?: boolean }) => 
    apiClient.post('/ocr/process', data),
  
  // Batch process images
  batchProcess: (data: { images: string[]; provider?: string; language?: string; outputFormat?: string }) => 
    apiClient.post('/ocr/batch', data),
  
  // Extract structured data (tables, forms)
  extractStructuredData: (data: { imageData: string; provider?: string; dataType?: string }) => 
    apiClient.post('/ocr/extract', data),
  
  // Get platform-specific configuration
  getPlatformConfig: (platform: string) => apiClient.get(`/ocr/platform/${platform}`),
  
  // Get Docker deployment configuration
  getDockerConfig: (params?: { provider?: string; scalability?: string }) => 
    apiClient.get('/ocr/docker-config', { params }),
};

// RPA APIs
export const rpaAPI = {
  // Get all action types
  getActionTypes: () => apiClient.get('/rpa/actions'),
  
  // Get all platforms
  getPlatforms: () => apiClient.get('/rpa/platforms'),
  
  // Get specific platform config
  getPlatformConfig: (platformId: string) => apiClient.get(`/rpa/platforms/${platformId}`),
  
  // Get all workflow templates
  getTemplates: () => apiClient.get('/rpa/templates'),
  
  // Get specific template
  getTemplate: (templateId: string) => apiClient.get(`/rpa/templates/${templateId}`),
  
  // Create a new workflow
  createWorkflow: (workflow: { name: string; description?: string; steps: any[]; schedule?: any; platformConnections?: any }) => 
    apiClient.post('/rpa/workflows', workflow),
  
  // Get all workflows
  getWorkflows: () => apiClient.get('/rpa/workflows'),
  
  // Get specific workflow
  getWorkflow: (workflowId: string) => apiClient.get(`/rpa/workflows/${workflowId}`),
  
  // Update workflow
  updateWorkflow: (workflowId: string, updates: any) => apiClient.put(`/rpa/workflows/${workflowId}`, updates),
  
  // Delete workflow
  deleteWorkflow: (workflowId: string) => apiClient.delete(`/rpa/workflows/${workflowId}`),
  
  // Execute workflow
  executeWorkflow: (workflowId: string, options?: any) => 
    apiClient.post(`/rpa/workflows/${workflowId}/execute`, options),
  
  // Demo workflow execution
  demo: (options?: { templateId?: string }) => apiClient.post('/rpa/demo', options),
  
  // Test platform connection
  testConnection: (data: { platformId: string; credentials?: any }) => 
    apiClient.post('/rpa/test-connection', data),
  
  // Get run history
  getRunHistory: (params?: { workflowId?: string; limit?: number }) => 
    apiClient.get('/rpa/history', { params }),
  
  // Get Docker configuration
  getDockerConfig: (params?: { scalability?: string; queueType?: string }) => 
    apiClient.get('/rpa/docker-config', { params }),
  
  // Get schedule configuration
  getScheduleConfig: () => apiClient.get('/rpa/schedule-config'),
};

// Platform APIs
export const platformAPI = {
  // Get deployment platforms
  getDeploymentPlatforms: () => apiClient.get('/platform/deployments/platforms'),
  
  // Get available integrations
  getIntegrations: (category?: string) => 
    apiClient.get('/platform/integrations', { params: { category } }),
  
  // Create connection
  createConnection: (data: { platform: string; name: string; category?: string; credentials?: any; config?: any }) => 
    apiClient.post('/platform/connections', data),
  
  // Get all connections
  getConnections: (category?: string) => 
    apiClient.get('/platform/connections', { params: { category } }),
  
  // Get specific connection
  getConnection: (connectionId: string) => apiClient.get(`/platform/connections/${connectionId}`),
  
  // Test connection
  testConnection: (connectionId: string) => apiClient.post(`/platform/connections/${connectionId}/test`),
  
  // Delete connection
  deleteConnection: (connectionId: string) => apiClient.delete(`/platform/connections/${connectionId}`),
  
  // Create deployment
  createDeployment: (data: { name: string; platform: string; services?: string[]; config?: any }) => 
    apiClient.post('/platform/deployments', data),
  
  // Get all deployments
  getDeployments: () => apiClient.get('/platform/deployments'),
  
  // Get specific deployment
  getDeployment: (deploymentId: string) => apiClient.get(`/platform/deployments/${deploymentId}`),
  
  // Deploy instance
  deploy: (deploymentId: string) => apiClient.post(`/platform/deployments/${deploymentId}/deploy`),
  
  // Generate Docker Compose
  generateDockerCompose: (services?: string[]) => 
    apiClient.post('/platform/generate/docker-compose', { services }),
  
  // Generate Kubernetes manifests
  generateKubernetesManifests: (services?: string[]) => 
    apiClient.post('/platform/generate/kubernetes', { services }),
  
  // Get PaaS configuration
  getPaaSConfig: (provider?: string) => 
    apiClient.get('/platform/paas-config', { params: { provider } }),
  
  // Demo deployment
  demoDeployment: (services?: string[]) => 
    apiClient.post('/platform/demo-deploy', { services }),
};

export default apiClient;
