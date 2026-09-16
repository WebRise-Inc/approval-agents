"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import styles from "./book.module.css";

export default function VslPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const restartWithSound = useRef(false);
  const soundChosen = useRef(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const soundOff = muted || volume === 0;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let cancelled = false;

    async function autoplay(video: HTMLVideoElement) {
      try {
        await video.play();
        if (!cancelled) setStarted(true);
      } catch (error) {
        if (cancelled || soundChosen.current) return;
        // Prefer audio. Only mute if the browser denies audible autoplay.
        if (error instanceof Error && error.name === "NotAllowedError") {
          video.muted = true;
          restartWithSound.current = true;
          setMuted(true);
          try {
            await video.play();
            if (!cancelled) setStarted(true);
          } catch {
            if (!cancelled && video.error) setFailed(true);
          }
        } else if (video.error) {
          setFailed(true);
        }
      }
    }

    void autoplay(video);
    return () => { cancelled = true; };
  }, []);

  async function playVideo() {
    const video = videoRef.current;
    if (!video) return;
    soundChosen.current = true;
    if (restartWithSound.current) {
      restartWithSound.current = false;
      video.currentTime = 0;
    }
    video.muted = false;
    if (video.volume === 0) video.volume = 1;
    setMuted(false);
    try {
      await video.play();
      setStarted(true);
    } catch {
      // Keep the native controls available if a browser blocks playback.
      if (video.error) setFailed(true);
    }
  }

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    soundChosen.current = true;
    if ((video.muted || video.volume === 0) && restartWithSound.current) {
      restartWithSound.current = false;
      video.currentTime = 0;
    }
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
        onPlaying={() => setStarted(true)}
        onVolumeChange={(event) => {
          const video = event.currentTarget;
          if (!video.muted && video.volume > 0 && restartWithSound.current) {
            soundChosen.current = true;
            restartWithSound.current = false;
            video.currentTime = 0;
          }
          setMuted(video.muted);
          setVolume(video.volume);
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
