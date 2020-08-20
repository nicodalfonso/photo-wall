import React, { Component } from "react";
import "./App.css";

// This URL can be combined with an photo id to fetch an photo.
const PHOTO_URL = (photoId) => `https://picsum.photos/id/${photoId}/200/200`;
// This URL can be used to get an array of objects that contain information
// about various photos.
const PHOTO_LIST_URL = "https://picsum.photos/list";

class App extends Component {
    state = {
        photos: [],
        visiblePhotos: [],
        photosPerLoad: 10,
        timesLoaded: 0,
    };

    componentDidMount = async () => {
        try {
            const photosArr = await (await fetch(PHOTO_LIST_URL)).json();
            this.setState((state) => ({
                photos: photosArr,
                visiblePhotos: this.toJSX(photosArr, 0, state.photosPerLoad),
                timesLoaded: state.timesLoaded + 1,
            }));
        } catch (err) {
            console.log(err);
            console.log("U dun goofed, kid");
        }
    };

    toJSX = (photosArr, firstPhoto, lastPhoto) => {
        return photosArr
            .slice(firstPhoto, lastPhoto)
            .map((photo) => (
                <img
                    alt={photo.filename}
                    key={photo.id}
                    src={PHOTO_URL(photo.id)}
                />
            ));
    };

    loadMorePhotos = (nextBatch) => {
        this.setState((state) => ({
            visiblePhotos: state.visiblePhotos.concat(nextBatch),
            timesLoaded: state.timesLoaded + 1,
        }));
    };

    render() {
        const {
            photos = [],
            visiblePhotos: visiblePhotos = [],
            photosPerLoad,
            timesLoaded,
        } = this.state;
        const firstPhoto = timesLoaded * photosPerLoad;
        const lastPhoto = (timesLoaded + 1) * photosPerLoad;
        const nextBatch = this.toJSX(photos, firstPhoto, lastPhoto);

        return (
            <React.Fragment>
                <header>
                    <h1>Photo Wall</h1>
                </header>
                <div className="collage">{visiblePhotos}</div>
                <button onClick={() => this.loadMorePhotos(nextBatch)}>
                    Show me what you got
                </button>
            </React.Fragment>
        );
    }
}

export default App;
