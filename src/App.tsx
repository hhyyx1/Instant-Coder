import { useState } from "react";
import { Toaster, toast } from "sonner";

type Provider = "openai" | "gemini" | "claude" | "mistral" | "cohere" | "ollama" | "xai" | "guiji";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [provider, setProvider] = useState<Provider>("openai");
  const [model, setModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiBaseUrl, setApiBaseUrl] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const getProviderDefaults = (provider: Provider) => {
    switch (provider) {
      case "openai":
        return {
          url: "https://api.openai.com/v1",
          modelPlaceholder: "gpt-4, gpt-3.5-turbo",
          keyPlaceholder: "sk-...",
        };
      case "gemini":
        return {
          url: "https://generativelanguage.googleapis.com/v1",
          modelPlaceholder: "gemini-pro, gemini-pro-vision",
          keyPlaceholder: "AI...",
        };
      case "claude":
        return {
          url: "https://api.anthropic.com/v1",
          modelPlaceholder: "claude-3-opus, claude-3-sonnet",
          keyPlaceholder: "sk-ant-...",
        };
      case "mistral":
        return {
          url: "https://api.mistral.ai/v1",
          modelPlaceholder: "mistral-tiny, mistral-small, mistral-medium",
          keyPlaceholder: "...",
        };
      case "cohere":
        return {
          url: "https://api.cohere.ai/v1",
          modelPlaceholder: "command, command-light, command-nightly",
          keyPlaceholder: "...",
        };
      case "ollama":
        return {
          url: "http://localhost:11434",
          modelPlaceholder: "codellama, codellama:13b, deepseek-coder",
          keyPlaceholder: "Not required",
        };
      case "xai":
        return {
          url: "https://api.xai-foundation.org/v1",
          modelPlaceholder: "xai-large, xai-medium",
          keyPlaceholder: "...",
        };
      case "guiji":
        return {
          url: "https://api.siliconflow.cn/v1",
          modelPlaceholder: "guiji-large, guiji-medium",
          keyPlaceholder: "sk-hqyegtrxzfmutxiheecosssglbhaeubhbpfhpbdbugocmjgq",
        };
      default:
        return {
          url: "",
          modelPlaceholder: "",
          keyPlaceholder: "",
        };
    }
  };

  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider);
    setApiBaseUrl(getProviderDefaults(newProvider).url);
    setModel("");
  };

  const generateCode = async (provider: Provider, model: string, apiKey: string, prompt: string, apiBaseUrl?: string) => {
    switch (provider) {
      case "openai": {
        const response = await fetch(`${apiBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      }

      case "gemini": {
        const response = await fetch(`${apiBaseUrl}/models/${model}:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        });

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      }

      case "claude": {
        const response = await fetch(`${apiBaseUrl}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`Claude API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.content[0].text;
      }

      case "mistral": {
        const response = await fetch(`${apiBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`Mistral API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      }

      case "cohere": {
        const response = await fetch(`${apiBaseUrl}/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            prompt: prompt,
            max_tokens: 2000,
          }),
        });

        if (!response.ok) {
          throw new Error(`Cohere API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.generations[0].text;
      }

      case "ollama": {
        const response = await fetch(`${apiBaseUrl}/api/generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model,
            prompt: prompt,
          }),
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.response;
      }

      case "xai": {
        const response = await fetch(`${apiBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`XAI API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      }

      case "guiji": {
        const response = await fetch(`${apiBaseUrl}/chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: model,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        if (!response.ok) {
          throw new Error(`硅基智能 API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt || !model || !apiKey) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const response = await generateCode(provider, model, apiKey, prompt, apiBaseUrl);
      setGeneratedCode(response || "No response from the AI");
      setPreviewUrl(`https://codesandbox.io/s/vanilla?file=/index.js:${encodeURIComponent(response || "")}`);
    } catch (error) {
      toast.error("Error generating code: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const defaults = getProviderDefaults(provider);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-2xl font-bold text-center text-gray-800">InstantCoder</h1>
      </header>

      <main className="flex-1 container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左侧面板：配置和代码生成 */}
        <div className="space-y-4">
          {/* API配置部分 */}
          <div className="bg-white rounded-lg shadow p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  AI Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => handleProviderChange(e.target.value as Provider)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="openai">OpenAI</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="claude">Anthropic Claude</option>
                  <option value="mistral">Mistral AI</option>
                  <option value="cohere">Cohere</option>
                  <option value="ollama">Ollama (Local)</option>
                  <option value="xai">XAI Foundation</option>
                  <option value="guiji">硅基智能</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Base URL
                </label>
                <input
                  type="text"
                  value={apiBaseUrl}
                  onChange={(e) => setApiBaseUrl(e.target.value)}
                  placeholder={defaults.url}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={defaults.keyPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model Name
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder={defaults.modelPlaceholder}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Suggested models: {defaults.modelPlaceholder}
                </p>
              </div>
            </form>
          </div>

          {/* 代码生成部分 */}
          <div className="bg-white rounded-lg shadow p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Idea
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Describe what you want to create..."
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate Code"}
            </button>
          </div>

          {/* 生成的代码显示 */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Generated Code</h3>
            <pre className="bg-gray-50 rounded-md p-4 overflow-auto max-h-[400px]">
              <code className="text-sm">{generatedCode || "Code will appear here..."}</code>
            </pre>
          </div>
        </div>

        {/* 右侧面板：预览 */}
        <div className="bg-white rounded-lg shadow h-full min-h-[600px] relative">
          {previewUrl ? (
            <>
              <iframe
                src={previewUrl}
                className="w-full h-full rounded-lg"
                title="Code Preview"
              />
              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
              >
                Open in Sandbox
              </a>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Preview will appear here
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
