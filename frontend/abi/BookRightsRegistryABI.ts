
/*
  This file is auto-generated.
  Command: 'npm run genabi'
*/
export const BookRightsRegistryABI = {
  "abi": [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bookId",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "accessor",
          "type": "address"
        }
      ],
      "name": "BookDecrypted",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "uint256",
          "name": "bookId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "author",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "publisher",
          "type": "string"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        }
      ],
      "name": "BookRegistered",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "bookCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookId",
          "type": "uint256"
        }
      ],
      "name": "bookExists",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "books",
      "outputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "author",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "publisher",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "genre",
          "type": "string"
        },
        {
          "internalType": "euint8",
          "name": "pricingTier",
          "type": "bytes32"
        },
        {
          "internalType": "euint8",
          "name": "distributionWindow",
          "type": "bytes32"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "exists",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookId",
          "type": "uint256"
        }
      ],
      "name": "getBookInfo",
      "outputs": [
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "author",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "publisher",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "genre",
          "type": "string"
        },
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookId",
          "type": "uint256"
        }
      ],
      "name": "getDistributionWindow",
      "outputs": [
        {
          "internalType": "euint8",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookId",
          "type": "uint256"
        }
      ],
      "name": "getPricingTier",
      "outputs": [
        {
          "internalType": "euint8",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalBooks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_bookId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_accessor",
          "type": "address"
        }
      ],
      "name": "grantAccess",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "protocolId",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_author",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_publisher",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_genre",
          "type": "string"
        },
        {
          "internalType": "externalEuint8",
          "name": "_pricingTierInput",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "_pricingTierProof",
          "type": "bytes"
        },
        {
          "internalType": "externalEuint8",
          "name": "_distributionWindowInput",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "_distributionWindowProof",
          "type": "bytes"
        }
      ],
      "name": "registerBook",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "bookId",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]
} as const;

