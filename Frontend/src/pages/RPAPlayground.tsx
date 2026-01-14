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
  Bot, 
  Play, 
  Zap,
  CheckCircle, 
  Clock,
  Server,
  Globe,
  Workflow,
  Loader2,
  Copy,
  Plus,
  Trash2,
  Settings,
  Calendar,
  Link,
  AlertCircle,
  ArrowRight,
  GripVertical,
  ChevronDown,
  Save,
  DownloadCloud,
  Upload,
  Eye,
  Edit2
} from "lucide-react";
import { rpaAPI, platformAPI } from "@/lib/api";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface WorkflowStep {
  type: string;
  action: string;
  config?: Record<string, unknown>;
}

interface Platform {
  id: string;
  name: string;
  description: string;
  endpoints: Record<string, string>;
  authMethods: string[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
}

interface StepExecution {
  stepNumber: number;
  type: string;
  action: string;
  status: 'completed' | 'failed' | 'running';
  duration: number;
  output?: Record<string, unknown>;
  error?: string;
}

interface ActionType {
  id: string;
  name: string;
  description: string;
  actions: string[];
}

interface WorkflowRun {
  runId: string;
  workflowId: string;
  workflowName: string;
  status: 'completed' | 'failed' | 'running';
  startTime: string;
  endTime: string;
  steps: StepExecution[];
}

interface CustomWorkflow {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  createdAt: string;
  updatedAt: string;
}

interface DeployInstance {
  url: string;
  id: string;
  status: string;
  [key: string]: unknown;
}

interface DeployResult {
  success: boolean;
  instance?: DeployInstance;
  message: string;
  dockerCompose?: Record<string, unknown>;
}

export default function RPAPlayground() {
  const [activeTab, setActiveTab] = useState<"demo" | "platforms" | "actions" | "deploy" | "builder">("demo");
  const [connectionTest, setConnectionTest] = useState<{ platform: string; success: boolean; message: string; latency?: number } | null>(null);
  const [deployResult, setDeployResult] = useState<DeployResult | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [actionTypes, setActionTypes] = useState<ActionType[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("invoice_processing");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WorkflowRun | null>(null);
  
  // Flow Builder States
  const [customWorkflows, setCustomWorkflows] = useState<CustomWorkflow[]>([]);
  const [currentWorkflow, setCurrentWorkflow] = useState<CustomWorkflow>({
    id: `workflow_${Date.now()}`,
    name: "New Workflow",
    description: "",
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [builderLoading, setBuilderLoading] = useState(false);
  const [builderError, setBuilderError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [platformsRes, templatesRes, actionsRes] = await Promise.all([
        rpaAPI.getPlatforms(),
        rpaAPI.getTemplates(),
        rpaAPI.getActionTypes()
      ]);
      setPlatforms(platformsRes.data.data || []);
      setTemplates(templatesRes.data.data || []);
      setActionTypes(actionsRes.data.data || []);
      if (platformsRes.data.data?.length > 0) {
        setSelectedPlatform(platformsRes.data.data[0].id);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDemoRPA = async () => {
    setLoading(true);
    setResult(null);
    try {
      const response = await rpaAPI.demo({ templateId: selectedTemplate });
      setResult(response.data.data);
    } catch (error) {
      console.error("Error executing RPA:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    setConnectionTest(null);
    try {
      const response = await rpaAPI.testConnection({
        platformId: selectedPlatform,
        credentials: {}
      });
      setConnectionTest(response.data.data);
    } catch (error) {
      console.error("Error testing connection:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoDeployment = async () => {
    setLoading(true);
    setDeployResult(null);
    try {
      const response = await platformAPI.demoDeployment(['ocr', 'rpa']);
      setDeployResult(response.data.data);
    } catch (error) {
      console.error("Error deploying:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-500";
      case "failed": return "bg-red-500";
      case "running": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  // Flow Builder Functions
  const addStep = (stepType: string) => {
    const newStep: WorkflowStep = {
      type: stepType,
      action: "select_action",
      config: {}
    };
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep],
      updatedAt: new Date().toISOString()
    }));
  };

  const removeStep = (index: number) => {
    setCurrentWorkflow(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
      updatedAt: new Date().toISOString()
    }));
    if (expandedStep === index) setExpandedStep(null);
  };

  const updateStep = (index: number, updates: Partial<WorkflowStep>) => {
    setCurrentWorkflow(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = { ...newSteps[index], ...updates };
      return {
        ...prev,
        steps: newSteps,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const updateStepConfig = (index: number, key: string, value: unknown) => {
    setCurrentWorkflow(prev => {
      const newSteps = [...prev.steps];
      newSteps[index] = {
        ...newSteps[index],
        config: { ...newSteps[index].config, [key]: value }
      };
      return {
        ...prev,
        steps: newSteps,
        updatedAt: new Date().toISOString()
      };
    });
  };

  const saveWorkflow = () => {
    if (!currentWorkflow.name.trim()) {
      alert("Please enter a workflow name");
      return;
    }
    const existing = customWorkflows.find(w => w.id === currentWorkflow.id);
    if (existing) {
      setCustomWorkflows(customWorkflows.map(w => w.id === currentWorkflow.id ? currentWorkflow : w));
    } else {
      setCustomWorkflows([...customWorkflows, currentWorkflow]);
    }
    alert("Workflow saved!");
  };

  const executeCustomWorkflow = async () => {
    if (currentWorkflow.steps.length === 0) {
      setBuilderError("Please add steps to your workflow");
      return;
    }
    setBuilderLoading(true);
    setBuilderError(null);
    setResult(null);
    try {
      // First, create the workflow on the backend
      const createResponse = await rpaAPI.createWorkflow({
        name: currentWorkflow.name,
        description: currentWorkflow.description,
        steps: currentWorkflow.steps
      });
      
      const workflowId = createResponse.data.data.id;
      
      // Then execute it
      const executeResponse = await rpaAPI.executeWorkflow(workflowId, {});
      
      setResult(executeResponse.data.data);
    } catch (error: unknown) {
      console.error("Error executing custom workflow:", error);
      const httpError = error as { response?: { data?: { error?: string } }; message?: string };
      const errorMsg = httpError.response?.data?.error || httpError.message || "Unknown error occurred";
      setBuilderError(`Error: ${errorMsg}`);
    } finally {
      setBuilderLoading(false);
    }
  };

  const exportWorkflow = () => {
    const json = JSON.stringify(currentWorkflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentWorkflow.name || 'workflow'}.json`;
    a.click();
  };

  const loadWorkflow = (workflow: CustomWorkflow) => {
    setCurrentWorkflow(workflow);
    setExpandedStep(null);
  };

  return (
    <DashboardLayout
      title="RPA Playground"
      subtitle="Test RPA workflows with multi-platform integration"
    >
      <div className="space-y-6">
        {/* Workflow Templates */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Workflow className="w-5 h-5 text-orange-600" />
            Workflow Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template.id)}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm">{template.name}</h4>
                  <Badge variant="outline" className="text-xs">
                    {template.steps.length} steps
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-3">{template.description}</p>
                <div className="flex flex-wrap gap-1">
                  {template.steps.slice(0, 3).map((step, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {step.type}
                    </Badge>
                  ))}
                  {template.steps.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.steps.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "demo" | "platforms" | "actions" | "deploy" | "builder")}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Demo Run
            </TabsTrigger>
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Workflow className="w-4 h-4" />
              Flow Builder
            </TabsTrigger>
            <TabsTrigger value="platforms" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Platforms
            </TabsTrigger>
            <TabsTrigger value="actions" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Actions
            </TabsTrigger>
            <TabsTrigger value="deploy" className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Deploy
            </TabsTrigger>
          </TabsList>

          {/* Demo Run Tab */}
          <TabsContent value="demo" className="space-y-4 mt-4">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Execute Demo Workflow</h3>
                  <p className="text-sm text-gray-600">
                    Run {templates.find(t => t.id === selectedTemplate)?.name} with simulated data
                  </p>
                </div>
                <Button onClick={handleDemoRPA} disabled={loading} size="lg">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Execute Workflow
                    </>
                  )}
                </Button>
              </div>

              {/* Workflow Steps Preview */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Workflow Steps</h4>
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {templates.find(t => t.id === selectedTemplate)?.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="flex-shrink-0 p-3 bg-gray-100 rounded-lg text-center min-w-[100px]">
                        <p className="text-xs text-gray-500">Step {idx + 1}</p>
                        <p className="font-medium text-sm capitalize">{step.type}</p>
                        <p className="text-xs text-gray-600">{step.action}</p>
                      </div>
                      {idx < (templates.find(t => t.id === selectedTemplate)?.steps.length || 0) - 1 && (
                        <ArrowRight className="w-5 h-5 text-gray-400 mx-2 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Results */}
            {result && (
              <Card className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Execution Result
                  </h3>
                  <Badge className={`${getStatusColor(result.status)} text-white`}>
                    {result.status}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-600 mb-1">Workflow</p>
                    <p className="font-semibold text-sm">{result.workflowName}</p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-600 mb-1">Steps Completed</p>
                    <p className="font-semibold">{result.steps.filter(s => s.status === 'completed').length}/{result.steps.length}</p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <p className="text-xs text-purple-600 mb-1">Total Duration</p>
                    <p className="font-semibold">{result.steps.reduce((acc, s) => acc + s.duration, 0)}ms</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-xs text-orange-600 mb-1">Run ID</p>
                    <p className="font-semibold text-xs truncate">{result.runId}</p>
                  </div>
                </div>

                {/* Step Results */}
                <div className="space-y-3">
                  <h4 className="font-medium">Step Execution Details</h4>
                  {result.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getStatusColor(step.status)}`}>
                        {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">Step {step.stepNumber}: {step.type}</span>
                          <Badge variant="outline" className="text-xs">{step.action}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {step.duration}ms
                          </span>
                          {step.output && (
                            <span className="text-green-600">Output: {JSON.stringify(step.output).slice(0, 50)}...</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Flow Builder Tab */}
          <TabsContent value="builder" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Main Builder */}
              <div className="lg:col-span-3 space-y-4">
                {/* Workflow Info */}
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="workflow-name" className="text-sm font-medium">Workflow Name</Label>
                      <Input
                        id="workflow-name"
                        value={currentWorkflow.name}
                        onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter workflow name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="workflow-desc" className="text-sm font-medium">Description</Label>
                      <Textarea
                        id="workflow-desc"
                        value={currentWorkflow.description}
                        onChange={(e) => setCurrentWorkflow(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what this workflow does"
                        className="mt-1 resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                </Card>

                {/* Workflow Canvas */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-orange-600" />
                    Workflow Steps ({currentWorkflow.steps.length})
                  </h3>

                  {currentWorkflow.steps.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>No steps added yet. Add your first step!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {currentWorkflow.steps.map((step, idx) => (
                        <div key={idx}>
                          <div
                            onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
                            className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <GripVertical className="w-5 h-5 text-gray-400" />
                                <div className="bg-orange-100 text-orange-700 w-8 h-8 rounded flex items-center justify-center font-semibold text-sm">
                                  {idx + 1}
                                </div>
                                <div>
                                  <p className="font-medium capitalize">{step.type}</p>
                                  <p className="text-sm text-gray-600 capitalize">{step.action}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedStep === idx ? 'rotate-180' : ''}`} />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeStep(idx);
                                  }}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Step Configuration */}
                          {expandedStep === idx && (
                            <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-200">
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">Action Type</Label>
                                  <Select value={step.action} onValueChange={(value) => updateStep(idx, { action: value })}>
                                    <SelectTrigger className="mt-1">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="api_call">API Call</SelectItem>
                                      <SelectItem value="data_transform">Data Transform</SelectItem>
                                      <SelectItem value="file_operation">File Operation</SelectItem>
                                      <SelectItem value="conditional">Conditional</SelectItem>
                                      <SelectItem value="loop">Loop</SelectItem>
                                      <SelectItem value="wait">Wait</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Configuration</Label>
                                  <div className="mt-2 space-y-2">
                                    <div>
                                      <label className="text-xs text-gray-600">Endpoint</label>
                                      <Input
                                        value={(step.config?.endpoint as string) || ""}
                                        onChange={(e) => updateStepConfig(idx, 'endpoint', e.target.value)}
                                        placeholder="/api/endpoint"
                                        className="text-sm"
                                      />
                                    </div>
                                    <div>
                                      <label className="text-xs text-gray-600">Method</label>
                                      <Select value={(step.config?.method as string) || "GET"} onValueChange={(value) => updateStepConfig(idx, 'method', value)}>
                                        <SelectTrigger className="text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="GET">GET</SelectItem>
                                          <SelectItem value="POST">POST</SelectItem>
                                          <SelectItem value="PUT">PUT</SelectItem>
                                          <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <label className="text-xs text-gray-600">Payload (JSON)</label>
                                      <Textarea
                                        value={(step.config?.payload as string) || ""}
                                        onChange={(e) => updateStepConfig(idx, 'payload', e.target.value)}
                                        placeholder='{"key": "value"}'
                                        className="text-xs font-mono resize-none"
                                        rows={2}
                                      />
                                    </div>
                                  </div>
                                </div>

                                {idx < currentWorkflow.steps.length - 1 && (
                                  <div className="pt-2 border-t">
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                      <ArrowRight className="w-3 h-3" />
                                      Next: {currentWorkflow.steps[idx + 1].action}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Execution Result for Custom Workflow */}
                {result && activeTab === "builder" && (
                  <Card className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Execution Result
                      </h3>
                      <Badge className={`${getStatusColor(result.status)} text-white`}>
                        {result.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 mb-1">Workflow</p>
                        <p className="font-semibold text-sm">{result.workflowName}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-green-600 mb-1">Steps Completed</p>
                        <p className="font-semibold">{result.steps.filter(s => s.status === 'completed').length}/{result.steps.length}</p>
                      </div>
                      <div className="bg-purple-50 p-3 rounded-lg">
                        <p className="text-xs text-purple-600 mb-1">Total Duration</p>
                        <p className="font-semibold">{result.steps.reduce((acc, s) => acc + s.duration, 0)}ms</p>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <p className="text-xs text-orange-600 mb-1">Run ID</p>
                        <p className="font-semibold text-xs truncate">{result.runId}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Step Execution Details</h4>
                      {result.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getStatusColor(step.status)}`}>
                            {step.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">Step {step.stepNumber}: {step.type}</span>
                              <Badge variant="outline" className="text-xs">{step.action}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {step.duration}ms
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4">
                {/* Error Display */}
                {builderError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm text-red-800 font-medium">Error</p>
                        <p className="text-xs text-red-700 mt-1">{builderError}</p>
                      </div>
                      <button onClick={() => setBuilderError(null)} className="text-red-600 hover:text-red-800">
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 text-sm">Actions</h4>
                  <div className="space-y-2">
                    <Button onClick={executeCustomWorkflow} disabled={builderLoading || currentWorkflow.steps.length === 0} className="w-full">
                      {builderLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Running...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Execute
                        </>
                      )}
                    </Button>
                    <Button onClick={saveWorkflow} variant="outline" className="w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button onClick={exportWorkflow} variant="outline" className="w-full">
                      <DownloadCloud className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </Card>

                {/* Add Step */}
                <Card className="p-4">
                  <h4 className="font-semibold mb-3 text-sm">Add Step</h4>
                  <div className="space-y-2">
                    {['api_call', 'data_transform', 'file_operation'].map((stepType) => (
                      <Button
                        key={stepType}
                        onClick={() => addStep(stepType)}
                        variant="outline"
                        className="w-full justify-start text-xs"
                      >
                        <Plus className="w-3 h-3 mr-2" />
                        {stepType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </Button>
                    ))}
                  </div>
                </Card>

                {/* Saved Workflows */}
                {customWorkflows.length > 0 && (
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 text-sm">Saved Workflows</h4>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {customWorkflows.map((workflow) => (
                        <Button
                          key={workflow.id}
                          onClick={() => loadWorkflow(workflow)}
                          variant="outline"
                          className="w-full justify-start text-xs h-auto py-2 text-left"
                        >
                          <Edit2 className="w-3 h-3 mr-2 flex-shrink-0" />
                          <div className="truncate">
                            <p className="font-medium truncate">{workflow.name}</p>
                            <p className="text-xs text-gray-500">{workflow.steps.length} steps</p>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Platforms Tab */}
          <TabsContent value="platforms" className="space-y-4 mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Available Platforms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => setSelectedPlatform(platform.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPlatform === platform.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <h4 className="font-semibold mb-1">{platform.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{platform.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {platform.authMethods.map((method, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {method}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Connection Test */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-4">
                  <Button onClick={handleTestConnection} disabled={loading || !selectedPlatform} variant="outline">
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Link className="w-4 h-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  {connectionTest && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                      connectionTest.success ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                    }`}>
                      {connectionTest.success ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                      <span className="text-sm">{connectionTest.message}</span>
                      {connectionTest.latency && (
                        <Badge variant="outline" className="text-xs">
                          {connectionTest.latency}ms
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Platform Endpoints */}
            {selectedPlatform && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {platforms.find(p => p.id === selectedPlatform)?.name} Endpoints
                </h3>
                <div className="space-y-2">
                  {Object.entries(platforms.find(p => p.id === selectedPlatform)?.endpoints || {}).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium capitalize">{key}</span>
                      <code className="text-sm bg-gray-200 px-2 py-1 rounded">{String(value)}</code>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-4 mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Available Action Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actionTypes.map((actionType) => (
                  <div key={actionType.id} className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-1">{actionType.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{actionType.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {actionType.actions.map((action, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {action}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Deploy Tab */}
          <TabsContent value="deploy" className="space-y-4 mt-4">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Docker Deployment</h3>
              <p className="text-gray-600 mb-6">
                Deploy Otobook services using Docker. The system is designed to work with your friend's PaaS platform.
              </p>

              <Button onClick={handleDemoDeployment} disabled={loading} className="mb-6">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4 mr-2" />
                    Demo Deployment
                  </>
                )}
              </Button>

              {deployResult && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${
                    deployResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}>
                    <div className="flex items-center gap-2 mb-2">
                      {deployResult.success ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-semibold">{deployResult.message}</span>
                    </div>
                    {deployResult.instance && (
                      <p className="text-sm">
                        Instance URL: <a href={deployResult.instance.url} className="text-blue-600 underline">{deployResult.instance.url}</a>
                      </p>
                    )}
                  </div>

                  {/* Docker Compose Preview */}
                  {deployResult.dockerCompose && (
                    <div>
                      <h4 className="font-medium mb-2">Generated docker-compose.yml</h4>
                      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-xs overflow-x-auto max-h-80">
                        <pre>{JSON.stringify(deployResult.dockerCompose, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* PaaS Integration */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">PaaS Integration</h3>
              <p className="text-gray-600 mb-4">
                Connect to your friend's PaaS platform for managed deployment.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">PaaS API URL</label>
                  <Input placeholder="https://your-paas.example.com/api" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <Input type="password" placeholder="Enter your API key" />
                </div>
              </div>
              <Button variant="outline" className="mt-4">
                <Link className="w-4 h-4 mr-2" />
                Connect to PaaS
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
