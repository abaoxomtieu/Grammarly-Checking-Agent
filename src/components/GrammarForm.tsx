import React, { useState, useRef, KeyboardEvent } from 'react';
import { Tabs, Input, Button, Upload, message } from 'antd';
import { UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import type { TabsProps } from 'antd';
import GrammarQuiz from './GrammarQuiz';

const { TextArea } = Input;

interface GrammarFormProps {
  onSubmit: (data: FormData | { text: string; proper_nouns: string }, tab: string) => Promise<void>;
  loading: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const GrammarForm: React.FC<GrammarFormProps> = ({ 
  onSubmit, 
  loading, 
  activeTab, 
  setActiveTab 
}) => {
  const [text, setText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [properNouns, setProperNouns] = useState<string>('');

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      message.warning('Please enter some text to check.');
      return;
    }
    
    const payload = {
      text: text.trim(),
      proper_nouns: properNouns.trim()
    };
    onSubmit(payload, 'text');
  };
  
  const handleFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      message.warning('Please select a file to upload.');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    // Convert comma-separated string to array and remove empty values
    const properNounsArray = properNouns.split(',').map(noun => noun.trim()).filter(Boolean);
    formData.append('proper_nouns', JSON.stringify(properNounsArray));
    onSubmit(formData, 'file');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      if (text.trim()) {
        const payload = {
          text: text.trim(),
          proper_nouns: properNouns.trim()
        };
        onSubmit(payload, 'text');
      } else {
        message.warning('Please enter some text to check.');
      }
    }
  };

  const handleFileChange = (info: any) => {
    if (info.file.status === 'done') {
      setFile(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: 'text',
      label: 'Text Input',
      children: (
        <form onSubmit={handleTextSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text
            </label>
            <TextArea
              rows={8}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Paste your text here for grammar checking... (Press Enter to submit)"
              disabled={loading}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technical Terms/Proper Nouns (optional)
            </label>
            <Input
              value={properNouns}
              onChange={(e) => setProperNouns(e.target.value)}
              placeholder="Enter technical terms or proper nouns separated by commas (e.g., GraphQL, React, Python)"
              disabled={loading}
              className="w-full"
            />
            <p className="mt-1 text-sm text-gray-500">
              These terms will be preserved in their original form.
            </p>
          </div>
          
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!text.trim()}
            className="w-full md:w-auto"
          >
            {loading ? 'Checking...' : 'Check Grammar'}
          </Button>
        </form>
      ),
    },
    {
      key: 'file',
      label: 'File Upload',
      children: (
        <form onSubmit={handleFileSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload a document (.txt, .docx)
            </label>
            <Upload
              accept=".txt,.docx"
              maxCount={1}
              onChange={handleFileChange}
              disabled={loading}
              className="w-full"
              beforeUpload={() => false} // Prevent auto upload
            >
              <Button icon={<UploadOutlined />} disabled={loading}>
                Select File
              </Button>
            </Upload>
            <p className="mt-1 text-sm text-gray-500">
              Maximum file size: 10MB
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Technical Terms/Proper Nouns (optional)
            </label>
            <Input
              value={properNouns}
              onChange={(e) => setProperNouns(e.target.value)}
              placeholder="Enter technical terms or proper nouns separated by commas (e.g., GraphQL, React, Python)"
              disabled={loading}
              className="w-full"
            />
            <p className="mt-1 text-sm text-gray-500">
              These terms will be preserved in their original form.
            </p>
          </div>
          
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            disabled={!file}
            icon={loading ? <LoadingOutlined /> : undefined}
            className="w-full md:w-auto"
          >
            {loading ? 'Uploading & Checking...' : 'Check Grammar'}
          </Button>
        </form>
      ),
    },
    {
      key: 'quiz',
      label: 'Grammar Quiz',
      children: <GrammarQuiz />,
    },
  ];

  return (
    <Tabs
      activeKey={activeTab}
      items={items}
      onChange={setActiveTab}
      className="grammar-tabs"
    />
  );
};

export default GrammarForm;