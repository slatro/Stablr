// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMintable {
    function mint(address to, uint256 amount) external;
}

contract MultiFaucet {
    address[] public tokens;
    uint256[] public decimals;

    constructor(address[] memory _tokens, uint256[] memory _decimals) {
        tokens = _tokens;
        decimals = _decimals;
    }

    function claim() public {
        for (uint256 i = 0; i < tokens.length; i++) {
            uint256 amount = 10000 * (10 ** decimals[i]);
            IMintable(tokens[i]).mint(msg.sender, amount);
        }
    }
}
