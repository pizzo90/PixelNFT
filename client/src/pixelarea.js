import React, { Component } from 'react'
import Modal from './modalpixel';



export default class PixelArea extends Component {
    state = { grid: null, showModal: false};
    constructor() {
        super();
        this.state = {
          show: false
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
      }
    componentDidMount = async () => {
        this.setState({},this.grid());
    }


    showModal = () => {
        this.setState({ show: true });
      };
    
      hideModal = () => {
        this.setState({ show: false });
      };


    grid = () => {
        let gridDivs = 400;
        let grid = [];
        let i = 1;
        for(i; i<= gridDivs; i++){
            grid.push(<div className='pixel' key={i} onClick={this.showModal}></div>)
        }
        this.setState({grid: grid})
    }
    

    render() {
        return (
        <>
            
                    {this.state.grid}
            
        <Modal show={this.state.show} handleClose={this.hideModal}>
          <p>Modal</p>
        </Modal>

        </>
        )
    }
}
