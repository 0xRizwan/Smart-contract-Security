// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract AgreedPrice{
    address public owner;
    uint256 public price;

    constructor(uint256 _price) {
        owner = msg.sender;
        price = _price;
    }

    modifier onlyOwner(){
        require(owner == msg.sender, "Restricted access");
        _;
    }


    function setOwner(address _owner) external onlyOwner {
        owner = _owner;
    }

    function updatePrice(uint256 _price) external onlyOwner {
        price = _price;
    }

}