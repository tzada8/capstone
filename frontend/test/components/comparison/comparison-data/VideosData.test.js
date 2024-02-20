import React from "react";
import { render } from "@testing-library/react";

import VideosData from "../../../../src/components/comparison/comparison-data/VideosData";

const videos = [
    {
        title: "Video 1",
        link: "https://example.com/video1",
        thumbnail: { static: "https://example.com/thumbnail1.jpg" },
        length: "5:30"
    },
    {
        title: "Video 2",
        link: "https://example.com/video2",
        thumbnail: { static: "https://example.com/thumbnail2.jpg" },
        length: "3:45"
    }
];

describe("VideosData", () => {
    it("renders correctly with videos data", () => {
        const { getByText, getByAltText } = render(<VideosData videos={videos} />);

        expect(getByText("5:30")).toBeInTheDocument();
        expect(getByText("Video 1")).toBeInTheDocument();
        expect(getByAltText("Video 1")).toBeInTheDocument();
        expect(getByText("3:45")).toBeInTheDocument();
        expect(getByText("Video 2")).toBeInTheDocument();
        expect(getByAltText("Video 2")).toBeInTheDocument();
    });

    it("renders without crashing if videos data is not provided", () => {
        const { container } = render(<VideosData videos={[]} />);

        expect(container.querySelector("div")).toBeInTheDocument();
        expect(container.querySelector("div")).toBeEmptyDOMElement();
    });
});
