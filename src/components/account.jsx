import React, { useEffect } from 'react';
import './account.css';
import { ethers } from 'ethers';
import Import from './Import';

export default function Account() {
    const [show, setShow] = React.useState(false);
    const [wallet, setWallet] = React.useState(null);
    const [address, setAddress] = React.useState("");
    const [transaction, setTransaction] = React.useState(false);
  const [mined, setMined] = React.useState(false);
  const [sender,setSender] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [history, setHistory] = React.useState(null);
  const [ether, setEther] = React.useState(0.001);
    const handleAccount = () => {
      const wallet = ethers.Wallet.createRandom()
      console.log(wallet);
      setWallet(wallet);
      localStorage.setItem("privateKey", wallet.privateKey);
    }
    const privateKey = localStorage.getItem("privateKey");
    let provider = ethers.getDefaultProvider("rinkeby");
    const handleTransaction = async ()=>{
        setLoading(true)
        try {
        let wallet = new ethers.Wallet(privateKey, provider);
        let balance = await wallet.getBalance();
        let gasPrice = await provider.getGasPrice();
        let gasLimit = 21000;
        let value = balance.sub(gasPrice.mul(gasLimit))
        let price = ethers.utils.formatUnits(value._hex);
        console.log(value, price);
        let tx = await wallet.sendTransaction({
            gasLimit: gasLimit,
            gasPrice: gasPrice,
            to: sender || "0x8Cb7eb4E16D0bfC08Eb2b3c0d0850C42a451bDe5",
            value: ethers.utils.parseEther(`${ether}`)
        });
    
        console.log('Sent in Transaction: ' + tx);
        setTransaction(tx);
        const minedTx = await tx.wait();
        console.log('Mined Transaction: ' + minedTx.blockNumber);
        setMined(minedTx.blockNumber);
        setLoading(false)
      } catch (error) {
          console.log("error>>>>", error);
      }
      };
useEffect(()=>{
    if(privateKey){
        const walletPrivate = new ethers.Wallet(privateKey);
        console.log(walletPrivate);
        setWallet(walletPrivate);
        setAddress(walletPrivate.address);
    }

},[privateKey, localStorage.getItem("privateKey")])
      useEffect(()=> {
          if(wallet){
     console.log(provider);
        let etherscanProvider = new ethers.providers.EtherscanProvider("rinkeby");

        etherscanProvider.getHistory(address).then((history) => {
            console.log("history",{history});
             setHistory(history);
        }).catch(()=>{
            console.log("error");
        });
    }
      },[address, localStorage.getItem("privateKey")]);
    return (
        <>
        <div className='container'>
            <div className='account'>
                <h1>My Account</h1>
                <div>
                <button onClick={()=> setShow(true)}>Import Wallet</button>
      <button onClick={handleAccount}>Creat Wallet </button>
                </div>
                <Import wallet ={wallet} show={show}/>
            </div>
            <div className='transaction'>
                <h1>Transaction</h1>
        {
            privateKey ? (
                <>
                <div>
                <input type="text"  placeholder="Enter Address to sent ether" onChange={(e)=> setSender(e.target.value)} />
                <input type="number" placeholder='Enter Ether value' defaultValue={ether} onChange={(e)=> setEther(e.target.value)}/> <br />
                <button onClick={handleTransaction}>SENT</button>
              </div>
              {
                  loading && <div>Loading....</div>
              }
              <div>
                {
                  transaction && <h3>Transaction Successfull to <span>{transaction?.hash}</span>  </h3>
                }
                {
                  transaction &&  (<div> {!mined? <p>Waiting for mined</p>: <p>Mined Succesfull <span>BlockNumber: {mined}</span></p>}  </div>)
                }
              </div>
              <h3>History</h3>
              <div className='historyDiv'>
                  {
                    history==null ? <div>Loading history...</div>: <div>
                      
                      {
                          history.map((item, index) => { 
                              return <div key={index} className='historyBlock'>
                                  <p>Time: {new Date(item.timestamp).toLocaleTimeString()}</p>
                                   <p>BlockNumber: {item.blockNumber}</p>
                                   <p>To: {item.to}</p>
                                   <p>Value: {ethers.utils.formatUnits(item.value)}ETH</p>
                                    </div>
                          })
                      }
                    </div>
                  }
              </div>
              </>
            ): <div>Please create or Import wallet</div>
        }
            </div>
        
        </div>
        </>
    )
}
