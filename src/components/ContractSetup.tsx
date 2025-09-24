import React, { useState } from 'react';
import { CONTRACT_ADDRESS } from '../utils/contract';
import { Settings, Copy, CheckCircle } from 'lucide-react';

const ContractSetup: React.FC = () => {
  const [contractAddress, setContractAddress] = useState(CONTRACT_ADDRESS);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (CONTRACT_ADDRESS && CONTRACT_ADDRESS !== "0x...") {
    return null; // Contract is already configured
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Settings className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Contract Setup Required
          </h2>
          <p className="text-gray-600">
            Deploy the smart contract and configure the application
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-3">Step 1: Deploy Contract</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
              <li>Open <a href="https://remix.ethereum.org" target="_blank" rel="noopener noreferrer" className="underline">Remix IDE</a></li>
              <li>Create a new file called <code className="bg-blue-100 px-1 rounded">Library.sol</code></li>
              <li>Copy the Solidity contract code from <code className="bg-blue-100 px-1 rounded">contracts/Library.sol</code></li>
              <li>Compile the contract (Solidity version 0.8.19+)</li>
              <li>Deploy to your test network (Sepolia, Goerli, or localhost)</li>
            </ol>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="font-semibold text-green-900 mb-3">Step 2: Configure Application</h3>
            <div className="space-y-3">
              <p className="text-sm text-green-800">
                After deploying, copy the contract address and update <code className="bg-green-100 px-1 rounded">src/utils/contract.ts</code>:
              </p>
              <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-sm">
                export const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";
              </div>
              <button
                onClick={() => handleCopy('export const CONTRACT_ADDRESS = "YOUR_CONTRACT_ADDRESS_HERE";')}
                className="flex items-center space-x-2 text-sm text-green-700 hover:text-green-800"
              >
                {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied!' : 'Copy code'}</span>
              </button>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 mb-3">Step 3: Test Network Setup</h3>
            <div className="text-sm text-yellow-800 space-y-2">
              <p><strong>For Sepolia Testnet:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Add Sepolia network to MetaMask</li>
                <li>Get test ETH from <a href="https://sepoliafaucet.com" target="_blank" rel="noopener noreferrer" className="underline">Sepolia faucet</a></li>
              </ul>
              <p className="mt-3"><strong>For Local Development (Ganache):</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Install and run Ganache</li>
                <li>Connect MetaMask to localhost:8545</li>
                <li>Import accounts using private keys from Ganache</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            After completing the setup, refresh this page to access the library system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContractSetup;