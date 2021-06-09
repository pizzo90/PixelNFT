
import React, { Component } from 'react'


export default class FirstSection extends Component {
    render() {
        return (
        <>
            <section id="main-home">
                <div className="inner-main-txt text-center">
                    <div className="container">
                        <h1 className="main-tit">PIXEL</h1>
                        <h5>unique collectible pixels color with proof of ownership stored on the Ethereum blockchain.</h5>
                        <button className="mainbutton">DISCOVER MORE</button>
                            <div className="first-pix" style={{animation: animations.fadeInUp}}></div>
                            <div className="second-pix" style={{animation: animations.fadeInUp}}></div>
                            <div className="third-pix" style={{animation: animations.fadeInUp}}></div>
                            <div className="four-pix" style={{animation: animations.fadeInUp}}></div>
                    </div>
                </div>    
            </section>

    </>

        )
    }
}



