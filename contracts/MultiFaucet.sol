// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMintableERC20 {
    function mint(address to, uint256 amount) external;
}

contract MultiFaucet {
    function getTokens(address[] calldata tokens, uint256[] calldata amounts, address to) external {
        require(tokens.length == amounts.length, "Length mismatch");
        for (uint i = 0; i < tokens.length; i++) {
            IMintableERC20(tokens[i]).mint(to, amounts[i]);
        }
    }
}
