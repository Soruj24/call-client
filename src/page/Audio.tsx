// প্রথমে প্রয়োজনীয় কম্পোনেন্ট গুলো ইম্পোর্ট করা হচ্ছে
import CallButton from "@/components/CallButton";  // কল বাটন কম্পোনেন্ট
import HangUpButton from "@/components/HangUpButton";  // হ্যাং আপ বাটন কম্পোনেন্ট
import RemoteAudio from "@/components/RemoteAudio";  // রিমোট অডিও প্লে করার জন্য কম্পোনেন্ট
import { useState, useRef, useEffect } from "react";  // React hooks গুলি ইম্পোর্ট করা হচ্ছে
import Peer, { SignalData } from "simple-peer";  // simple-peer লাইব্রেরি ইম্পোর্ট, এটি ওয়েব RTC জন্য ব্যবহৃত হয়
import { io } from "socket.io-client";  // সকার্ট.io ক্লায়েন্ট লাইব্রেরি ইম্পোর্ট করা হচ্ছে

// সার্ভার থেকে সঙ্কেত নেওয়ার জন্য socket.io ক্লায়েন্ট সেটআপ করা হচ্ছে
const socket = io("http://localhost:3000/api/call");  // socket.io সার্ভার সাথে কানেক্ট হচ্ছে

// React Functional Component শুরু
const Audio: React.FC = () => {
    // useState hooks ব্যবহার করে স্টেট তৈরি করা হচ্ছে
    const [stream, setStream] = useState<MediaStream | null>(null);  // লোকাল অডিও স্ট্রিম
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);  // রিমোট অডিও স্ট্রিম
    const [peer, setPeer] = useState<Peer.Instance | null>(null);  // পিয়ার ইনস্ট্যান্স
    const [connected, setConnected] = useState<boolean>(false);  // কানেকশন স্ট্যাটাস
    const remoteAudioRef = useRef<HTMLAudioElement | null>(null);  // রেফারেন্স তৈরি হচ্ছে রিমোট অডিও কম্পোনেন্টের জন্য

    // useEffect hook ব্যবহার করা হয়েছে সকার্ট.io সিগনাল সার্ভার থেকে গ্রহণ করার জন্য
    useEffect(() => {
        // socket.on এর মাধ্যমে 'signal' ইভেন্টের জন্য একটি লিসেনার তৈরি করা হচ্ছে
        socket.on("signal", (data: { signal: SignalData; from: string }) => {
            // যদি পিয়ার থাকে, তাহলে পিয়ার সিগন্যাল প্রক্রিয়া করবে
            if (peer) {
                peer.signal(data.signal);  // সিগন্যাল গ্রহণ ও প্রক্রিয়া করা হচ্ছে
            }
        });
        

        // Clean up করার জন্য socket.off ব্যবহার হচ্ছে
        return () => {
            socket.off("signal");  // এভেন্ট শোনার বন্ধ করা হচ্ছে, যেন memory leak না হয়
        };
    }, [peer]);  // এফেক্টটি peer পরিবর্তন হলে পুনরায় কার্যকর হবে

    // কল শুরু করার ফাংশন
    const startCall = async () => {
        try {
            // লোকাল অডিও স্ট্রিম নেওয়া হচ্ছে
            const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setStream(localStream);  // লোকাল স্ট্রিম স্টেটে সেট করা হচ্ছে

            // simple-peer এর মাধ্যমে পিয়ার তৈরি করা হচ্ছে
            const newPeer = new Peer({ initiator: true, trickle: false, stream: localStream });

            // সিগন্যাল পাঠানোর জন্য 'signal' ইভেন্ট লিসেনার
            newPeer.on("signal", (signal: SignalData) => {
                socket.emit("signal", { to: "remote", signal });  // সিগন্যাল রিমোটকে পাঠানো হচ্ছে
            });

            // রিমোট স্ট্রিম গ্রহণ করার জন্য 'stream' ইভেন্ট লিসেনার
            newPeer.on("stream", (remoteStream: MediaStream) => {
                setRemoteStream(remoteStream);  // রিমোট স্ট্রিম স্টেটে সেট করা হচ্ছে
                if (remoteAudioRef.current) {
                    remoteAudioRef.current.srcObject = remoteStream;  // রিমোট অডিও প্লেয়ার তৈরি
                }
            });

            setPeer(newPeer);  // নতুন পিয়ার ইনস্ট্যান্স স্টেটে সেট করা হচ্ছে
            setConnected(true);  // কানেকশন সফল হয়েছে, স্টেট পরিবর্তন হচ্ছে
        } catch (error) {
            console.error("Error starting call:", error);  // কল শুরু করার সময় কোনো সমস্যা হলে ত্রুটি মেসেজ
        }
    };

    // কল শেষ করার ফাংশন
    const endCall = () => {
        if (peer) {
            peer.destroy();  // পিয়ার ইনস্ট্যান্স ধ্বংস করা হচ্ছে, যাতে কল বন্ধ হয়
        }
        setPeer(null);  // পিয়ার স্টেট আবার null করা হচ্ছে
        setStream(null);  // লোকাল স্ট্রিম পরিষ্কার করা হচ্ছে
        setRemoteStream(null);  // রিমোট স্ট্রিম পরিষ্কার করা হচ্ছে
        setConnected(false);  // কানেকশন স্টেট false করা হচ্ছে
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">  {/* Tailwind CSS ব্যবহার করা হয়েছে */}
            <h1 className="text-2xl font-semibold mb-4">Audio Call App with Simple-Peer</h1>
            {/* যদি কানেকশন না থাকে, কল বাটন দেখাও, অন্যথা হ্যাং আপ বাটন দেখাও */}
            {!connected ? (
                <CallButton onClick={startCall} />
            ) : (
                <HangUpButton onClick={endCall} />
            )}
            {/* যদি রিমোট স্ট্রিম থাকে, তাহলে রিমোট অডিও প্লে করো */}
            {remoteStream && <RemoteAudio audioRef={remoteAudioRef} />}  {/* রিমোট অডিও প্লেয়ার */}
        </div>
    );
};

// কম্পোনেন্ট এক্সপোর্ট করা হচ্ছে
export default Audio;
