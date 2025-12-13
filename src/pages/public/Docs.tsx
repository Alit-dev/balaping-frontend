import { useState } from 'react';
import { Book, Code, Terminal, Webhook, Zap, Copy, Check, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function Docs() {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="mb-16 text-center">
                        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-primary/10 text-primary mb-4">
                            API v1.0
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                            Balaping API Documentation
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Complete reference for integrating Balaping monitoring into your applications and workflows.
                        </p>
                    </div>

                    {/* Quick Nav */}
                    <div className="bg-white rounded-2xl border shadow-sm p-6 mb-12">
                        <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Quick Navigation</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { href: '#authentication', label: 'Authentication' },
                                { href: '#monitors', label: 'Monitors' },
                                { href: '#incidents', label: 'Incidents' },
                                { href: '#webhooks', label: 'Webhooks' },
                                { href: '#status', label: 'Public Status' },
                                { href: '#websocket', label: 'Real-time API' },
                                { href: '#errors', label: 'Error Handling' },
                                { href: '#sdks', label: 'SDKs' },
                            ].map((item) => (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="px-4 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-sm font-medium transition-colors text-center"
                                >
                                    {item.label}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Base URL */}
                    <div className="bg-gradient-to-r from-primary/10 to-blue-50 rounded-2xl p-6 mb-12 border border-primary/20">
                        <h3 className="font-semibold mb-2">Base URL</h3>
                        <code className="text-lg font-mono bg-white px-4 py-2 rounded-lg border inline-block">
                            https://api.balaping.com/v1
                        </code>
                    </div>

                    <div className="space-y-16">
                        {/* Authentication Section */}
                        <section id="authentication" className="scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Terminal className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Authentication</h2>
                            </div>
                            <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
                                <p className="text-muted-foreground">
                                    All API requests require authentication via Bearer token. Generate an API key from your dashboard settings.
                                </p>
                                <div className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mt-4">Required Headers</div>
                                <CodeBlock
                                    id="auth-headers"
                                    code={`Authorization: Bearer YOUR_API_KEY
Accept: application/json
Content-Type: application/json`}
                                    onCopy={copyToClipboard}
                                    copied={copiedCode === 'auth-headers'}
                                />
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                                    <div className="font-semibold text-red-700 mb-1">Error Response (401 Unauthorized)</div>
                                    <pre className="text-sm text-red-600 font-mono">{`{
  "error": "Unauthorized",
  "message": "Invalid API key"
}`}</pre>
                                </div>
                            </div>
                        </section>

                        {/* Endpoints Overview */}
                        <section className="scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Book className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Endpoints Overview</h2>
                            </div>
                            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-sm font-semibold">Method</th>
                                            <th className="text-left px-6 py-3 text-sm font-semibold">Endpoint</th>
                                            <th className="text-left px-6 py-3 text-sm font-semibold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        <EndpointRow method="GET" endpoint="/monitors" description="List all monitors" />
                                        <EndpointRow method="POST" endpoint="/monitors" description="Create a new monitor" />
                                        <EndpointRow method="GET" endpoint="/monitors/:id" description="Get monitor details" />
                                        <EndpointRow method="PUT" endpoint="/monitors/:id" description="Update a monitor" />
                                        <EndpointRow method="DELETE" endpoint="/monitors/:id" description="Delete a monitor" />
                                        <EndpointRow method="POST" endpoint="/monitors/:id/ping" description="Push heartbeat ping" />
                                        <EndpointRow method="GET" endpoint="/incidents" description="List incidents" />
                                        <EndpointRow method="GET" endpoint="/status/:id" description="Public status for a monitor" />
                                        <EndpointRow method="WS" endpoint="/ws/health" description="WebSocket realtime health stream" />
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Monitors Section */}
                        <section id="monitors" className="scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <Code className="w-6 h-6 text-primary" />
                                </div>
                                <h2 className="text-2xl font-bold">Monitors</h2>
                            </div>
                            <div className="space-y-6">
                                {/* List Monitors */}
                                <ApiEndpoint
                                    method="GET"
                                    endpoint="/monitors"
                                    title="List All Monitors"
                                    description="Retrieve all monitors in your account."
                                    responseCode={`{
  "total": 3,
  "monitors": [
    {
      "id": "m_123",
      "name": "Main Website",
      "url": "https://example.com",
      "type": "http",
      "interval": 60,
      "status": "up",
      "lastChecked": "2025-12-07T05:01:23Z"
    }
  ]
}`}
                                    onCopy={copyToClipboard}
                                    copiedCode={copiedCode}
                                />

                                {/* Get Single Monitor */}
                                <ApiEndpoint
                                    method="GET"
                                    endpoint="/monitors/:id"
                                    title="Get a Single Monitor"
                                    description="Get detailed information for a specific monitor including history."
                                    responseCode={`{
  "id": "m_123",
  "name": "Main Website",
  "url": "https://example.com",
  "type": "http",
  "interval": 60,
  "status": "up",
  "history": [
    {
      "timestamp": "2025-12-07T05:00:00Z",
      "status": "up",
      "responseTime": 623
    }
  ]
}`}
                                    onCopy={copyToClipboard}
                                    copiedCode={copiedCode}
                                />

                                {/* Create Monitor */}
                                <ApiEndpoint
                                    method="POST"
                                    endpoint="/monitors"
                                    title="Create a Monitor"
                                    description="Create a new monitor to start tracking uptime."
                                    requestCode={`{
  "name": "My API",
  "url": "https://api.example.com",
  "type": "http",
  "interval": 60,
  "tags": ["api", "production"]
}`}
                                    responseCode={`{
  "success": true,
  "monitor": {
    "id": "m_456",
    "name": "My API",
    "url": "https://api.example.com",
    "type": "http",
    "interval": 60,
    "status": "pending"
  }
}`}
                                    onCopy={copyToClipboard}
                                    copiedCode={copiedCode}
                                />

                                {/* Update Monitor */}
                                <ApiEndpoint
                                    method="PUT"
                                    endpoint="/monitors/:id"
                                    title="Update a Monitor"
                                    description="Update an existing monitor's configuration."
                                    requestCode={`{
  "name": "Main Site Updated",
  "interval": 30
}`}
                                    responseCode={`{
  "success": true,
  "message": "Monitor updated"
}`}
                                    onCopy={copyToClipboard}
                                    copiedCode={copiedCode}
                                />

                                {/* Delete Monitor */}
                                <ApiEndpoint
                                    method="DELETE"
                                    endpoint="/monitors/:id"
                                    title="Delete a Monitor"
                                    description="Permanently delete a monitor and all its history."
                                    responseCode={`{
  "success": true,
  "message": "Monitor deleted"
}`}
                                    onCopy={copyToClipboard}
                                    copiedCode={copiedCode}
                                />

                                {/* Heartbeat Ping */}
                                <ApiEndpoint
                                    method="POST"
                                    endpoint="/monitors/:id/ping"
                                    title="Heartbeat Ping"
                                    description="Use this for cron/worker heartbeat monitoring. Send a ping when your job completes."
                                    responseCode={`{
  "success": true,
  "message": "Heartbeat recorded"
}`}
                                    onCopy={copyToClipboard}
                                    copiedCode={copiedCode}
                                />
                            </div>
                        </section>

                        {/* Incidents Section */}
                        <section id="incidents" className="scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-100 rounded-xl">
                                    <Zap className="w-6 h-6 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Incidents</h2>
                            </div>
                            <ApiEndpoint
                                method="GET"
                                endpoint="/incidents"
                                title="List Incidents"
                                description="Retrieve all incidents for your monitors."
                                responseCode={`{
  "incidents": [
    {
      "id": "inc_12",
      "monitorId": "m_123",
      "startedAt": "2025-12-07T03:00:00Z",
      "endedAt": "2025-12-07T03:10:00Z",
      "duration": 600,
      "status": "resolved"
    }
  ]
}`}
                                onCopy={copyToClipboard}
                                copiedCode={copiedCode}
                            />
                        </section>

                        {/* Public Status Section */}
                        <section id="status" className="scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-xl">
                                    <ExternalLink className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Public Status</h2>
                            </div>
                            <ApiEndpoint
                                method="GET"
                                endpoint="/status/:id"
                                title="Public Status Endpoint"
                                description="Get public status information for a monitor. No authentication required."
                                responseCode={`{
  "status": "up",
  "uptime30d": 99.99,
  "lastDown": "2025-12-01T07:22:00Z",
  "responseTime": 541
}`}
                                onCopy={copyToClipboard}
                                copiedCode={copiedCode}
                            />
                        </section>

                        {/* WebSocket Section */}
                        <section id="websocket" className="scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-purple-100 rounded-xl">
                                    <Zap className="w-6 h-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Real-time API (WebSocket)</h2>
                            </div>
                            <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-6">
                                <div>
                                    <div className="font-semibold mb-2">WebSocket URL</div>
                                    <code className="bg-slate-100 px-4 py-2 rounded-lg font-mono text-sm block">
                                        wss://api.balaping.com/v1/ws/health
                                    </code>
                                </div>

                                <div>
                                    <div className="font-semibold mb-2">1. Authenticate on connect</div>
                                    <CodeBlock
                                        id="ws-auth"
                                        code={`{
  "type": "auth",
  "apiKey": "YOUR_API_KEY"
}`}
                                        onCopy={copyToClipboard}
                                        copied={copiedCode === 'ws-auth'}
                                    />
                                </div>

                                <div>
                                    <div className="font-semibold mb-2">2. Subscribe to monitors</div>
                                    <CodeBlock
                                        id="ws-subscribe"
                                        code={`{
  "type": "subscribe",
  "monitors": ["m_123", "m_456"]
}`}
                                        onCopy={copyToClipboard}
                                        copied={copiedCode === 'ws-subscribe'}
                                    />
                                </div>

                                <div>
                                    <div className="font-semibold mb-2">3. Receive real-time updates</div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-red-600 font-medium mb-2">Down Event</div>
                                            <CodeBlock
                                                id="ws-down"
                                                code={`{
  "type": "health_update",
  "monitorId": "m_123",
  "status": "down",
  "timestamp": "2025-12-07T05:20:10Z",
  "responseTime": null,
  "reason": "Timeout"
}`}
                                                onCopy={copyToClipboard}
                                                copied={copiedCode === 'ws-down'}
                                            />
                                        </div>
                                        <div>
                                            <div className="text-sm text-green-600 font-medium mb-2">Up Event</div>
                                            <CodeBlock
                                                id="ws-up"
                                                code={`{
  "type": "health_update",
  "monitorId": "m_123",
  "status": "up",
  "timestamp": "2025-12-07T05:21:05Z",
  "responseTime": 540
}`}
                                                onCopy={copyToClipboard}
                                                copied={copiedCode === 'ws-up'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="font-semibold mb-2">JavaScript Example</div>
                                    <CodeBlock
                                        id="ws-example"
                                        language="javascript"
                                        code={`const ws = new WebSocket("wss://api.balaping.com/v1/ws/health");

ws.onopen = () => {
  ws.send(JSON.stringify({
    type: "auth",
    apiKey: "YOUR_API_KEY"
  }));

  ws.send(JSON.stringify({
    type: "subscribe",
    monitors: ["m_123"]
  }));
};

ws.onmessage = (msg) => {
  const data = JSON.parse(msg.data);
  console.log("Realtime update:", data);
};`}
                                        onCopy={copyToClipboard}
                                        copied={copiedCode === 'ws-example'}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Webhooks Section */}
                        <section id="webhooks" className="scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-100 rounded-xl">
                                    <Webhook className="w-6 h-6 text-orange-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Webhooks</h2>
                            </div>
                            <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
                                <p className="text-muted-foreground">
                                    Receive real-time notifications when a monitor goes down or comes back up.
                                    Configure webhook URLs in your alert settings.
                                </p>
                                <div className="font-semibold text-sm">Payload Example</div>
                                <CodeBlock
                                    id="webhook-payload"
                                    code={`{
  "event": "monitor_down",
  "monitor_id": "m_123",
  "monitor_name": "Production API",
  "timestamp": "2025-12-07T10:00:00Z",
  "reason": "Connection timeout"
}`}
                                    onCopy={copyToClipboard}
                                    copied={copiedCode === 'webhook-payload'}
                                />
                            </div>
                        </section>

                        {/* Error Handling */}
                        <section id="errors" className="scroll-mt-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-red-100 rounded-xl">
                                    <Zap className="w-6 h-6 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-bold">Error Handling</h2>
                            </div>
                            <div className="bg-white rounded-2xl border shadow-sm p-6">
                                <p className="text-muted-foreground mb-4">
                                    All API errors follow a consistent format for easy handling.
                                </p>
                                <CodeBlock
                                    id="error-format"
                                    code={`{
  "error": true,
  "message": "Monitor not found",
  "code": 404
}`}
                                    onCopy={copyToClipboard}
                                    copied={copiedCode === 'error-format'}
                                />
                            </div>
                        </section>

                        {/* SDKs */}
                        <section id="sdks" className="scroll-mt-8">
                            <h2 className="text-2xl font-bold mb-6">SDKs & Libraries</h2>
                            <p className="text-muted-foreground mb-6">
                                Official SDKs are coming soon. For now, you can use any standard HTTP client
                                to interact with our API.
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {['Node.js', 'Python', 'Go', 'PHP'].map((sdk) => (
                                    <div key={sdk} className="p-6 border rounded-xl text-center bg-white hover:shadow-md transition-shadow">
                                        <span className="font-semibold text-lg">{sdk}</span>
                                        <p className="text-xs text-muted-foreground mt-2">Coming Soon</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function CodeBlock({ id, code, language, onCopy, copied }: { id: string; code: string; language?: string; onCopy: (code: string, id: string) => void; copied: boolean }) {
    return (
        <div className="relative group">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                <code>{code}</code>
            </pre>
            <button
                onClick={() => onCopy(code, id)}
                className="absolute top-2 right-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            </button>
        </div>
    );
}

function EndpointRow({ method, endpoint, description }: { method: string; endpoint: string; description: string }) {
    const methodColors: Record<string, string> = {
        GET: 'bg-green-100 text-green-700',
        POST: 'bg-blue-100 text-blue-700',
        PUT: 'bg-yellow-100 text-yellow-700',
        DELETE: 'bg-red-100 text-red-700',
        WS: 'bg-purple-100 text-purple-700',
    };

    return (
        <tr className="hover:bg-slate-50">
            <td className="px-6 py-3">
                <span className={cn('px-2 py-1 rounded text-xs font-bold', methodColors[method] || 'bg-gray-100 text-gray-700')}>
                    {method}
                </span>
            </td>
            <td className="px-6 py-3">
                <code className="text-sm font-mono">{endpoint}</code>
            </td>
            <td className="px-6 py-3 text-sm text-muted-foreground">{description}</td>
        </tr>
    );
}

function ApiEndpoint({
    method,
    endpoint,
    title,
    description,
    requestCode,
    responseCode,
    onCopy,
    copiedCode,
}: {
    method: string;
    endpoint: string;
    title: string;
    description: string;
    requestCode?: string;
    responseCode: string;
    onCopy: (code: string, id: string) => void;
    copiedCode: string | null;
}) {
    const methodColors: Record<string, string> = {
        GET: 'bg-green-100 text-green-700',
        POST: 'bg-blue-100 text-blue-700',
        PUT: 'bg-yellow-100 text-yellow-700',
        DELETE: 'bg-red-100 text-red-700',
    };

    const id = `${method}-${endpoint}`.replace(/[/:]/g, '-');

    return (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-slate-50">
                <div className="flex items-center gap-3 mb-2">
                    <span className={cn('px-2 py-1 rounded text-xs font-bold', methodColors[method] || 'bg-gray-100 text-gray-700')}>
                        {method}
                    </span>
                    <code className="font-mono text-sm font-semibold">{endpoint}</code>
                </div>
                <h3 className="text-lg font-semibold mt-2">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="p-6 space-y-4">
                {requestCode && (
                    <div>
                        <div className="text-sm font-semibold mb-2">Request Body</div>
                        <CodeBlock id={`${id}-req`} code={requestCode} onCopy={onCopy} copied={copiedCode === `${id}-req`} />
                    </div>
                )}
                <div>
                    <div className="text-sm font-semibold mb-2">Response</div>
                    <CodeBlock id={`${id}-res`} code={responseCode} onCopy={onCopy} copied={copiedCode === `${id}-res`} />
                </div>
            </div>
        </div>
    );
}
