// File: backend/utils/youtubeHelpers.js

export const extractVideoId = (url) => {
    // This regex covers multiple YouTube URL formats:
    // - youtube.com/watch?v=VIDEO_ID
    // - youtu.be/VIDEO_ID
    // - youtube.com/embed/VIDEO_ID
    // - youtube.com/v/VIDEO_ID
    // It extracts the 11-character video ID.
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/;
    
    const match = url.match(regex);
    
    // If a match is found, return the first capturing group (the video ID), otherwise return null.
    return match ? match[1] : null;
  };