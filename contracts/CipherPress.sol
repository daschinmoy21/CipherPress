// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title CipherPress
 * @dev A decentralized news platform that stores article references on-chain
 * and content on IPFS
 */
contract CipherPress {
    // Article structure
    struct Article {
        string cid;          // IPFS Content Identifier
        address author;      // Author's wallet address
        uint256 timestamp;   // Publication timestamp
        bool exists;         // Existence flag
    }
    
    // Storage
    mapping(string => Article) public articles;
    string[] public articleCIDs;
    
    // Events
    event ArticlePublished(string cid, address indexed author, uint256 timestamp);

    // Functions
    function publishArticle(string memory _cid) public {
        require(!articles[_cid].exists, "Article already exists");
        
        articles[_cid] = Article({
            cid: _cid,
            author: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        
        articleCIDs.push(_cid);
        emit ArticlePublished(_cid, msg.sender, block.timestamp);
    }
    
    function getArticleCIDs() public view returns (string[] memory) {
        return articleCIDs;
    }

    function getNewsCount() public view returns (uint256) {
        return articleCIDs.length;
    }

    function getLatestArticles(uint256 count) public view returns (Article[] memory) {
        uint256 totalCount = articleCIDs.length;
        uint256 returnCount = count > totalCount ? totalCount : count;
        
        Article[] memory result = new Article[](returnCount);
        for (uint256 i = 0; i < returnCount; i++) {
            string memory cid = articleCIDs[totalCount - 1 - i];
            result[i] = articles[cid];
        }
        return result;
    }
} 