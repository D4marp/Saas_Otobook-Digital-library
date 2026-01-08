import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Bot, CheckCircle, AlertCircle } from "lucide-react";
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

export default function RPADocumentation() {
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocumentation();
  }, []);

  const fetchDocumentation = async () => {
    try {
      const response = await documentationAPI.getDocumentationByType("RPA");
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
      <DashboardLayout title="RPA Documentation" subtitle="Loading...">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading RPA documentation...</p>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Robot Framework & RPA Documentation"
      subtitle="Master Robotic Process Automation with Robot Framework"
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-800">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* Overview */}
        <Card className="p-6 bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start gap-4">
            <Bot className="w-8 h-8 text-orange-600 mt-1 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Robot Framework & RPA</h2>
              <p className="text-gray-700">
                Automate business processes with Robot Framework. From installation to advanced techniques, CI/CD integration, and OTobook SaaS integration.
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs - Dynamic + Flutter */}
        {docs.length > 0 ? (
          <Tabs defaultValue={docs[0]?.title || "Installation"} className="w-full">
            <TabsList className="grid w-full grid-cols-5 lg:grid-cols-6">
              {docs.map((doc) => (
                <TabsTrigger key={doc.id} value={doc.title || ""} className="text-xs sm:text-sm">
                  {doc.title?.split(" ")[0]}
                </TabsTrigger>
              ))}
              <TabsTrigger value="Flutter" className="text-xs sm:text-sm">Flutter</TabsTrigger>
            </TabsList>

            {docs.map((doc) => (
              <TabsContent key={doc.id} value={doc.title || ""} className="space-y-6 mt-6">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-2">{doc.title}</h3>
                  <p className="text-gray-700 mb-6">{doc.description}</p>
                  <p className="text-gray-600 mb-6">{doc.content}</p>

                  {/* Installation */}
                  {doc.title?.includes("Installation") && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">System Requirements</h4>
                        <ul className="space-y-2 text-gray-700 mb-4">
                          <li>• Python 3.7 or higher</li>
                          <li>• 2GB RAM minimum</li>
                          <li>• 500MB disk space</li>
                          <li>• Windows, macOS, or Linux</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Step 1: Install Python</h4>
                        <CodeBlock
                          id={doc.id}
                          code="# Download from python.org and install\npython --version  # Verify installation"
                          language="bash"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Step 2: Install Robot Framework</h4>
                        <CodeBlock
                          id={doc.id + 1}
                          code="pip install robotframework\nrobot --version  # Verify installation"
                          language="bash"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Step 3: Install Libraries</h4>
                        <CodeBlock
                          id={doc.id + 2}
                          code={`pip install robotframework-seleniumlibrary
pip install robotframework-requests
pip install robotframework-datalibrary
pip install robotframework-pabot
pip install robotframework-image-comparison`}
                          language="bash"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Step 4: Create First Test</h4>
                        <CodeBlock
                          id={doc.id + 3}
                          code={`*** Settings ***
Library    BuiltIn

*** Test Cases ***
My First Test
    Log    Hello, Robot Framework!
    Should Be Equal    ${1}    ${1}`}
                          language="robot"
                        />
                      </div>
                    </div>
                  )}

                  {/* Basics */}
                  {doc.title?.includes("Basics") && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Test File Structure</h4>
                        <CodeBlock
                          id={doc.id + 10}
                          code={`*** Settings ***
Library    Collections
Library    BuiltIn

*** Variables ***
\${BROWSER}    chrome
\${URL}    https://example.com

*** Test Cases ***
User Login Test
    Open Browser    \${URL}    \${BROWSER}
    Login With Credentials    admin    password
    Verify Dashboard

*** Keywords ***
Login With Credentials
    [Arguments]    \${username}    \${password}
    Input Text    id:username    \${username}
    Input Password    id:password    \${password}
    Click Button    id:login`}
                          language="robot"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Common Keywords</h4>
                        <CodeBlock
                          id={doc.id + 11}
                          code={`Log    message            # Print to console
Sleep    2s               # Wait 2 seconds
Should Be Equal    a    b    # Assert equality
Run Keyword If    condition    keyword
Repeat Keyword    5 times    keyword
Set Global Variable    \${VAR}    value`}
                          language="robot"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Data-Driven Testing</h4>
                        <CodeBlock
                          id={doc.id + 12}
                          code={`*** Test Cases ***
Login With Different Users
    [Template]    Login Test
    admin         password123
    user1         pass@456
    user2         secure789

*** Keywords ***
Login Test
    [Arguments]    \${username}    \${password}
    Open Browser    https://app.com    chrome
    Input Text    id:user    \${username}
    Input Text    id:pwd    \${password}
    Click Button    Login
    [Teardown]    Close Browser`}
                          language="robot"
                        />
                      </div>
                    </div>
                  )}

                  {/* Advanced */}
                  {doc.title?.includes("Advanced") && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">Custom Python Library</h4>
                        <CodeBlock
                          id={doc.id + 20}
                          code={`# my_library.py
class MyLibrary:
    def __init__(self):
        self.count = 0
    
    def increment_counter(self):
        self.count += 1
        return self.count
    
    def custom_operation(self, arg1, arg2):
        return f"Result: {arg1} + {arg2}"
    
    def validate_email(self, email):
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, email))`}
                          language="python"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">API Testing</h4>
                        <CodeBlock
                          id={doc.id + 21}
                          code={`*** Settings ***
Library    RequestsLibrary
Library    Collections

*** Test Cases ***
Test API Endpoint
    Create Session    api    https://api.example.com
    \${response}=    Get Request    api    /users
    Should Be Equal As Integers    \${response.status_code}    200
    \${body}=    Convert To Dictionary    \${response.json()}
    Should Contain Key    \${body}    data`}
                          language="robot"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Database Testing</h4>
                        <CodeBlock
                          id={doc.id + 22}
                          code={`*** Settings ***
Library    DatabaseLibrary

*** Test Cases ***
Test Database Query
    Connect To Database    mysql    dbname    root    password    localhost
    \${result}=    Query    SELECT * FROM users WHERE id=1
    Should Be Equal    \${result}[0][0]    1
    Disconnect From Database`}
                          language="robot"
                        />
                      </div>
                    </div>
                  )}

                  {/* CI/CD */}
                  {doc.title?.includes("CI/CD") && (
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold mb-3">GitHub Actions Workflow</h4>
                        <CodeBlock
                          id={doc.id + 30}
                          code={`name: Robot Tests
on: [push, pull_request]

jobs:
  robot:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - run: pip install robotframework
      - run: robot tests/`}
                          language="yaml"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Docker Integration</h4>
                        <CodeBlock
                          id={doc.id + 31}
                          code={`FROM python:3.9
RUN pip install robotframework robotframework-seleniumlibrary
COPY tests /tests
WORKDIR /tests
CMD ["robot", "."]`}
                          language="dockerfile"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">OTobook SaaS Integration</h4>
                        <CodeBlock
                          id={doc.id + 32}
                          code={`*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Submit Test Report to OTobook
    Create Session    otobook    http://localhost:3001/api
    \${payload}=    Create Dictionary    testName=My Test    status=passed
    \${response}=    Post Request    otobook    /automation/report    json=\${payload}
    Should Be Equal As Integers    \${response.status_code}    200`}
                          language="robot"
                        />
                      </div>
                    </div>
                  )}

                  {/* Quick Reference */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-orange-900 mb-3">Key Takeaways</h4>
                    <ul className="space-y-2 text-sm text-orange-800">
                      <li>✓ Robot Framework is easy to learn and human-readable</li>
                      <li>✓ Supports multiple libraries for different testing needs</li>
                      <li>✓ Excellent for both manual and automated testing</li>
                      <li>✓ Great community and extensive documentation</li>
                      <li>✓ Can be integrated into CI/CD pipelines</li>
                    </ul>
                  </div>
                </Card>
              </TabsContent>
            ))}

            {/* Flutter Tab */}
            <TabsContent value="Flutter" className="space-y-6 mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Flutter RPA Integration</h3>
                <p className="text-gray-700 mb-6">
                  Build cross-platform mobile RPA applications with Flutter. Integrate Robot Framework automation with Flutter apps through platform channels and REST APIs.
                </p>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">1. Flutter RPA Architecture</h4>
                    <CodeBlock
                      id={10000}
                      code={`# pubspec.yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  provider: ^6.0.0
  intl: ^0.19.0
  flutter_dotenv: ^5.0.0`}
                      language="yaml"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">2. RPA Service Layer (Dart)</h4>
                    <CodeBlock
                      id={10001}
                      code={`import 'package:http/http.dart' as http;
import 'dart:convert';

class RPAService {
  final String baseUrl = 'http://localhost:3001/api';
  
  Future<Map<String, dynamic>> runAutomation(String taskName, Map<String, dynamic> params) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/rpa/execute'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'taskName': taskName,
          'parameters': params,
          'timestamp': DateTime.now().toIso8601String(),
        }),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Failed to execute automation');
      }
    } catch (e) {
      print('RPA Error: $e');
      rethrow;
    }
  }

  Future<List<dynamic>> getAutomationResults(String taskId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/rpa/results/$taskId'),
    );
    
    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data'];
    }
    throw Exception('Failed to fetch results');
  }
}`}
                      language="dart"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">3. RPA Task Execution Widget</h4>
                    <CodeBlock
                      id={10002}
                      code={`import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class RPATaskExecutor extends StatefulWidget {
  final String taskName;
  
  const RPATaskExecutor({required this.taskName});

  @override
  _RPATaskExecutorState createState() => _RPATaskExecutorState();
}

class _RPATaskExecutorState extends State<RPATaskExecutor> {
  late RPAService _rpaService;
  bool _isExecuting = false;
  Map<String, dynamic>? _result;
  String? _error;

  @override
  void initState() {
    super.initState();
    _rpaService = context.read<RPAService>();
  }

  Future<void> _executeTask() async {
    setState(() {
      _isExecuting = true;
      _error = null;
    });

    try {
      final result = await _rpaService.runAutomation(
        widget.taskName,
        {'userId': 'user123', 'action': 'process_document'},
      );
      
      setState(() => _result = result);
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Task executed successfully')),
      );
    } catch (e) {
      setState(() => _error = e.toString());
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error: \$e'), backgroundColor: Colors.red),
      );
    } finally {
      setState(() => _isExecuting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(widget.taskName, style: Theme.of(context).textTheme.headlineSmall),
            SizedBox(height: 16),
            if (_isExecuting)
              LinearProgressIndicator()
            else
              ElevatedButton(
                onPressed: _executeTask,
                child: Text('Execute Task'),
              ),
            if (_result != null) ...[
              SizedBox(height: 16),
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  border: Border.all(color: Colors.green),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Status: \${_result!['status']}', style: TextStyle(color: Colors.green[900])),
                    Text('Records Processed: \${_result!['recordsProcessed']}'),
                  ],
                ),
              ),
            ],
            if (_error != null) ...[
              SizedBox(height: 16),
              Container(
                padding: EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.red[50],
                  border: Border.all(color: Colors.red),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(_error!, style: TextStyle(color: Colors.red[900])),
              ),
            ],
          ],
        ),
      ),
    );
  }
}`}
                      language="dart"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">4. Robot Framework Integration Script</h4>
                    <CodeBlock
                      id={10003}
                      code={`*** Settings ***
Library    RequestsLibrary
Library    Collections

*** Variables ***
\${FLUTTER_APP_URL}    http://localhost:3001/api
\${TASK_ID}    automated_task_001

*** Test Cases ***
Process Data from Flutter
    Create Session    flutter_session    \${FLUTTER_APP_URL}
    
    \${payload}=    Create Dictionary
    ...    taskName=process_document
    ...    parameters=\${EMPTY}
    
    \${response}=    Post Request    flutter_session    /rpa/execute
    ...    json=\${payload}
    
    Should Be Equal As Integers    \${response.status_code}    200
    
    \${result}=    Evaluate    json.loads("""\${response.text}""")    json
    
    Should Be Equal    \${result['status']}    success
    
    Log    Processed \${result['recordsProcessed']} records`}
                      language="robot"
                    />
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">5. Main App with Provider Setup</h4>
                    <CodeBlock
                      id={10004}
                      code={`import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() {
  runApp(const RPAApp());
}

class RPAApp extends StatelessWidget {
  const RPAApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<RPAService>(create: (_) => RPAService()),
      ],
      child: MaterialApp(
        title: 'Flutter RPA',
        theme: ThemeData(primarySwatch: Colors.blue),
        home: HomeScreen(),
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  final List<String> tasks = [
    'Process Documents',
    'Extract Data',
    'Generate Reports',
    'Update Database',
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('RPA Automation')),
      body: ListView.builder(
        padding: EdgeInsets.all(16),
        itemCount: tasks.length,
        itemBuilder: (context, index) {
          return Padding(
            padding: EdgeInsets.only(bottom: 16),
            child: RPATaskExecutor(taskName: tasks[index]),
          );
        },
      ),
    );
  }
}`}
                      language="dart"
                    />
                  </div>
                </div>

                {/* Flutter RPA Best Practices */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-orange-900 mb-3">Flutter + RPA Best Practices</h4>
                  <ul className="space-y-2 text-sm text-orange-800">
                    <li>✓ Use Provider or Riverpod for state management</li>
                    <li>✓ Implement error handling and retry logic</li>
                    <li>✓ Use REST APIs for communication with Robot Framework</li>
                    <li>✓ Implement proper logging and monitoring</li>
                    <li>✓ Cache automation results for offline functionality</li>
                    <li>✓ Use platform channels for native RPA capabilities</li>
                    <li>✓ Test on both Android and iOS devices</li>
                    <li>✓ Implement proper authentication/authorization</li>
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
