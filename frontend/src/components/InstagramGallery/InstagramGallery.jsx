import "./InstagramGallery.css";
import { FiInstagram } from "react-icons/fi";
import { useState } from "react";

// thumbnails
import reel1 from "../../assets/reel1.png";
import reel2 from "../../assets/reel2.png";
import reel3 from "../../assets/reel3.png";

export default function InstagramGallery() {

  // reel data (PUT YOUR REAL LINKS)
  const reels = [
    {
      thumbnail: reel1,
      url: "https://www.instagram.com/p/DUhitMWARoy/"
    },
    {
      thumbnail: reel3,
      url: "https://www.instagram.com/p/DUah9Pjj2zS/"
    },
    {
      thumbnail: reel2,
      url: "https://www.instagram.com/p/DT4sGrrD7N0/"
    }
  ];

  const [activeReel, setActiveReel] = useState(null);

  return (
    <>
      <section className="insta-wrap">

        {/* HEADER */}
        <div className="insta-header">
          <h3> Our Instagram</h3>
         <a
            href="https://www.instagram.com/boutiqueprincyfashion/"
            target="_blank"
            rel="noopener noreferrer"
            className="insta-handle"
          >
          <FiInstagram />
          <span>@princyFashionboutique</span>
        </a>

        </div>

        {/* REEL ROW */}
        <div className="insta-row">
          {reels.map((reel, index) => (
            <div
              className="insta-card"
              key={index}
              onClick={() => setActiveReel(reel.url)}
            >
              <img src={reel.thumbnail} alt="Instagram Reel" />
            </div>
          ))}
        </div>

      </section>

      {/* MODAL */}
      {activeReel && (
        <div className="insta-modal" onClick={() => setActiveReel(null)}>
          <div
            className="insta-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`${activeReel}embed`}
              width="400"
              height="600"
              frameBorder="0"
              scrolling="no"
              allowTransparency="true"
              allow="encrypted-media"
              title="Instagram Reel"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
