import React from 'react';
import { BookOpen, Wallet, LogOut } from 'lucide-react';

interface HeaderProps {
  account: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => void;
  disconnect: () => void;
  chainId: number | null;
}

const Header: React.FC<HeaderProps> = ({
  account,
  isConnected,
  isConnecting,
  connect,
  disconnect,
  chainId,
}) => {
  const getNetworkName = (chainId: number) => {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 5:
        return 'Goerli Testnet';
      case 1337:
        return 'Localhost';
      default:
        return `Chain ID: ${chainId}`;
    }
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Decentralized Library
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {isConnected && chainId && (
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                {getNetworkName(chainId)}
              </div>
            )}
            
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </div>
                <button
                  onClick={disconnect}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Disconnect</span>
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Wallet className="h-4 w-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;