import React, { Component } from "react";
import PixelContract from "./contracts/Pixel.json";
import getWeb3 from "./getWeb3";
import Axios from "axios";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';



import Header from "./Header";
import FirstSection from "./Firstsection";
import Footer from "./Footer";
import PixelArea from "./Pixelarea";

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
      <section id="2-section">
        <div className="container">
        <h2 className="subTit">Lorem Ipsum</h2>
          <div className="row d-flex">
              <div className="col-md-6  align-c">
                  <div className="txt-inner">
                  <div className="Boxtextpixel">
                        <div className="row icon-1">
                        <hr></hr>
                          <div className="col-md-12 mtop100 mbot100">
                            <h2><b>Random color</b></h2>
                            <p>The single color of the pixel is generated randomly.<br></br>
                            Chance is the only legitimate ruler of the universe.
                            (Honoré de Balzac)</p>
                          </div> 
                        </div> 

                        <div className="row icon-2">
                        <hr></hr>
                          <div className="col-md-12  mtop100 mbot100">
                            <h2><b>RGB colors</b></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                          </div> 
                        </div> 

                        <div className="row icon-3">
                        <hr></hr>
                          <div className="col-md-12 mtop100 mbot100">
                            <h2><b>1 PIXEL every day</b></h2>
                            <p>A new pixel will be created every day. for a limited time.</p>
                          </div> 
                        </div> 


                        <div className="row icon-2">
                        <hr></hr>
                          <div className="col-md-12  mtop100 mbot100">
                             
                            <h2><b>ERC721 TOKEN</b></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
                          
                          
                          </div> 
                        </div> 
                     </div> 
                   </div> 
              </div> 
              <div className="col-md-6 d-flex">
                    <div className="ExaplePix"></div>
              </div>   
           </div>    
        </div>
      </section>


      

      <section id="3section">
        <div className="container-fluid mtop100">
          <div className="row"> 
              <div className="col-md-10 offset-md-1 text-center mtop100 Boxtextpixel2">
                <h2 class="subTit">Here there are 365 Pixels </h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div> 
            <div className="pixel-content mtop100" id="pixels-grid" style={{backgroundcolor: this.state.color}}>
                <PixelArea/>
              </div>    
           </div>    
        </div>
      </section>


 
          <Footer/>
      

      </div>





    )}
}






export default App;


/**
 * <h1>Good to Go!</h1>
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
 */