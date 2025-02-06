"use client";
import { useState, useEffect } from "react";

// Define the type for each link
interface Link {
  id: number;
  url: string;
  shortUrl?: string; // This is optional because it's set after generating a short URL
  clicks: number;
}

export default function Home() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [customUrl, setCustomUrl] = useState<string>(""); // State for the custom URL
  const [error, setError] = useState<string>(""); // State for handling errors (optional)

  // Function to create a short URL (simulated)
  const shortenURL = (url: string): string => {
    // Create a hash by using the URL and adding a random component for uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 8); // Random string of length 6
    const hash = btoa(url).slice(0, 6) + randomSuffix; // Use base64 + random suffix
    return `https://short.ly/${hash}`;
  };

  useEffect(() => {
    const initialLinks: Link[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      url: `https://www.instagram.com/reel/DFiJMOnTX2A/?igsh=dmFhMXJ3bWkzZ2Vh${i + 1}`,
      clicks: 0,
    }));

    // Simulate shortening URLs on component mount
    const shortenedLinks = initialLinks.map((link) => ({
      ...link,
      shortUrl: shortenURL(link.url), // Use the updated short URL function
    }));

    setLinks(shortenedLinks);
    setLoading(false); // Set loading to false after URLs are processed
  }, []);

  const handleLinkClick = (id: number) => {
    setLinks((prevLinks) =>
      prevLinks.map((link) =>
        link.id === id ? { ...link, clicks: link.clicks + 1 } : link
      )
    );
  };

  const handleCustomUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customUrl) {
      setError("Please enter a valid URL.");
      return;
    }

    const newLink: Link = {
      id: links.length + 1,
      url: customUrl,
      shortUrl: shortenURL(customUrl),
      clicks: 0,
    };

    setLinks([...links, newLink]);
    setCustomUrl(""); // Reset the input field
    setError(""); // Reset error state
  };

  if (loading) {
    return <div>Loading links...</div>; // Show a loading message while URLs are being processed
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dummy Instagram Reels Links</h1>
      <p className="mb-6">
        Click the shortened links below to track how many times each one is clicked:
      </p>

      {/* Custom URL input form */}
      <div className="mb-6">
        <form onSubmit={handleCustomUrlSubmit} className="flex space-x-4">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="Enter your custom URL"
            className="border p-2 w-1/2"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Shorten URL
          </button>
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>} {/* Display error */}
      </div>

      {/* Display links */}
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.id} className="flex justify-between items-center">
            <a
              href={link.url} // Keep the original URL for redirection
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleLinkClick(link.id)}
              className="text-blue-600 hover:underline"
            >
              {link.shortUrl}
            </a>
            <span className="ml-4 text-gray-600">{link.clicks} clicks</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
