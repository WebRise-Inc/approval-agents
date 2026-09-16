"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./book.module.css";

export default function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const soundOff = muted || volume === 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Set the property as well as the attribute for inline autoplay on Safari.
    video.muted = true;
    void video.play().then(() => setStarted(true)).catch(() => {
      // Keep the play button available when a browser blocks autoplay.
      if (video.error) setFailed(true);
    });
  }, []);

  async function playVideo() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    if (video.volume === 0) video.volume = 1;
    setMuted(false);
    setStarted(true);
    try {
      await video.play();
    } catch {
      // Keep the native controls available if a browser blocks playback.
      if (video.error) setFailed(true);
    }
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !(video.muted || video.volume === 0);
    if (!video.muted && video.volume === 0) video.volume = 1;
    setMuted(video.muted);
    if (!video.muted) {
      void video.play().catch(() => {
        if (video.error) setFailed(true);
      });
    }
  }

  return (
    <div className={styles.player}>
      <video
        ref={videoRef}
        className={styles.video}
        controls={started}
        autoPlay
        muted={muted}
        playsInline
        preload="auto"
        poster="/video/approval-agents-poster.jpg"
        aria-label="Approval Agents introduction, 27 seconds, with on-screen captions"
        onPlay={() => setStarted(true)}
        onVolumeChange={(event) => {
          setMuted(event.currentTarget.muted);
          setVolume(event.currentTarget.volume);
        }}
        onError={() => setFailed(true)}
      >
        <source src="/video/approval-agents-vsl.mp4" type="video/mp4" />
        Your browser does not support embedded video. <a href="/video/approval-agents-vsl.mp4">Watch the video here.</a>
      </video>

      {started && !failed && (
        <button className={styles.soundButton} onClick={toggleSound} aria-label={soundOff ? "Turn video sound on" : "Mute video"}>
          {soundOff ? <VolumeX size={18} aria-hidden="true" /> : <Volume2 size={18} aria-hidden="true" />}
          {soundOff ? "Turn sound on" : "Mute"}
        </button>
      )}

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
