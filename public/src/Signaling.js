import io from "socket.io-client";

const socket = io("http://localhost:5000");

export const sendOffer = (offer) => socket.emit("offer", offer);
export const sendAnswer = (answer) => socket.emit("answer", answer);
export const sendICECandidate = (candidate) => socket.emit("ice-candidate", candidate);

socket.on("offer", (offer) => window.dispatchEvent(new CustomEvent("offer", { detail: offer })));
socket.on("answer", (answer) => window.dispatchEvent(new CustomEvent("answer", { detail: answer })));
socket.on("ice-candidate", (candidate) => window.dispatchEvent(new CustomEvent("ice-candidate", { detail: candidate })));

export default socket;
