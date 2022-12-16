// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract TokenBank {
    /// @dev token's name
    string private _name;

    /// @dev token's symbol
    string private _symbol;

    /// @dev token's total supply
    uint256 constant _totalSupply = 1000;

    /// @dev deposit
    uint256 private _bankTotalDeposit;

    /// @dev owner
    address public owner;

    /// @dev address's balances
    mapping(address => uint256) private _balances;

    /// @dev TokenBank balances
    mapping(address => uint256) private _tokenBankBalances;

    /// @dev token transfer event
    event TokenTransfer(address indexed from, address indexed to, uint256 amount);

    /// @dev token deposit event
    event TokenDeposit(address indexed from, uint256 amount);

    /// @dev token withdraw event
    event TokenWithdraw(address indexed from, uint256 amount);

    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
        _balances[owner] = _totalSupply;
    }

    /// @dev get token's name
    function name() public view returns (string memory) {
        return _name;
    }

    /// @dev get token's symbol
    function symbol() public view returns (string memory) {
        return _symbol;
    }

    /// @dev get total supply
    function totalSupply() public pure returns (uint256) {
        return _totalSupply;
    }

    /// @dev get target address supply
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }

    /// @dev token transfer
    function transfer(address to, uint256 amount) public {
        address from = msg.sender;
        _transfer(from, to, amount);
    }

    /// @dev transfer actual processing
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal {
        require(to != address(0), "Zero address cannot be specified for 'to'!");
        uint256 fromBalance = _balances[from];

        require(fromBalance >= amount, "Insufficient balance!");

        _balances[from] = fromBalance - amount;
        _balances[to] += amount;
        emit TokenTransfer(from, to, amount);
    }
}
