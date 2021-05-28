import React, { Component } from 'react';
import Axios from 'axios';
import Pixel from './Pixel';
const numberofPixelsSkeleton = 200;

export default class PixelArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
          grid: null, 
          pixelsSketelonArray: null,
          mintedPixels: null
        };
    }
    componentDidMount = async () => {
        this.setState({},this.pixelGrid());
    }

    pixelGrid = () => {
      let gridDivs = numberofPixelsSkeleton;
      let pixels = [];
      let i = 0;
      for(i; i<= gridDivs; i++){
        let pixelElm = {"name": "skeleton"+i, "pixelId": i, "blue": null, "red": null, "green": null, "minted": false};
        pixels.push(pixelElm);
      }
      let grid = null
      let pixelsList = pixels.map((pixel) => <Pixel name={pixel.name} minted={pixel.minted} key={pixel.pixelId} pixelId={pixel.pixelId} />)
      this.setState({grid: grid, pixelsSkeletonArray: pixelsList}, this.mintedPixels())
    }

    mintedPixels = () => {
      this.setState({},this.callAxios())
    }

    callAxios = () => {
      let mintedPixels = [];
      let config = {
        method: 'get',
        url: 'https://pixels-d687.restdb.io/rest/pixels',
        headers: { 
          'x-api-key': '60ad205b318a330b62f586d6', 
          'Content-Type': 'application/json'
        }
      };
          Axios(config).then(
            res => {
              this.setState({mintedPixels: res.data.map(
                 (pixel1) => 
                 <Pixel 
                  key={pixel1.data.name + pixel1.pixelIndex} 
                  minted="true"
                  red={pixel1.data.red} 
                  green={pixel1.data.green} 
                  blue={pixel1.data.blue} 
                  pixelId={pixel1.pixelIndex} 
                  name={pixel1.data.name} /> 
                )})
            },err => {
                console.log(err);
            }
          ) 
      }
    
      colorPixels = () => {
          return this.state.mintedPixels;
      }

    render() {
        if(!this.state.pixelsSkeletonArray){
          return <div className="loading">LOADING</div>
        } else {
        return (
        <>
        {this.state.mintedPixels}
        {this.state.pixelsSkeletonArray}
        </>
        )
    }
  }
}
