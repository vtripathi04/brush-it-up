import React, { useState } from 'react';
import axios from 'axios';
// NEW: Imported Paper, IconButton, and a few icons
import { Box, Button, Typography, Tabs, Tab, TextField, Stack, Paper, IconButton, typographyClasses } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { QuizPage } from './QuizPage';

// A helper component to manage the content of each tab
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// renamed the component to follow standard naming conventions (PascalCase)
export function QuizInput() {

  const navigate = useNavigate();

  const [ selectedTab, setSelectedTab ] = useState(0);
  // state to hold the selected file object
  const [ selectedFile, setSelectedFile ] = useState(null);
  const [ videoLink, setVideoLink ] = useState("");
  const [ quizText, setQuizText ] = useState("");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // handler to update state when a file is chosen
  const handleFileChange = (event) => {
    // Check if the user has selected a file
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // handler to update youtube video link
  const handleLinkChange = (event) => {
    setVideoLink(event.target.value);
  }

  // handler to remove the selected file
  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  // function to 
  const getQuizText = async () => {

    let endpoint = "";

    console.log( selectedTab );
    

    if( selectedTab === 0 ) {
        endpoint = "http://localhost:5000/api/parse/upload-pdf"
        
        try{
          const { data } = await axios.post( endpoint , {
              file: selectedFile
            }, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          // debugging
          // console.log(typeof data);
          // console.log('Available keys are:', Object.keys(data));
          // console.log('Snapshot of data object:', JSON.stringify(data, null, 2));
          // console.log('Success:', data.data.text );

          setQuizText( data.data.text );
          navigate('/quizPage', { state: { quizText: data.data.text } });

        }catch( error ) {
          console.error('Error:', error);
        }

    } else{
        endpoint = "http://localhost:5000/api/youtube/fetch-transcript"

        try{

          const { data } = await axios.post( endpoint, {
              url: videoLink
            }
          );

          // debugging
          // console.log( data.data.text );

          setQuizText( data.data.text )
          navigate('/quizPage', { state: { quizText: data.data.text } });

        }catch(error){
          console.error( 'Error:', error );
          
        }

    }

  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to right bottom, #2c3e50, #4ca1af)',
      }}
    >
      <Box
        sx={{
          minHeight: '50vh',
          width: '60vh',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 4,
          padding: 4,
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="quiz source tabs" centered>
            <Tab label="PDF" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Video" id="tab-1" aria-controls="tabpanel-1" />
          </Tabs>
        </Box>

        {/* Content for the PDF Tab */}
        <TabPanel value={selectedTab} index={0}>
          <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', minHeight: '20vh', justifyContent: 'center' }}>

            {/* NEW: Conditional rendering based on whether a file is selected */}
            {!selectedFile ? (
              // If NO file is selected, show the upload prompt
              <>
                <Typography variant="h6">
                  Quiz from PDF
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Select a PDF file from your computer for quiz generation.
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Select PDF File
                  {/* The hidden input now triggers our handler */}
                  <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
                </Button>
              </>
            ) : (
              // If a file IS selected, show its name and a remove button
              <>
                <Typography variant="h6">
                  File Selected
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    backgroundColor: 'rgba(0,0,0,0.1)' // semi-transparent background
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                    <PictureAsPdfIcon sx={{ mr: 1, color: 'error.light' }} />
                    <Typography noWrap sx={{ fontWeight: 'medium' }}>
                      {selectedFile.name}
                    </Typography>
                  </Box>
                  <IconButton onClick={handleRemoveFile} size="small" sx={{ ml: 1 }}>
                    <CloseIcon />
                  </IconButton>
                </Paper>
              </>
            )}
          </Stack>
        </TabPanel>

        {/* Content for the Video Tab */}
        <TabPanel value={selectedTab} index={1}>
          <Stack spacing={3} alignItems="center" sx={{ textAlign: 'center', minHeight: '20vh', justifyContent: 'center' }}>
            <Typography variant="h6">
              Quiz from YouTube Video
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Enter a public link to a YouTube video.
            </Typography>
            <TextField
              fullWidth
              label="YouTube Video Link"
              variant="outlined"
              placeholder="https://www.youtube.com/watch?v=..."
              onChange={handleLinkChange}
            />
          </Stack>
        </TabPanel>
          
        <Box sx={{ flexGrow: 1 } }/>
          
        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 4,
            py: 1.5,
            fontWeight: 'bold',
          }}
          onClick={getQuizText}
        >
          Generate Quiz
        </Button>

      </Box>
    </Box>
  );
}