// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

interface isSavingsAccount{
    function deposit() external payable;
    function withdraw() external;
}

contract Investor is Ownable{
    isSavingsAccount public immutable savingsAccount;

    constructor(address savingsAccountAddress){
        savingsAccount = isSavingsAccount(savingsAccountAddress);
    }

    function depositIntoSavingsAccount() external payable onlyOwner{
        savingsAccount.deposit{value: msg.value}();
    }

    function withdrawFromSavingsAccount() external onlyOwner{
        savingsAccount.withdraw();
    }

    receive() external payable{
        payable(owner()).transfer(address(this).balance);
    }


}