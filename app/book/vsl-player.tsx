"use client";

import { Play } from "lucide-react";
import { useRef, useState } from "react";
import styles from "./book.module.css";

export default function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);

  async function playVideo() {
    const video = videoRef.current;
    if (!video) return;
    setStarted(true);
    try {
      await video.play();
    } catch {
      // Keep the native controls available if a browser blocks playback.
      if (video.error) setFailed(true);
    }
  }

  return (
    <div className={styles.player}>
      <video
        ref={videoRef}
        className={styles.video}
        controls={started}
        playsInline
        preload="none"
        poster="/video/approval-agents-poster.jpg"
        aria-label="Approval Agents introduction, 27 seconds, with on-screen captions"
        onPlay={() => setStarted(true)}
        onError={() => setFailed(true)}
      >
        <source src="/video/approval-agents-vsl.mp4" type="video/mp4" />
        Your browser does not support embedded video. <a href="/video/approval-agents-vsl.mp4">Watch the video here.</a>
      </video>

      {!started && !failed && (
        <button className={styles.playOverlay} onClick={playVideo} aria-label="Play Approval Agents video, 27 seconds">
          <span className={styles.playButton}>
            <Play size={19} fill="currentColor" aria-hidden="true" />
            Watch the video
            <span className={styles.playDuration}>0:27</span>
          </span>
        </button>
      )}

      {failed && (
        <div className={styles.videoError} role="status">
          <p>The video couldn’t load.</p>
          <a href="/video/approval-agents-vsl.mp4" target="_blank" rel="noopener noreferrer">Open the video <span aria-hidden="true">↗</span></a>
        </div>
      )}
    </div>
  );
}
