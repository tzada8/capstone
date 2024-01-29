import React from "react";

import "./ComparisonData.css";

function VideosData(props) {
	return (
		<div>
            {props.videos.map(video => (
                <a href={video.link} target="_blank" rel="noreferrer">
                    <img src={video.thumbnail.static} alt={video.title} />
                    <p>{video.length}</p>
                    <p>{video.title}</p>
                </a>
            ))}
        </div>
	);
}

export default VideosData;
