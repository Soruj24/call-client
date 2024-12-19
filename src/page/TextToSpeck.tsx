import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Shadcn/ui button component
import { Textarea } from "@/components/ui/textarea"; // Shadcn/ui textarea component
import { Slider } from "@/components/ui/slider"; // For controlling speed & pitch
import { Select, SelectTrigger, SelectItem, SelectContent } from "@/components/ui/select";

const TextToSpeech: React.FC = () => {
    const [text, setText] = useState<string>(""); // Input text
    const [language, setLanguage] = useState<string>("bn-BD"); // Default language: Bengali
    const [speed, setSpeed] = useState<number>(1); // Speed rate (default: 1)
    const [pitch, setPitch] = useState<number>(1); // Pitch rate (default: 1)
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false); // Speaking status

    const speakText = () => {
        if (!text.trim()) {
            alert("দয়া করে কিছু টেক্সট লিখুন!");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = speed; // Control speed
        utterance.pitch = pitch; // Control pitch

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">টেক্সট থেকে ভয়েসে রূপান্তর</h1>

            {/* Language Selection */}
            <div className="space-y-2">
                <label className="text-sm font-medium">ভাষা নির্বাচন করুন:</label>
                <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger className="w-full max-w-md">
                        <span>{language}</span>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="bn-BD">বাংলা (Bengali)</SelectItem>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="hi-IN">हिन्दी (Hindi)</SelectItem>
                        <SelectItem value="es-ES">Español (Spanish)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Text Input */}
            <Textarea
                className="w-full max-w-md"
                rows={6}
                placeholder="আপনার টেক্সট এখানে লিখুন..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />

            {/* Speed and Pitch Controls */}
            <div className="space-y-2">
                <label className="text-sm font-medium">ভয়েসের স্পিড:</label>
                <Slider
                    value={[speed]}
                    onValueChange={(val) => setSpeed(val[0])}
                    min={0.5}
                    max={2}
                    step={0.1}
                />
                <label className="text-sm font-medium">ভয়েসের পিচ:</label>
                <Slider
                    value={[pitch]}
                    onValueChange={(val) => setPitch(val[0])}
                    min={0.5}
                    max={2}
                    step={0.1}
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button onClick={speakText} disabled={isSpeaking} variant="success">
                    {isSpeaking ? "বলছে..." : "টেক্সট বলুন"}
                </Button>
                <Button onClick={stopSpeaking} disabled={!isSpeaking} variant="destructive">
                    থামান
                </Button>
            </div>
        </div>
    );
};

export default TextToSpeech;
