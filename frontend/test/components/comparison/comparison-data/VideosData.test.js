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
        const { getByText, container } = render(<VideosData videos={videos} />);
        const video1Element = container.querySelector("figure[data-category='5:30']")
        const video2Element = container.querySelector("figure[data-category='3:45']")

        expect(getByText("Video 1")).toBeInTheDocument();
        expect(video1Element.getAttribute("data-category")).toBe("5:30");
        expect(getByText("Video 2")).toBeInTheDocument();
        expect(video2Element.getAttribute("data-category")).toBe("3:45");
    });

    it("renders without crashing if videos data is not provided", () => {
        const { container } = render(<VideosData videos={[]} />);

        expect(container.querySelector("div")).toBeInTheDocument();
        expect(container.querySelector("div")).toBeEmptyDOMElement();
    });
});
