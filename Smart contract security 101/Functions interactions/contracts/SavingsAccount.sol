// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/Address.sol";

contract SavingsAccount{

    using Address for address payable;

    mapping (address => uint256) public balancesOf;

    function deposit() external payable{
        balancesOf[msg.sender] += msg.value;
    }

    function withdraw() external {
        uint256 amountDeposited = balancesOf[msg.sender];
        balancesOf[msg.sender] = 0;                          // Updated the balances first before the actual transfer to prevent reentrancy
        payable(msg.sender).sendValue(amountDeposited);
    }

}