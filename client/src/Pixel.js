import React, { Component } from 'react';
import Modal from "react-bootstrap/Modal";

export default class Pixel extends Component {
   constructor(props){
        super(props);
        this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);
        this.state = {
            name: props.name,
            red: props.red,
            green: props.green,
            blue: props.blue,
            id: props.pixelId,
            showModal: false
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
        return (
        <div className="pixel-wrapper">
            <div className="pixel" onClick={this.handleShow} key={this.state.id}>
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