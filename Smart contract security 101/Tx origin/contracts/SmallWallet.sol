// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract SmallWallet{
    address public owner;

    constructor(){
        owner = tx.origin;
    }

    function withdrawAll(address _recipient) external {
        require(owner == tx.origin, "Caller is not authorized");        // Avoid using tx.origin, always use msg.sender. 
        payable(_recipient).transfer(address(this).balance);
    }

    receive() external payable{}

}