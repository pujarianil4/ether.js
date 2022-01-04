import React from "react";
import { ethers } from "ethers";
import './import.css'
export default function Import({ wallet, show }) {
  const [input, setInput] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [walletP, setWallet] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);
 const privateKey = localStorage.getItem("privateKey");
 
  
  const [showKey, setShowKey] = React.useState(false);
  let provider = ethers.getDefaultProvider("rinkeby");

  const handleImport = async () => {
    setLoading(true);
    localStorage.setItem("privateKey", input);
    const walletPrivate = new ethers.Wallet(input);
    setWallet(walletPrivate);
    setAddress(walletPrivate.address);
    let balanceHex = await provider.getBalance(walletPrivate.address);
    let balance = ethers.utils.formatUnits(balanceHex);
    setBalance(balance);
    setLoading(false);
  };

  const getWalletDetails = async (walletPrivate) => {

    localStorage.setItem("privateKey", walletPrivate.privateKey);
    setLoading(true);
    try {
      let wallet = await walletPrivate.connect(provider);
      setAddress(wallet.address);
      let balanceHex = await wallet.getBalance();
      let balance = ethers.utils.formatUnits(balanceHex);
      setBalance(balance);
    } catch (error) {
      console.log("error");
    } finally {
      setLoading(false);
    }
  };


 

  React.useEffect(() => {
    if(privateKey ){
      setInput(privateKey);
    }
  }, []);
  React.useEffect(() => {
    if(privateKey === input && wallet === null){
      handleImport();
    }
  }, [input]);


  React.useEffect(() => {
    if (wallet) {
      setWallet(wallet);
      getWalletDetails(wallet);
    }
  }, [wallet]);

  
  return (
    <>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <div>
          {show && (
            <>
              <input placeholder="Enter Private Key" type="text" onChange={(e) => setInput(e.target.value)} />
              <button onClick={handleImport}>IMPORT</button>
            </>
          )}
         
            <div>
            <div className="details">
              <h3>Address: <span>{address}</span></h3>
              <h3>Balance: <span>{balance}</span> ETH</h3>
              { <h3>Private Key :  <input type={showKey? "text": "password"} value={walletP?.privateKey} disabled/> <span> <button onClick={()=> setShowKey(!showKey)}>View</button> </span></h3>}
            </div>
          
            </div>
        
        </div>
      )}
        
    </>
  );
}
