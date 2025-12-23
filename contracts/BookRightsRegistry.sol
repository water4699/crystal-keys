// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, euint8, externalEuint32, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title BookRightsRegistry - Encrypted Book Rights Management
/// @notice Manages encrypted book licensing terms including pricing tiers and distribution windows
/// @dev Uses FHEVM for confidential data storage and selective disclosure
contract BookRightsRegistry is SepoliaConfig {
    /// @notice Book structure containing encrypted licensing terms
    struct Book {
        string title;
        string author;
        string publisher;
        string genre;
        euint8 pricingTier; // 0=Basic($2.99), 1=Standard($4.99), 2=Premium($9.99)
        euint8 distributionWindow; // 0=Open(Unlimited), 1=Limited(3mo), 2=Exclusive(6mo)
        address owner;
        uint256 timestamp;
        bool exists;
    }

    /// @notice Mapping from book ID to Book data
    mapping(uint256 => Book) public books;

    /// @notice Counter for book IDs
    uint256 public bookCount;

    /// @notice Emitted when a new book is registered
    event BookRegistered(
        uint256 indexed bookId,
        string title,
        string author,
        string publisher,
        address indexed owner
    );

    /// @notice Emitted when book rights are decrypted
    event BookDecrypted(uint256 indexed bookId, address indexed accessor);

    /// @notice Register a new book with encrypted licensing terms
    /// @param _title Book title (public)
    /// @param _author Author name (public)
    /// @param _publisher Publisher name (public)
    /// @param _genre Book genre (public)
    /// @param _pricingTierInput Encrypted pricing tier
    /// @param _pricingTierProof Proof for pricing tier
    /// @param _distributionWindowInput Encrypted distribution window
    /// @param _distributionWindowProof Proof for distribution window
    /// @return bookId The ID of the newly registered book
    function registerBook(
        string calldata _title,
        string calldata _author,
        string calldata _publisher,
        string calldata _genre,
        externalEuint8 _pricingTierInput,
        bytes calldata _pricingTierProof,
        externalEuint8 _distributionWindowInput,
        bytes calldata _distributionWindowProof
    ) external returns (uint256 bookId) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_author).length > 0, "Author cannot be empty");
        require(bytes(_publisher).length > 0, "Publisher cannot be empty");

        bookId = bookCount++;

        // Convert external encrypted inputs to internal encrypted types
        euint8 encryptedPricingTier = FHE.fromExternal(_pricingTierInput, _pricingTierProof);
        euint8 encryptedDistributionWindow = FHE.fromExternal(
            _distributionWindowInput,
            _distributionWindowProof
        );

        // Store book data
        books[bookId] = Book({
            title: _title,
            author: _author,
            publisher: _publisher,
            genre: _genre,
            pricingTier: encryptedPricingTier,
            distributionWindow: encryptedDistributionWindow,
            owner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        // Grant permissions for the owner to decrypt
        FHE.allowThis(encryptedPricingTier);
        FHE.allow(encryptedPricingTier, msg.sender);
        FHE.allowThis(encryptedDistributionWindow);
        FHE.allow(encryptedDistributionWindow, msg.sender);

        emit BookRegistered(bookId, _title, _author, _publisher, msg.sender);
    }

    /// @notice Get book basic information (public data)
    /// @param _bookId The book ID
    /// @return title Book title
    /// @return author Author name
    /// @return publisher Publisher name
    /// @return genre Book genre
    /// @return owner Book owner address
    /// @return timestamp Registration timestamp
    function getBookInfo(uint256 _bookId)
        external
        view
        returns (
            string memory title,
            string memory author,
            string memory publisher,
            string memory genre,
            address owner,
            uint256 timestamp
        )
    {
        require(books[_bookId].exists, "Book does not exist");
        Book storage book = books[_bookId];
        return (book.title, book.author, book.publisher, book.genre, book.owner, book.timestamp);
    }

    /// @notice Get encrypted pricing tier for a book
    /// @param _bookId The book ID
    /// @return Encrypted pricing tier
    function getPricingTier(uint256 _bookId) external view returns (euint8) {
        require(books[_bookId].exists, "Book does not exist");
        return books[_bookId].pricingTier;
    }

    /// @notice Get encrypted distribution window for a book
    /// @param _bookId The book ID
    /// @return Encrypted distribution window
    function getDistributionWindow(uint256 _bookId) external view returns (euint8) {
        require(books[_bookId].exists, "Book does not exist");
        return books[_bookId].distributionWindow;
    }

    /// @notice Grant access to decrypt book rights to a specific address
    /// @param _bookId The book ID
    /// @param _accessor The address to grant access to
    function grantAccess(uint256 _bookId, address _accessor) external {
        require(books[_bookId].exists, "Book does not exist");
        require(
            msg.sender == books[_bookId].owner,
            "Only owner can grant access"
        );

        Book storage book = books[_bookId];
        FHE.allow(book.pricingTier, _accessor);
        FHE.allow(book.distributionWindow, _accessor);

        emit BookDecrypted(_bookId, _accessor);
    }

    /// @notice Get total number of registered books
    /// @return Total book count
    function getTotalBooks() external view returns (uint256) {
        return bookCount;
    }

    /// @notice Check if a book exists
    /// @param _bookId The book ID
    /// @return True if book exists
    function bookExists(uint256 _bookId) external view returns (bool) {
        return books[_bookId].exists;
    }
}
