import React from "react";

import "./ComparisonData.css";

function VideosData(props) {
    const noVideos = props.videos.length === 0;

	return (
		noVideos ? <p className="body-1">Product has no related videos.</p> : <div>
            {props.videos.map((video, i) => (
                <div key={`video-${i}`} className="related-videos-spacing">
                    <a key={video.title} href={video.link} target="_blank" rel="noreferrer">
                        <figure className="related-videos-container" data-category={video.length}>
                            <img className="related-videos-thumbnail" src={video.thumbnail} alt={video.title} />
                        </figure>
                        <p className="body-1-bold video-title-spacing">{video.title}</p>
                        <div className="channel-details-container">
                            <p className="body-3">{video.channel_name}</p>
                            <p className="body-3">{video.views} views &nbsp;|&nbsp; {video.published_date}</p>
                        </div>
                    </a>
                </div>
            ))}
        </div>
	);
}

export default VideosData;
