import React, { Component } from 'react'

export default class PixelArea extends Component {
    state = { grid: null};
    componentDidMount = async () => {
        this.setState({},this.grid());
    }


    grid = () => {
        let gridDivs = 400;
        let grid = [];
        let i = 1;
        for(i; i<= gridDivs; i++){
            grid.push(<div className='pixel' key={i}></div>)
        }
        this.setState({grid: grid})
    }
    
    render() {
        return (
        <>
            
                    {this.state.grid}
            
        </>
        )
    }
}
