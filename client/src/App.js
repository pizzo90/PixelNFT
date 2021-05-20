import React, { Component } from "react";
import PixelContract from "./contracts/Pixel.json";
import getWeb3 from "./getWeb3";
import Axios from "axios";
import "./App.css";

class App extends Component {
  state = { pixelsN: 0, web3: null, accounts: null, contract: null, pixelImages: null };
  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = PixelContract.networks[networkId];
      const instance = new web3.eth.Contract(
        PixelContract.abi,
        deployedNetwork && deployedNetwork.address,
      );
      this.setState({ web3, accounts, contract: instance }, this.runConnection);
    } catch (error) {
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };
  runConnection = async () => {
    const { accounts, contract } = this.state;
    const address = contract.address;
    let minedPixels = await contract.methods.getNumberOfPixels().call();
    let index = 0;
    let images = [];
    while(index < minedPixels) {
      let token = await contract.methods.pixels(index).call();
      let tokenURI = await contract.methods.tokenURI(index).call().then(
        res => {
          if(res.length > 0){
            Axios.get(res).then(
              response => {
                 images.push(response.data.image); 
              }, error => {
                  console.log(error);
              }
            )
          }
        },err => {
            console.log(err);
        }
      );
      index++;
    }
    console.log(images);
    const response = await contract.methods.getNumberOfPixels().call();
    this.setState({ pixelsN: response, pixelImages: images });
  };
  render() {
    if (!this.state.web3 && !this.state.pixelImages) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Connected to smart contract PIXELS [PxP].</p>
        <div>Number of created Pixels: {this.state.pixelsN}</div>
        <div className="Pixels">
          {(() => {
            if(!this.state.pixelImages) {
              return (<div>.....Loading Pixels....</div>)
            }else{
              return this.state.pixelImages.map(function(value){
                return <img src={value}/>;
              })
            } 
          })()}
        </div>
      </div>
    );
  }
}

export default App;
