import React, { useEffect, useRef, useState } from "react";
import { sendOffer, sendAnswer, sendICECandidate } from "./Signaling";

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peerConnection, setPeerConnection] = useState(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    setPeerConnection(pc);

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendICECandidate(event.candidate);
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    window.addEventListener("offer", async (e) => {
      await pc.setRemoteDescription(new RTCSessionDescription(e.detail));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      sendAnswer(answer);
    });

    window.addEventListener("answer", async (e) => {
      await pc.setRemoteDescription(new RTCSessionDescription(e.detail));
    });

    window.addEventListener("ice-candidate", (e) => {
      pc.addIceCandidate(new RTCIceCandidate(e.detail));
    });

    return () => {
      pc.close();
    };
  }, []);

  const startCall = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendOffer(offer);
  };

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline muted />
      <video ref={remoteVideoRef} autoPlay playsInline />
      <button onClick={startCall}>Start Call</button>
    </div>
  );
};

export default VideoCall;
