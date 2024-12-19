import CallButton from "@/components/CallButton";
import HangUpButton from "@/components/HangUpButton";
import RemoteAudio from "@/components/RemoteAudio";
import { useState, useRef, useEffect } from "react";
import Peer, { SignalData } from "simple-peer";
import { io } from "socket.io-client";

const socket = io("https://call-server-eight.vercel.app");

const Audio: React.FC = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);  // রিমোট অডিও স্ট্রিম
    const [peer, setPeer] = useState<Peer.Instance | null>(null);
    const [connected, setConnected] = useState<boolean>(false);
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
    console.log(stream)

    useEffect(() => {
        socket.on("signal", (data: { signal: SignalData; from: string }) => {
            if (peer) {
                peer.signal(data.signal);
            }
        });


        return () => {
            socket.off("signal");
        };
    }, [peer]);

    const startCall = async () => {
        try {
            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(localStream);

            const newPeer = new Peer({ initiator: true, trickle: false, stream: localStream });

            newPeer.on("signal", (signal: SignalData) => {
                socket.emit("signal", { to: "remote", signal });
            });

            newPeer.on("stream", (remoteStream: MediaStream) => {
                setRemoteStream(remoteStream);
                if (remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = remoteStream;
                }
            });

            setPeer(newPeer);
            setConnected(true);
        } catch (error) {
            console.error("Error starting call:", error);
        }
    };

    const endCall = () => {
        if (peer) {
            peer.destroy();
        }
        setPeer(null);
        setStream(null);
        setRemoteStream(null);
        setConnected(false);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-semibold mb-4">Audio Call App with Simple-Peer</h1>
            {!connected ? (
                <CallButton onClick={startCall} />
            ) : (
                <HangUpButton onClick={endCall} />
            )}
            {remoteStream && <RemoteAudio audioRef={remoteAudioRef} />}
        </div>
    );
};

export default Audio;
