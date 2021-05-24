
import React, { Component } from 'react'

export default class PixelArea extends Component {
    componentDidMount = async () => {
        let number = 1000;
        function ListaNumeri(props) {
            const numeri = props.numeri;
            const lista = numeri.map((numero) =>
              <Numero key={numero.toString()}
                      valore={numero} />
            );
    
    
    }

    render() {
        return (
        <>
          <h2>pm</h2>
    
        </>
        )
    }
    
}



