// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

// ==================== whitelister errors ====================

error Only_Whitelisted_NFT();

error Only_Whitelisted_Chain();

// ==================== loanCore errors ====================

error Exceeds_Maximum_Borrowable();

error Invalid_Loan_State();

error Invalid_State();

error Collateral_In_Use();

error Exceeds_Balance();

error Not_Unhealthy();
// ==================== vault errors ====================

error Already_Initialized();

error Zero_Address();

error Too_Many_Items();

error Length_Mismatch();

error Non_Whitelisted_Call(address, bytes4);

error Non_Whitelisted_Approval(address, address);

error Non_Whitelisted_Delegation(address);

error Missing_Authorization(address);

error Withdraws_Enabled();

error Withdraws_Disabled();

error Already_Whitelisted(address, bytes4);

error Not_Whitelisted(address, bytes4);

error Registry_Already_Set();

error Caller_Not_Owner(address);

// ==================== permit errors ====================

error ERC721P_Deadline_Expired(uint256);

error ERC721P_Not_Token_Owner(address);

error ERC721P_Invalid_Signature(address);
