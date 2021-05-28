import { prototype } from '@truffle/hdwallet-provider';
import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";

export default class Pixel extends Component {
   constructor(props){
        super(props);
        console.log(props)
        this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
        this.state = {
            name: props.name,
            red: props.red,
            green: props.green,
            blue: props.blue,
            id: props.pixelId,
            showModal: false,
            minted: props.minted
        }
    }

    sayHello = (name) => {
        alert("I was clicked " + name);
    };

	handleClose = (event) => {
		this.setState({ showModal: false });
	}

	handleShow = (event) => {
        event.preventDefault();
		this.setState({ showModal: true });
	}
    
    render(){
        if(!this.state.minted){
            return(
            <div className="pixel-wrapper">
                <div className="pixel skeleton" key={this.state.id}>
                </div>
            </div>
            )
        }
        return (
        <div className="pixel-wrapper">
            <div 
                className="pixel minted" 
                style={
                    {width: '100px', 
                    height: '100px',
                    backgroundColor: 'rgb(' + this.state.red + ', ' + this.state.green + ', ' + this.state.blue + ')',
                    opacity: "100%",    
                    }
                }
                onClick={this.handleShow} 
                key={this.state.id}>
                    <span>{this.state.id}</span>     
            </div>
            <Modal show={this.state.showModal} onHide={this.handleClose}>
                <Modal.Header closeButton>
			    <Modal.Title>Modal heading</Modal.Title>
		        </Modal.Header>
		        <Modal.Body>
                    Woohoo, you're reading this text in a modal!
                    {this.state.name}
                </Modal.Body>
	            <Modal.Footer>

		        </Modal.Footer>
		</Modal>
        </div>
        )        
    }
}