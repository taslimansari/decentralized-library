import React, { useState } from 'react';
import { CONTRACT_ADDRESS } from '../utils/contract';
import { Settings, Copy, CheckCircle, Play } from 'lucide-react';

const ContractSetup: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startLocalBlockchain = async () => {
    setIsStarting(true);
    try {
      // This would typically start the blockchain in a real environment
      // For now, we'll just show instructions
      alert('Please run "npm run blockchain" in a separate terminal, then "npm run deploy" to set up the local blockchain and deploy contracts.');
    } catch (error) {
      console.error('Error starting blockchain:', error);
    } finally {
      setIsStarting(false);
    }
  };

  if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x...") {
    return null; // Contract is already configured
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Play className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Ready to Launch!
          </h2>
          <p className="text-gray-600">
            Everything is configured. Just start the local blockchain and deploy.
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">🚀 Quick Start (Automated)</h3>
            <p className="text-sm text-green-800 mb-4">
              Run these commands in your terminal to start everything automatically:
            </p>
            <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm space-y-1">
              <div># Terminal 1 - Start local blockchain</div>
              <div>npm run blockchain</div>
              <div className="mt-2"># Terminal 2 - Deploy contract and start app</div>
              <div>npm run setup</div>
            </div>
            <button
              onClick={() => handleCopy('npm run blockchain\n# In another terminal:\nnpm run setup')}
              className="flex items-center space-x-2 text-sm text-green-700 hover:text-green-800 mt-2"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy commands'}</span>
            </button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">📋 What's Included</h3>
            <div className="space-y-3">
              <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                <li>✅ Hardhat local blockchain (pre-configured)</li>
                <li>✅ Smart contract compilation & deployment scripts</li>
                <li>✅ 10 test accounts with 10,000 ETH each</li>
                <li>✅ 8 sample books pre-loaded</li>
                <li>✅ MetaMask configuration for localhost:8545</li>
                <li>✅ Automatic contract address configuration</li>
              </ul>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className="font-semibold text-purple-900 mb-3">🦊 MetaMask Setup</h3>
            <div className="text-sm text-yellow-800 space-y-2">
              <p><strong>Add Localhost Network to MetaMask:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Network Name: <code className="bg-purple-100 px-1 rounded">Localhost 8545</code></li>
                <li>RPC URL: <code className="bg-purple-100 px-1 rounded">http://127.0.0.1:8545</code></li>
                <li>Chain ID: <code className="bg-purple-100 px-1 rounded">1337</code></li>
                <li>Currency Symbol: <code className="bg-purple-100 px-1 rounded">ETH</code></li>
              </ul>
              <p className="mt-3"><strong>Import Test Account:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Use private key: <code className="bg-purple-100 px-1 rounded text-xs">0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80</code></li>
                <li>This account will be the admin with 10,000 ETH</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            The blockchain will run on <strong>localhost:8545</strong> with Chain ID <strong>1337</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractSetup;