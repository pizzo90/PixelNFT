import React, { Component } from 'react';
import Axios from 'axios';
import Pixel from './Pixel';
const numberofPixels = 400;

export default class PixelArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
          grid: null, 
          pixelsSketelonArray: null
        };
    }
    componentDidMount = async () => {
        this.setState({},this.pixelGrid());
    }

    pixelGrid = () => {
      let gridDivs = numberofPixels;
      let pixels = [];
      let i = 0;
      for(i; i<= gridDivs; i++){
        let pixelElm = {"name": "ssdds"+i, "pixelId": i, "blue": null, "red": null, "green": null};
        pixels.push(pixelElm);
      }
      let grid = null
      let pixelsList = pixels.map((pixel) => <Pixel name={pixel.name} key={pixel.pixelId} pixelId={pixel.pixelId} />)
      this.setState({grid: grid, pixelsSkeletonArray: pixelsList})
    }    


    mintedPixels = () => {
      let mintedPixels = [];
      let config = {
        method: 'get',
        url: 'https://pixels-d687.restdb.io/rest/pixels',
        headers: { 
          'x-api-key': '86f0bf6684ea418ff631672ffc618ba326e65', 
          'Content-Type': 'application/json'
        }
      };
      Axios(config)
        .then(function (response) {
        console.log(JSON.stringify(response.data));
        return response.data;
      })
        .catch(function (error) {
        console.log(error);
      });
    }

    render() {
        if(!this.state.pixelsSkeletonArray){
          return <div className="loading">LOADING</div>
        } else {
        return (
        <>
        {this.state.pixelsSkeletonArray}
        </>
        )
    }
  }
}
