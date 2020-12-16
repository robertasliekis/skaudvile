import React, { Component } from "react";
import ModelViewerThree from "./ModelViewerThree";
const mapImagesArray = [8, 7, 6, 5, 4, 3, 2, 1];
const activeIconsArray = [
  [
    "hill",
    "Kalniškių piliakalnis",
    `
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!
  `
  ],
  [
    "hill",
    "Ivangėnų I,II piliakalniai",
    `
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!
  `
  ],
  [
    "hill",
    "Nosaičių piliakalnis",
    `
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!
  `
  ],
  [
    "hill",
    "Juškaičių piliakalnis",
    `
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!
  `
  ],
  [
    "gallery",
    "Galerija",
    `
Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nesciunt ea cupiditate magnam. Numquam tenetur ullam iusto officiis, repellendus quo sequi!
  `
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
      virtualTourOpen: false
    };
    this.activeIconsRefs = {};
    this.audioAboutRef = React.createRef();
    this.iframeRef = React.createRef();
  }

  startMapAnimation = () => {
    this.setState({ mapAnimationStarted: true });
  };

  mapIconClicked = (index, categoryType) => {
    let initialState = this.state.categoriesWindowOpen;
    this.setState({ categoriesWindowOpen: !initialState });
    if (index !== undefined) {
      this.setState({ mapIconClickedIndex: index });
    } else {
      this.setState({ categoryType: "about" });
    }
  };

  categoryButtonClicked = (category) => {
    this.setState({ categoryType: category });
  };

  enterVirtualTourClicked = () => {
    let initialState = this.state.virtualTourOpen;
    if (initialState) {
      document.webkitExitFullscreen();
    } else {
      this.iframeRef.current.requestFullscreen();
    }
    this.setState({ virtualTourOpen: !initialState });
  };

  render() {
    const classAboutButton = this.state.categoryType === "about" ? "active-category-button" : "";
    const classTourButton = this.state.categoryType === "tour" ? "active-category-button" : "";

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
          <div className="active-icons-container">
            {activeIconsArray.map((activeIcon, index) => {
              return (
                <div className="icon-container" key={index} onClick={() => this.mapIconClicked(index)}>
                  <div className="icon-glow icon"></div>
                  <div className="icon-image icon"></div>
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
            <div
              className={`btn btn-about ${classAboutButton}`}
              onClick={() => {
                this.categoryButtonClicked("about");
              }}
            >
              Apie
            </div>
            <div
              className={`btn btn-tour ${classTourButton}`}
              onClick={() => {
                this.categoryButtonClicked("tour");
              }}
            >
              360 turas
            </div>

            <div className="btn btn-close" onClick={() => this.mapIconClicked()}>
              X
            </div>
          </div>
          <div className="container-about" style={{ display: this.state.categoryType === "about" ? "flex" : "none" }}>
            <div className="title">{activeIconsArray[this.state.mapIconClickedIndex][1]}</div>
            <div className="description">{activeIconsArray[this.state.mapIconClickedIndex][2]}</div>
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
          <div
            className="btn btn-close"
            onClick={() => {
              this.enterVirtualTourClicked();
            }}
          >
            X
          </div>
        </div>
      </div>
    );
  }
}

export default InteractiveMap;
