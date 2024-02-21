import React from "react";

import "./ComparisonData.css";

function VideosData(props) {
	return (
		<div className="comparison-block">
            {props.videos.map(video => (
                <a key={video.title} href={video.link} target="_blank" rel="noreferrer">
                    <img className="comparison-product-image" src={video.thumbnail} alt={video.title} />
                    <p>{video.length}</p>
                    <h4>{video.title}</h4>
                    <p className="body-1">{video.channel_name}</p>
                    <p className="body-1">{video.views} views | {video.published_date}</p>
                </a>
            ))}
        </div>
	);
}

export default VideosData;
