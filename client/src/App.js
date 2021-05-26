import React, { Component } from "react";
import PixelContract from "./contracts/Pixel.json";
import getWeb3 from "./getWeb3";
import Axios from "axios";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "./header";
import FirstSection from "./firstsection";
import PixelArea from "./pixelarea";




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
      let tokens = await contract.methods.pixels(index).call();
      let tokenURI = await contract.methods.tokenURI(index).call().then(
        res => {
          if(res.length > 0){
            console.log(res);
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
    
    let pixelsNumber = await contract.methods.getNumberOfPixels().call();
    this.setState({ pixelsN: pixelsNumber, pixelImages: images });
  };
  render() {
   
    return (
      <div className="App">
      
      <Header/> 
      <FirstSection/>

      <section id="2section">
        <div className="container">
          <div className="row d-flex">
              <div className="col-md-8">
                  <div className="txt-inner">
                    <h2 className="subTit">Lorem Ipsum</h2>
                    <div class="Boxtextpixel">
                      <div className="row d-flex">
                          <div className="col-md-3 align-c">
                            <img className="img-icon" src="https://img.icons8.com/ios/452/bitcoin.png"></img>
                          </div>  
                          <div className="col-md-9 align-c">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                          </div> 
                        </div> 
                        <div className="row d-flex">
                          <div className="col-md-3 align-c">
                            <img className="img-icon" src="https://img.icons8.com/ios/452/bitcoin.png"></img>
                          </div>  
                          <div className="col-md-9 align-c">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                          </div> 
                        </div> 
                        <div className="row d-flex">
                          <div className="col-md-3 align-c">
                            <img className="img-icon" src="https://img.icons8.com/ios/452/bitcoin.png"></img>
                          </div>  
                          <div className="col-md-9 align-c">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                          </div> 
                        </div> 
                     </div> 
                   </div> 
              </div> 
              <div className="col-md-4 align-c">
                <div className="ExaplePix">
                </div> 
              </div>   
           </div>    
        </div>
      </section>



      <section id="3-section">
        <div className="container-fluid">
          <div className="row"> 
            <div className="pixel-content" id="Mydiv">
                
                <PixelArea/>
              
              
              </div>    
           </div>    
        </div>
      </section>


        <h1>Good to Go!</h1>
            <p>Connected to smart contract PIXELS [PxP].</p>
            <div>Number of created Pixels: {this.state.pixelsN}</div>
            <div className="Pixels">
              {(() => {
                if(!this.state.pixelImages) {
                  return (<div>[.....Loading Pixels.....]</div>)
                }else{
                  return this.state.pixelImages.map(function(value,index){
                    return <img key={index} src={value}/>;
                  })
                } 
              })()}
            </div>
      </div>
   
    )}
}



export default App;
