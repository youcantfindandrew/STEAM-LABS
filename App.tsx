
import React, { useState, useCallback } from 'react';
import { FileUpload } from './components/FileUpload';
import { HtmlPreview } from './components/HtmlPreview';
import { CodeEditor } from './components/CodeEditor';
import { PromptControls } from './components/PromptControls';
import { editHtml } from './services/geminiService';
import { LogoIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [originalHtml, setOriginalHtml] = useState<string>('');
  const [editedHtml, setEditedHtml] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialState, setIsInitialState] = useState<boolean>(true);

  const handleFileLoad = (content: string, name: string) => {
    setOriginalHtml(content);
    setEditedHtml(content);
    setFileName(name);
    setError(null);
    setIsInitialState(false);
  };
  
  const handleCodeChange = (newCode: string) => {
    setEditedHtml(newCode);
  };

  const handleSubmit = useCallback(async () => {
    if (!prompt.trim() || !editedHtml.trim()) {
      setError('Please provide instructions and make sure HTML content is loaded.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await editHtml(editedHtml, prompt);
      setEditedHtml(result);
    } catch (e) {
      console.error(e);
      setError('Failed to edit HTML. Please check the console for more details.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, editedHtml]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans flex flex-col">
      <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 p-4 sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LogoIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">AI HTML Editor</h1>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isInitialState ? (
          <div className="lg:col-span-2 flex flex-col items-center justify-center h-[70vh] bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-600">
            <SparklesIcon className="h-16 w-16 text-cyan-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Welcome to the AI HTML Editor</h2>
            <p className="text-gray-400 mb-6">Upload your HTML file to get started.</p>
            <FileUpload onFileLoad={handleFileLoad} isLoading={isLoading} />
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-6">
              <PromptControls
                prompt={prompt}
                onPromptChange={setPrompt}
                onSubmit={handleSubmit}
                isLoading={isLoading}
                onFileLoad={handleFileLoad}
                fileName={fileName}
              />
              {error && <div className="bg-red-900/50 text-red-300 border border-red-700 p-3 rounded-lg">{error}</div>}
              <div className="flex-grow flex flex-col">
                 <h2 className="text-lg font-semibold mb-3 text-gray-300">Code Editor</h2>
                 <CodeEditor code={editedHtml} onCodeChange={handleCodeChange} />
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold mb-3 text-gray-300">Live Preview</h2>
              <HtmlPreview htmlContent={editedHtml} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
