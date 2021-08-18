// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

//import the ERC20 interface
interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);
}

//import the uniswap router
interface IUniswapV2Router02 {
    
    //Swaps an exact amount of tokens for ETH as possible as
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
    external returns (uint[] memory amounts);
  
    //Returns the minimum input asset amount required to buy the given output asset amount 
    function getAmountsIn(uint amountOut, address[] memory path) external view returns (uint[] memory amounts);
    
    //to get WETH address
    function WETH() external pure returns(address);
    
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable ;
}

//Smart contract for uniswap token
contract uniswapTokenToEth {

   address private _owner;

 //uniswap rounter and the address is same in ethereum network
  address internal constant uniswapRounterV2 = address(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

  IUniswapV2Router02 public uniswapRouter;
  
  mapping (address => uint) public balance;  

  //Wrapped ETH (rinkeby, robsten) all are same address
  address private WETH = 0xc778417E063141139Fce010982780140Aa0cD5Ab;
  //mainnet WETH - 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
  
  address[] private path = new address[](2);
     
  constructor(address _tokenAddress) {
    uniswapRouter = IUniswapV2Router02(uniswapRounterV2);
    path[0] = _tokenAddress;
    path[1] = WETH;//uniswapRouter.WETH();  
    _owner = msg.sender;
  }

  modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");
        _;
    }


 //call the addLiquidity function to add the liquidity to the pool thru uniswap router 
 function addLiquidity(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable {
        
     
        
        //uint deadline = block.timestamp + 250; 
        //before add the liquidity need to give approval to the uniswap rounter for tokens to supply to the liquidity
        IERC20(token).approve(uniswapRounterV2, amountTokenDesired);
        
        
        //token - A pool token.
        //amountTokenDesired - The amount of token to add as liquidity if the WETH/token price is <= msg.value/amountTokenDesired (token depreciates).
        //amountETHDesired (msg.value)-The amount of ETH to add as liquidity if the token/WETH price is <= amountTokenDesired/msg.value (WETH depreciates).
        //amountTokenMin - Must be <= amountTokenDesired
        //amountETHMin - Must be <= msg.value.
        //to - Recipient of the liquidity tokens.
        //deadline - Unix timestamp after which the transaction will revert.
    
        uniswapRouter.addLiquidityETH{value: msg.value}(token,amountTokenDesired, amountTokenMin,amountETHMin,to,deadline);
    }

  
  //The amount of ETH to receive - The maximum amount of input tokens that can be required 
  //amountOut -  amount of ETH to receive
  //amountInMax - The maximum amount of input tokens that can be required 
  function swapTokenForEth(uint amountIn, uint amountOutMin, uint deadline) public {

    //transfer(address recipient, uint256 amount) 
    //first need to transfer the amount in tokens from the msg.sender to this contract
    IERC20(path[0]).transfer(address(this), amountIn);

    //next need to allow the uniswapv2 router to spend the token that sent to this contract
    //by calling IERC20 approve you allow the uniswap contract to spend the tokens in this contract 
    IERC20(path[0]).approve(uniswapRounterV2, amountIn);
    
    //amountIn - 	The amount of input tokens to send.
    //amountOutMin - The minimum amount of output tokens that must be received
    //path - token/WETH (getting from the constructor)
    //to - the amount to send (address(this))
    
    uniswapRouter.swapExactTokensForETH(amountIn, amountOutMin, path, address(this), deadline);
    
    //map the ETH to accumulate for the user 
    balance[msg.sender] += address(this).balance;
  }
  
  //Returns the minimum input asset amount required to buy the given output asset amount 
  function getEstimatedTokenforETH(uint _tokenAmount) public view  returns (uint[] memory) {
    //Returns the minimum input asset amount required to buy the given output asset amount 
    return uniswapRouter.getAmountsIn(_tokenAmount, path);
  }

  function withdrawEth() external onlyOwner{
      
        require(address(this).balance > 0 ,'No balance to transfer');
        uint amount = balance[msg.sender];
        balance[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
        
        //(bool success, ) = msg.sender.call{value: amount}("");
        //require(success, "Could not withdraw.");
   }      
  
  
  // important to receive ETH
  receive() payable external {}
}