# Smart Contract Docs

The following details describe the smart contract architecture of the unHODL protocol, a **multi-layer** GHO facilitator. This protocol enables whitelisted NFTs to be supplied as collateral, giving the NFT owner the flexibility to choose whether to mint GHO through the *native* protocol route or via *Aave V3*. Each route offers distinct advantages, which will be explained shortly. It also features a **cross-chain** risk management layer that seamlessly integrates with *Savvy Defi*'s strategies.


## unHODL contract

This serves as the foundational protocol, also functioning as a vault in the current stage of development. It encapsulates the logic to be deployed on the source network.

### Data Structs
1. #### LoanState Enum

```solidity
enum LoanState {
    DUMMY_DO_NOT_USE,
    Active,
    Repaid,
    Defaulted
}
```
- Enumerates the possible states of a loan.
- States include "Active" (indicating an ongoing loan), "Repaid" (indicating a fully repaid loan), and "Defaulted" (indicating a loan that has defaulted).

2. #### Facilitator Enum

```solidity
enum  Facilitator {
    Native,
    AaveV3
}
```
- Enumerates facilitator options for handling loans.
- Options include "Native" (for using the native facilitator) and "AaveV3" (for utilizing the AaveV3 facilitator).

3. #### LoanTerms Struct

```solidity
struct LoanTerms {
    address collateralAddress;
    uint256 collateralId;
    uint256 principal;
    Facilitator facilitator;
}
```
- Defines the terms of a loan, including collateral NFT address, collateral NFT token ID, principal amount of GHO to borrow, and chosen facilitator.
- 0 = Native facilitator. 1 = Aave V3 facilitator.
- Provides a structured way to store loan-related information.

4. #### LoanData Struct
```solidity
struct LoanData {
    LoanState state;
    uint64 startDate;
    uint64 lastAccrualTimestamp;
    uint256 entryPrice;
    uint256 balance; 
    uint256 interestAmountPaid;
    uint256 allowance;
    LoanTerms terms;
    address owner;
}
```
- Stores data related to the state and details of a loan.
- Includes the loan state, start date, last accrual timestamp, entry price, balance, interest amount paid, allowance, loan terms, and owner address.
- Offers a comprehensive representation of the loan's current status and characteristics.

### Read Methods
1. #### GHO

```solidity
function GHO() external view returns (address);
```

- returns the address of GHO token

2. #### USDC

```solidity
function USDC() external view returns (address);
```

- returns the address of USDC token


3. #### A-Token USDC

```solidity
function aTokenUSDC() external view returns (address);
```

- returns the address of Aave token for the USDC > GHO pool


3. #### Receiver

```solidity
function receiver() external view returns (address);
```

- returns the address of the receiver contract that holds the risk management logic with Savvy Defi. 
- After a transaction is initiated on the source chain, through Chainlink's CCIP, we are able to interact with the receiver contract across a different chain.

4. #### Loan ID Tracker

```solidity
function loanIdTracker() external view returns (uiint256)
```
- returns the total number of loans that have be created in the lifespan of the contract

5. #### Interest Rate

```solidity
function interestRate() external view returns (uiint256)
```
- returns the interest rate for borrowing GHO. 10% would be 1000 units.


6. #### USDC Treasury Balance

```solidity
function usdcTreasuryBalance() external view returns (uint256);
```
- returns the amount of USDC available in the treasury to facilitate GHO minting through the Aave V3 integration.
- Its amount must not be less than the floor price of the NFT being staked through the Aave facilitator at the time of the supply.

7. #### GHO Treasury Balance

```solidity
function ghoTreasuryBalance() external view returns (uint256);
```
- returns the bucket size of GHO for minting through the Native integration.
- Its amount must not be less than the floor price of the NFT being staked through the Native facilitator at the time of the supply.

8. #### Get Latest Price

```solidity
function getLatestPrice() external view returns (int256)
```
- returns the latest floor price of Crypto Punk NFT.

9. #### Calculate Interest

```solidity
function calculateInterest(uint256 loanId) public view returns (uint256 interestAmountDue)
```
- returns the interest if a loan with id **loanId**.
- factors in the time, amount, and interest rate.

10. Calculate Collateral Value

```solidity
function calculateCollateralValue(uint256 amount, bool withAave) external pure returns (uint256 value);
```

- returns the maimum borrowable **value** when you borrow **amount** tokens through the native or thrid-party (Aave V3) facilitators (**withAave**).
- if **withAave** = true; returns max borrowable GHO if entering Aave
- if **withAave** = false; returns max max borrowable GHO if entering our native

11. #### Get Loan

```solidity
function getLoan(uint256 loanId) external view returns (LoanLibrary.LoanData memory loanData);
```
- returns the **LoanData** struct of the loan with id: **loanId**.


### Write Methods

1. #### Start Loan
This method is used when a holder of a whitelisted NFT wants to supply it as a collateral to borrow GHO.
```solidity
function startLoan(LoanTerms calldata terms) external returns (uint256 loanId);
```
- check the **LoanTerms** struct for the correct argument format.
- terms.collateralAddress must be a whitelisted NFT address
- terms.collateralId must be a token ID owned by the message sender 
- terms.principal must be *> 0 < calculateCollateralValue(getLatestPrice())*;
- terms.facilitator must be 0 or 1 for native or Aave v3 facilitators respectively.
- the message sender must approve the **unHODL** smart contract to be able to spend the NFT from the message sender. 
- to do this, call the *approve(unHODLContractAddress, terms.collateralId);* method with the given parmeters to approve the unHoDL contract address
- if terms.facilitator = 0, based on the available tresusry balance of GHO *ghoTreasuryBalance()*, the protocol will send terms.principal to the message sender
- if terms.facilitator = 1, based on the available tresusry balance of USDC *usdcTreasuryBalance()*, the protocol will engage with Aave and send terms.principal to the message sender
- The remaining allowance and over collateralized portion, through CCIP, makes a cross-chain investment into Savvy Defi.
- The message sender's share is recorded in the Reciever contract *receiver()*

2. #### Repay Debt
This method is used when to repay a loan that was borrowed with a staked collateral by the message sender. It allows you to pay partly or fully. Interest rates also apply.

```solidity
function repayDebt(uint256 loanId, uint256 amount) external;
```
- caller must approve the smart contract in the GHO token smart contract
- caller must be the oner of the loan with ID: **loanId**
- **amount** must be not be more than the sum of *(getLoan(loanId)).balance + calculateInterest(loanId)*
- if the maximum amount is paid, the underlying NFT gets sent back to the message sender, and a cross chain position exit occurs in the Savvy pool, which remits incentives to the off-chain wallet of the user if they had some unborrowed allowance all along
- else, the repayment is sent to  the Aave repay if a=Aave facilitator was used for the loan with the id, Or it gets added to the Native bucket
- Any excess is sent to the cross-chain risk management strategy

