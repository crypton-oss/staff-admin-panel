import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response("Method not allowed", { status: 405 })
    }

    // Parse the form data
    const formData = await req.formData()
    const file = formData.get("file") as File

    if (!file) {
      return new Response("No file provided", { status: 400 })
    }

    // Get ImageKit credentials from environment variables
    const imageKitPublicKey = Deno.env.get("IMAGEKIT_PUBLIC_KEY")
    const imageKitPrivateKey = Deno.env.get("IMAGEKIT_PRIVATE_KEY")
    const imageKitUrlEndpoint = Deno.env.get("IMAGEKIT_URL_ENDPOINT")

    if (!imageKitPublicKey || !imageKitPrivateKey || !imageKitUrlEndpoint) {
      return new Response("ImageKit credentials not configured", { status: 500 })
    }

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Prepare ImageKit upload request
    const uploadData = {
      file: base64,
      fileName: `${Date.now()}_${file.name}`,
      folder: "sihhat_avatars",
      useUniqueFileName: true,
    }

    // Generate authentication signature
    const timestamp = Math.floor(Date.now() / 1000)
    const authParams = {
      timestamp,
      ...uploadData,
    }
    
    const authString = Object.keys(authParams)
      .sort()
      .map((key) => `${key}=${authParams[key as keyof typeof authParams]}`)
      .join("&")
    
    const signature = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(authString + imageKitPrivateKey)
    )
    const signatureHex = Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")

    // Upload to ImageKit
    const imageKitResponse = await fetch(`${imageKitUrlEndpoint}/v1/files/upload`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(imageKitPublicKey + ":" + signatureHex)}`,
      },
      body: JSON.stringify({
        ...uploadData,
        signature: signatureHex,
        timestamp,
      }),
    })

    if (!imageKitResponse.ok) {
      const errorText = await imageKitResponse.text()
      return new Response(`ImageKit upload failed: ${errorText}`, { status: 500 })
    }

    const imageData = await imageKitResponse.json()

    // Return the image URL
    return new Response(
      JSON.stringify({ url: imageData.url }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    console.error("Upload error:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
})
