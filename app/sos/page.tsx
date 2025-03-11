"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Header } from "@/components/header";

export default function SOSPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [emergencyType, setEmergencyType] = useState<string>("medical");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
          setLoading(false);
        },
        () => {
          setError("Unable to get your location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
    }

    // Start recording audio
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        recorder.onstop = () => {
          const audioBlob = new Blob(chunks, { type: "audio/wav" });
          setAudioChunks([...audioChunks, audioBlob]);
        };

        recorder.start();
        setTimeout(() => {
          recorder.stop();
          stream.getTracks().forEach((track) => track.stop());
        }, 60000);
      } catch (err) {
        setError("Unable to access microphone. Please ensure microphone permissions are enabled.");
      }
    };

    startRecording();
  }, []);

  const handleSubmit = async () => {
    if (!location) {
      alert("Location not available!");
      return;
    }

    const formData = new FormData();
    formData.append("type", emergencyType);
    formData.append("lat", location.lat.toString());
    formData.append("lng", location.lng.toString());

    if (audioChunks.length > 0) {
      formData.append("audio", audioChunks[0], "emergency_audio.wav");
    }

    const response = await fetch("/api/incidents", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("Emergency reported successfully!");
    } else {
      alert("Error reporting emergency.");
    }
  };

  if (loading) {
    return (
      <div className="container max-w-md mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Getting your location...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header />
    <div className="container max-w-md mx-auto px-4 py-8">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive text-center text-2xl">SOS Emergency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {location && (
            <div className="text-sm text-muted-foreground">
              <p>Location detected:</p>
              <p>Latitude: {location.lat.toFixed(6)}</p>
              <p>Longitude: {location.lng.toFixed(6)}</p>
            </div>
          )}

          <Select value={emergencyType} onValueChange={setEmergencyType}>
            <SelectTrigger>
              <SelectValue placeholder="Select emergency type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medical">Medical Emergency</SelectItem>
              <SelectItem value="fire">Fire</SelectItem>
              <SelectItem value="security">Security Threat</SelectItem>
              <SelectItem value="accident">Accident</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={handleSubmit} className="w-full bg-destructive hover:bg-destructive/90" size="lg">
            Send SOS
          </Button>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
