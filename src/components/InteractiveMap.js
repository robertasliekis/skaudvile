import React, { Component } from "react";
// import ModelViewerThree from "./ModelViewerThree";

import audioIntro from "../audio/1_Ivadas.mp3";

import audioAbout1 from "../audio/about/2_Kalniskiu piliakalnis.mp3";
import audioAbout2 from "../audio/about/3_Pirmasis Ivangenu piliakalnis.mp3";
import audioAbout3 from "../audio/about/4_Antras Ivangenu piliakalnis.mp3";
import audioAbout4 from "../audio/about/8_Legenda apie karsuvos pili.mp3";
import audioAbout5 from "../audio/about/5_Nosaiciu piliakalnis.mp3";
import audioAbout6 from "../audio/about/6_Juskaiciu piliakalnis.mp3";
import audioAbout7 from "../audio/about/7_Grafikos darbu paroda.mp3";

import audioTour1 from "../audio/tour/01 Tamsioj Naktelėj - In The Dark Night.mp3";
import audioTour2 from "../audio/tour/07 Tu Eglute - Oh, the Spruce Tree.mp3";
import audioTour3 from "../audio/tour/09 Oi Tu Ieva, Ievuže - Oh, the Bird Cherry.mp3";
import audioTour4 from "../audio/tour/10 Per Tiltą Jojau - I Was Riding Through the Bridge.mp3";

const audioAboutArray = [[audioAbout1], [audioAbout2, audioAbout3, audioAbout4], [audioAbout5], [audioAbout6], [audioAbout7]];
const audioTourArray = [audioTour1, audioTour2, audioTour3, audioTour4];

const mapImagesArray = [8, 7, 6, 5, 4, 3, 2, 1];

const activeIconsArray = [
  [
    [
      "Kalniškių piliakalnis",
      `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!`
    ]
  ],
  [
    [
      "Ivangėnų I piliakalnis",
      `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!`,
      0
    ],
    [
      "Ivangėnų II piliakalnis",
      `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!`,
      1
    ],

    [
      "Karšuvos pilis",
      `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!`
    ]
  ],
  [
    [
      "Nosaičių piliakalnis",
      `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!`,
      2
    ]
  ],
  [
    [
      "Juškaičių piliakalnis",
      `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!`,
      3
    ]
  ],
  [
    [
      "Galerija",
      `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!`
    ]
  ]
];

export class InteractiveMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapAnimationStarted: false,
      categoriesWindowOpen: false,
      mapIconClickedIndex: 0,
      categoryType: "about",
      virtualTourOpen: false,
      audioAboutPlaying: false,
      audioTourPlaying: true,
      subcategoriesWindowOpen: false,
      subcategoryClickedIndex: 0,
      tourAudioIndex: 0
    };
    this.audioAboutRefs = {};
    this.audioTourRefs = {};
    this.audioIntroRef = React.createRef();
    this.iframeRef = React.createRef();
  }

  startMapAnimation = () => {
    this.setState({ mapAnimationStarted: true });
    this.audioIntroRef.current.play();
  };

  mapIconClicked = (index, subcategoriesNumber, tourAudioIndex) => {
    let initialState = this.state.categoriesWindowOpen;
    if (subcategoriesNumber === 1 || subcategoriesNumber === undefined) {
      this.setState({ categoriesWindowOpen: !initialState });
      if (index !== undefined) {
        this.setState({ mapIconClickedIndex: index, subcategoryClickedIndex: 0 });
      } else {
        this.setState({ categoryType: "about" });
      }
    } else if (subcategoriesNumber > 1 && !this.state.subcategoriesWindowOpen) {
      this.setState({ mapIconClickedIndex: index, subcategoriesWindowOpen: true });
    } else if (this.state.subcategoriesWindowOpen) {
      this.setState({ categoriesWindowOpen: true, subcategoriesWindowOpen: false, subcategoryClickedIndex: index });
    }
    this.setState({ tourAudioIndex: tourAudioIndex });
    this.audioIntroRef.current.pause();
    this.audioAboutRefs[this.state.mapIconClickedIndex].pause();
    this.audioAboutRefs[this.state.mapIconClickedIndex].currentTime = 0;
  };

  categoryButtonClicked = (category) => {
    this.setState({ categoryType: category });
    if (category !== "about") {
      this.audioAboutRefs[this.state.mapIconClickedIndex].pause();
    }
  };

  audioAboutClicked = () => {
    let initialState = this.state.audioAboutPlaying;
    this.setState({ audioAboutPlaying: !initialState });
    if (initialState) {
      this.audioAboutRefs[this.state.mapIconClickedIndex].pause();
    } else {
      this.audioAboutRefs[this.state.mapIconClickedIndex].play();
    }
  };

  audioTourButtonClicked = () => {
    let initialState = this.state.audioTourPlaying;
    this.setState({ audioTourPlaying: !initialState });
    if (initialState) {
      this.audioTourRefs[this.state.tourAudioIndex].pause();
    } else {
      this.audioTourRefs[this.state.tourAudioIndex].play();
    }
  };

  enterVirtualTourClicked = () => {
    console.log(this.state.tourAudioIndex);

    let initialState = this.state.virtualTourOpen;
    if (initialState) {
      document.webkitExitFullscreen();
      this.audioTourRefs[this.state.tourAudioIndex].pause();
      this.audioTourRefs[this.state.tourAudioIndex].currentTime = 0;
    } else {
      this.iframeRef.current.requestFullscreen();
      this.audioTourRefs[this.state.tourAudioIndex].play();
    }
    this.setState({ virtualTourOpen: !initialState });
  };

  render() {
    const classAboutButton = this.state.categoryType === "about" ? "active-category-button" : "";
    const classTourButton = this.state.categoryType === "tour" ? "active-category-button" : "";
    const classGalleryButton = this.state.categoryType === "gallery" ? "active-category-button" : "";

    return (
      <div className="interactive-map-container">
        <div className="about-project-container">
          <div className="title">Zemelapis</div>
          <div className="description">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit harum, voluptatibus blanditiis adipisci enim quaerat at
            neque officia tenetur nemo placeat molestiae, fugit est molestias porro. Iure non vitae aliquid?
          </div>
        </div>
        <div className="interactive-map-images">
          <div className="image-carousel">
            {mapImagesArray.map((imageNumber, index) => {
              return (
                <div
                  className="image"
                  key={index}
                  style={{
                    zIndex: imageNumber,
                    animationDelay: `${index}s`,
                    animationPlayState: this.state.mapAnimationStarted ? "running" : "paused",
                    backgroundImage: `url("./images/map/${imageNumber}.jpg")`
                  }}
                ></div>
              );
            })}
          </div>
          <div className="active-icons-container" style={{ opacity: this.state.mapAnimationStarted ? 1 : 0, transitionDelay: "8s" }}>
            {activeIconsArray.map((activeIcon, index) => {
              let subcategoriesNumber = activeIcon.length;
              let tourAudioIndex;
              if (activeIcon[0][2] !== undefined) {
                tourAudioIndex = activeIcon[0][2];
              } else {
                tourAudioIndex = 0;
              }
              return (
                <div className="icon-container" key={index} onClick={() => this.mapIconClicked(index, subcategoriesNumber, tourAudioIndex)}>
                  <div className="icon-glow icon"></div>
                  <div className="icon-image icon"></div>
                  <audio
                    ref={(ref) => {
                      this.audioAboutRefs[index] = ref;
                    }}
                  >
                    <source src={audioAboutArray[index][this.state.subcategoryClickedIndex]}></source>
                  </audio>
                </div>
              );
            })}
          </div>
        </div>
        <div className="overlay-start-container" style={{ display: this.state.mapAnimationStarted ? "none" : "flex" }}>
          <div
            className="btn btn-start"
            onClick={() => {
              this.startMapAnimation();
            }}
          >
            Pradėti turą
          </div>
        </div>
        <div className="categories-window-container" style={{ display: this.state.categoriesWindowOpen ? "flex" : "none" }}>
          <div className="buttons-container">
            <div className="category-buttons">
              <div
                className={`btn btn-about ${classAboutButton}`}
                onClick={() => {
                  this.categoryButtonClicked("about");
                }}
              >
                Apie
              </div>
              {this.state.mapIconClickedIndex !== 0 && this.state.mapIconClickedIndex !== 4 ? (
                <div
                  className={`btn btn-tour ${classTourButton}`}
                  onClick={() => {
                    this.categoryButtonClicked("tour");
                  }}
                >
                  360 turas
                </div>
              ) : (
                ""
              )}

              <div
                className={`btn btn-gallery ${classGalleryButton}`}
                onClick={() => {
                  this.categoryButtonClicked("gallery");
                }}
              >
                Galerija
              </div>
            </div>

            <div className="btn btn-close" onClick={() => this.mapIconClicked()}>
              X
            </div>
          </div>
          <div className="container-about" style={{ display: this.state.categoryType === "about" ? "flex" : "none" }}>
            <div className="title">{activeIconsArray[this.state.mapIconClickedIndex][this.state.subcategoryClickedIndex][0]}</div>
            <div className="description">{activeIconsArray[this.state.mapIconClickedIndex][this.state.subcategoryClickedIndex][1]}</div>
            <div
              className="btn btn-audio"
              onClick={() => {
                this.audioAboutClicked();
              }}
            >
              Audio
            </div>
          </div>
          <div className="container-tour" style={{ display: this.state.categoryType === "tour" ? "flex" : "none" }}>
            <p>Jūs einate į</p>
            <p>360° virtualų turą</p>
            <div
              className="btn btn-start"
              onClick={() => {
                this.enterVirtualTourClicked();
              }}
            >
              Pradėti
            </div>
          </div>
        </div>

        <div className="subcategories-window-buttons" style={{ display: this.state.subcategoriesWindowOpen ? "flex" : "none" }}>
          <div className="selection-buttons">
            {activeIconsArray[1].map((subcategory, index) => {
              let tourAudioIndex;
              if (subcategory[2] !== undefined) {
                tourAudioIndex = subcategory[2];
              } else {
                tourAudioIndex = 0;
              }
              return (
                <div className="btn btn-subcategory" key={index} onClick={() => this.mapIconClicked(index, 2, tourAudioIndex)}>
                  {subcategory[0]}
                </div>
              );
            })}
          </div>

          {/* <div className="btn btn-close">X</div> */}
        </div>
        {/* 360 virtual tour window */}
        <div
          className="tour-window-container"
          style={{ display: this.state.virtualTourOpen ? "flex" : "none" }}
          ref={this.iframeRef}
          allowFullScreen
        >
          {/* <ModelViewerThree
            containerType={"gallery"}
            contentIndex={1}
            key={this.state.virtualTourOpen}
            virtualTourOpen={this.state.virtualTourOpen}
          /> */}
          <iframe
            src={`http://panorama.seduvoskultura.lt/#media-name=Seduva_2_1`}
            title="virtual tour"
            frameBorder="0"
            allowFullScreen
            key={`iframe${this.state.containerType}`}
          ></iframe>
          <audio
            ref={(ref) => {
              this.audioTourRefs[this.state.tourAudioIndex] = ref;
            }}
            key={this.state.tourAudioIndex}
          >
            <source src={audioTourArray[this.state.tourAudioIndex]}></source>
          </audio>
          <div
            className="btn btn-close"
            onClick={() => {
              this.enterVirtualTourClicked();
            }}
          >
            <div className="icon"></div>
          </div>
          <div
            className="btn btn-audio"
            onClick={() => {
              this.audioTourButtonClicked();
            }}
          >
            {this.state.audioTourPlaying ? <div className="icon icon-audio-on"></div> : <div className="icon icon-audio-off"></div>}
          </div>
        </div>
        <div
          className="grey-overlay"
          style={{ display: this.state.categoriesWindowOpen || this.state.subcategoriesWindowOpen ? "flex" : "none" }}
        ></div>
        {/* Intro audio container */}
        <div className="audio-container">
          <audio ref={this.audioIntroRef}>
            <source src={audioIntro}></source>
          </audio>
        </div>
      </div>
    );
  }
}

export default InteractiveMap;
