"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useForm } from "react-hook-form"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"
import { MapPin, Upload, AlertTriangle, Camera, Video } from "lucide-react"
import { Header } from "@/components/header"

const mapContainerStyle = {
  width: "100%",
  height: "400px",
}

const center = {
  lat: 0,
  lng: 0,
}

export default function ReportPage() {
  const [location, setLocation] = useState(center)
  const [address, setAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLocationDetecting, setIsLocationDetecting] = useState(false)
  const [selectedPhotos, setSelectedPhotos] = useState([])
  const [selectedVideos, setSelectedVideos] = useState([])
  const [google, setGoogle] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const form = useForm({
    defaultValues: {
      type: "",
      severity: "medium",
      description: "",
      contact: "",
    },
  })

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          setLocation(newLocation)

          if (google) {
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ location: newLocation }, (results, status) => {
              if (status === "OK" && results[0]) {
                setAddress(results[0].formatted_address)
              }
            })
          }

          setLoading(false)
        },
        (error) => {
          setError("Unable to get your location. Please enable location services.")
          setLoading(false)
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
      setLoading(false)
    }
  }, [google])

  const detectLocation = () => {
    setIsLocationDetecting(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const newLocation = {
            lat: latitude,
            lng: longitude,
          }
          setLocation(newLocation)
          
          if (google) {
            const geocoder = new google.maps.Geocoder()
            geocoder.geocode({ location: newLocation }, (results, status) => {
              if (status === "OK" && results[0]) {
                setAddress(results[0].formatted_address)
              }
            })
          }
          
          setIsLocationDetecting(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          setIsLocationDetecting(false)
          setError("Unable to detect location. Please try again or enter location manually.")
        }
      )
    } else {
      setError("Geolocation is not supported by this browser.")
      setIsLocationDetecting(false)
    }
  }

  const handlePhotoChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'];
      const validFiles = files.filter(file => allowedTypes.includes(file.type));
      
      if (validFiles.length !== files.length) {
        setError("Some files were not added because they aren't supported image formats.");
      }
      
      setSelectedPhotos(validFiles);
    }
  }
  
  const handleVideoChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
      const validFiles = files.filter(file => allowedTypes.includes(file.type));
      
      if (validFiles.length !== files.length) {
        setError("Some files were not added because they aren't supported video formats.");
      }
      
      setSelectedVideos(validFiles);
    }
  }

  const onMapClick = (e) => {
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    }
    setLocation(newLocation)

    if (google) {
      const geocoder = new google.maps.Geocoder()
      geocoder.geocode({ location: newLocation }, (results, status) => {
        if (status === "OK") {
          if (results[0]) {
            setAddress(results[0].formatted_address)
          }
        }
      })
    }
  }

  function onSubmit(values) {
    setIsSubmitting(true)
    
    if (location.lat === 0 && location.lng === 0) {
      alert("Location not detected. Please enable location services or select a valid location on the map.");
      setIsSubmitting(false);
      return;
    }

    const submitData = {
      ...values,
      location: {
        address,
        coordinates: location,
      },
      media: {
        photos: selectedPhotos,
        videos: selectedVideos
      }
    }
    
    console.log(submitData)
    
    // Simulate form submission
    setTimeout(() => {
      alert("Accident report submitted successfully!");
      setIsSubmitting(false);
      form.reset();
      setSelectedPhotos([]);
      setSelectedVideos([]);
    }, 1500);
  }

  return (
    <>
    <Header />
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Report an Accident</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
            Accident Details
          </CardTitle>
          <CardDescription>Please provide as much information as possible about the accident.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Accident Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select accident type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="traffic">Traffic Accident</SelectItem>
                        <SelectItem value="fire">Fire</SelectItem>
                        <SelectItem value="medical">Medical Emergency</SelectItem>
                        <SelectItem value="break">Break Down</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Location</FormLabel>
                {location && (
                  <div className="text-sm text-muted-foreground mb-2">
                    <p>Current location: {address || `${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`}</p>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what happened, how many people are involved, and any other relevant details" 
                        {...field} 
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Media Evidence (Optional)</FormLabel>
                <Tabs defaultValue="photos" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="photos" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      Photos
                    </TabsTrigger>
                    <TabsTrigger value="videos" className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Videos
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="photos">
                    <div className="border-2 border-dashed border-input rounded-md p-6 text-center">
                      <Camera className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Upload photos of the accident scene
                      </p>
                      <Input 
                        id="photos" 
                        type="file" 
                        accept="image/*" 
                        multiple 
                        className="hidden" 
                        onChange={handlePhotoChange}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => document.getElementById("photos")?.click()}
                      >
                        Choose Photos
                      </Button>
                      {selectedPhotos.length > 0 && (
                        <div className="mt-2 text-sm">
                          {selectedPhotos.length} photo(s) selected
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="videos">
                    <div className="border-2 border-dashed border-input rounded-md p-6 text-center">
                      <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Upload videos of the accident scene
                      </p>
                      <Input 
                        id="videos" 
                        type="file" 
                        accept="video/*" 
                        multiple 
                        className="hidden" 
                        onChange={handleVideoChange}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => document.getElementById("videos")?.click()}
                      >
                        Choose Videos
                      </Button>
                      {selectedVideos.length > 0 && (
                        <div className="mt-2 text-sm">
                          {selectedVideos.length} video(s) selected
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {error && (
                <div className="text-sm font-medium text-destructive">
                  {error}
                </div>
              )}

              <CardFooter className="flex justify-between px-0">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    form.reset();
                    setSelectedPhotos([]);
                    setSelectedVideos([]);
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Report"}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
    </>
  )
}