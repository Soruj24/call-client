import React from "react";

interface RemoteAudioProps {
    audioRef: React.RefObject<HTMLAudioElement>;
}

const RemoteAudio: React.FC<RemoteAudioProps> = ({ audioRef }) => (
    <audio ref={audioRef} autoPlay className="mt-4" />
);

export default RemoteAudio;
