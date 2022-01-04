import './App.css';
import Import from './components/Import';
import { ethers } from 'ethers'
import React from 'react';
import Account from './components/account';
function App() {
  const [show, setShow] = React.useState(false);
  const [wallet, setWallet] = React.useState(null);
  const handleAccount = () => {
    const wallet = ethers.Wallet.createRandom()

    console.log(wallet);
    setWallet(wallet);
  }
  return (
    <div className="App">
      {/* <button onClick={()=> setShow(true)}>IMPORT</button>
      <button onClick={handleAccount}>CREATE WALLET </button>

    <Import wallet ={wallet} show={show}/> */}
    <Account />
    </div>
  );
}

export default App;
