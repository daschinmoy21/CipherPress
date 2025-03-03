// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Contract
contract Indexer{
    struct News {
        string cid;
        uint256 timeStamp;
        string title;
    }
    News[] public newsFeed;


    //event for the news published
    event NewsPublished(string cid, string title, uint256 timestamp);

    // newsPublic function
    function publishNews(string memory _cid,string memory _title ) public{
        require(bytes(_title).length>0,"Title cannot be empty");
        require(bytes(_cid).length>0,"CID cannot be empty");
        
        uint256 time = block.timestamp;
        News memory _data = News({
            title : _title,
            timeStamp : time,
            cid : _cid
        });

        newsFeed.push(_data);

        emit NewsPublished(_cid,_title,time);
    }

    // news retrival
    function getAllNews() public view returns(News[] memory) {
        return newsFeed;
    }

    function getNewsCount() public view returns (uint256) {
        return newsFeed.length;
    }
}