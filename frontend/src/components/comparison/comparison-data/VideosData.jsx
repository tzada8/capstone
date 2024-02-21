import React from "react";

import "./ComparisonData.css";

function VideosData(props) {
	return (
		<div>
            {props.videos.map(video => (
                <a key={video.title} href={video.link} target="_blank" rel="noreferrer">
                    <img className="comparison-product-image" src={video.thumbnail} alt={video.title} />
                    <p>{video.length}</p>
                    <p>{video.title}</p>
                    <p>{video.channel_name}</p>
                    <p>{video.views} views | {video.published_date}</p>
                </a>
            ))}
        </div>
	);
}

export default VideosData;
