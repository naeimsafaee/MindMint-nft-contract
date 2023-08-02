// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20Token is IERC20 {
    string private name;
    string private symbol;
    uint256 private _totalSupply;
    mapping(address => uint256) private balances;
    mapping(address => mapping(address => uint256)) private allowances;

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply) {
        name = _name;
        symbol = _symbol;
        _totalSupply = _initialSupply;
        balances[msg.sender] = _initialSupply / 5;
    }

    function getName() external view returns (string memory) {
        return name;
    }

    function getSymbol() external view returns (string memory) {
        return symbol;
    }

    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address _account) external view override returns (uint256) {
        return balances[_account];
    }

    function transfer(address _recipient, uint256 _amount) external override returns (bool) {
        require(_recipient != address(0), "Invalid recipient");
        require(_amount <= balances[msg.sender], "Insufficient balance");

        balances[msg.sender] -= _amount;
        balances[_recipient] += _amount;

        emit Transfer(msg.sender, _recipient, _amount);
        return true;
    }

    function approve(address _spender, uint256 _amount) external override returns (bool) {
        require(_spender != address(0), "Invalid spender");

        allowances[msg.sender][_spender] = _amount;

        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    function transferFrom(address _sender, address _recipient, uint256 _amount) external override returns (bool) {
        require(_sender != address(0), "Invalid sender");
        require(_recipient != address(0), "Invalid recipient");
        require(_amount <= balances[_sender], "Insufficient balance");
        require(_amount <= allowances[_sender][msg.sender], "Insufficient allowance");

        balances[_sender] -= _amount;
        balances[_recipient] += _amount;
        allowances[_sender][msg.sender] -= _amount;

        emit Transfer(_sender, _recipient, _amount);
        return true;
    }

    function allowance(address _owner, address _spender) external view override returns (uint256) {
        return allowances[_owner][_spender];
    }
}