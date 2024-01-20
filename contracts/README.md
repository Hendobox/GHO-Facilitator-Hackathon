# Smart Contract Docs

The following details describe the smart contract architecture of the unHODL protocol, a **multi-layer** GHO facilitator. This protocol enables whitelisted NFTs to be supplied as collateral, giving the NFT owner the flexibility to choose whether to mint GHO through the *native* protocol route or via *Aave V3*. Each route offers distinct advantages, which will be explained shortly. It also features a **cross-chain** risk management layer that seamlessly integrates with *Savvy Defi*'s strategies.


## unHODL contract

This serves as the foundational protocol, also functioning as a vault in the current stage of development. It encapsulates the logic to be deployed on the source network.

### Data Structs

```solidity
enum LoanState {
    DUMMY_DO_NOT_USE,
    Active,
    Repaid,
    Defaulted
}

enum Facilitator {
    Native,
    AaveV3
}

struct LoanTerms {
    address collateralAddress;
    uint256 collateralId;
    uint256 principal;
    Facilitator facilitator;
}

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
1. **LoanState Enum:**
   - Enumerates the possible states of a loan.
   - States include "Active" (indicating an ongoing loan), "Repaid" (indicating a fully repaid loan), and "Defaulted" (indicating a loan that has defaulted).

2. **Facilitator Enum:**
   - Enumerates facilitator options for handling loans.
   - Options include "Native" (for using the native facilitator) and "AaveV3" (for utilizing the AaveV3 facilitator).

3. **LoanTerms Struct:**
   - Defines the terms of a loan, including collateral NFT address, collateral NFT token ID, principal amount of GHO to borrow, and chosen facilitator.
   - 0 = Native facilitator. 1 = Aave V3 facilitator.
   - Provides a structured way to store loan-related information.

4. **LoanData Struct:**
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