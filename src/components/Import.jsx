import React from "react";
import { ethers } from "ethers";
export default function Import({ wallet, show }) {
  const [input, setInput] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [walletP, setWallet] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);
  let provider = ethers.getDefaultProvider();

  const handleImport = async () => {
    const walletPrivate = new ethers.Wallet(input);
    setWallet(walletPrivate);
  };

  const getWalletDetails = async (walletPrivate) => {
    setLoading(true);
    try {
      let wallet = await walletPrivate.connect(provider);
      setAddress(wallet.address);
      let balanceHex = await wallet.getBalance();
      let balance = ethers.utils.formatUnits(balanceHex);
      setBalance(balance);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (walletP) {
      getWalletDetails(walletP);
    } else {
        setWallet(wallet)
    }
  }, [walletP, wallet]);

  
  return (
    <>
      {isLoading ? (
        <div>Loading....</div>
      ) : (
        <div>
          {show && (
            <>
              <input type="text" onChange={(e) => setInput(e.target.value)} />
              <button onClick={handleImport}>IMPORT</button>
            </>
          )}
          {address && balance && (
            <div>
              <h1>Address: {address}</h1>
              <h1>Balance: {balance} ETH</h1>
              { !show&&<h1>Private Key : {walletP.privateKey}</h1>}
            </div>
          )}
        </div>
      )}
    </>
  );
}
