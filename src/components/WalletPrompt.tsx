import React from 'react';
import { Wallet, Shield, Info } from 'lucide-react';

interface WalletPromptProps {
  connect: () => void;
  isConnecting: boolean;
  error: string | null;
}

const WalletPrompt: React.FC<WalletPromptProps> = ({ connect, isConnecting, error }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <Wallet className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600">
            Connect your MetaMask wallet to access the decentralized library system
          </p>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex items-center text-left text-sm text-gray-600">
            <Shield className="h-4 w-4 text-green-500 mr-3 flex-shrink-0" />
            <span>Secure blockchain interactions</span>
          </div>
          <div className="flex items-center text-left text-sm text-gray-600">
            <Info className="h-4 w-4 text-blue-500 mr-3 flex-shrink-0" />
            <span>Uses test ETH only - no real money required</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={connect}
          disabled={isConnecting}
          className="w-full flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Wallet className="h-5 w-5" />
          <span>{isConnecting ? 'Connecting...' : 'Connect MetaMask'}</span>
        </button>

        <div className="mt-6 text-xs text-gray-500">
          <p>
            Make sure you have MetaMask installed and connected to localhost:8545 (Chain ID: 1337).
            Import the test account with private key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletPrompt;