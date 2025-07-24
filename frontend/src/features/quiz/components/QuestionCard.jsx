import React, { useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
  Grid // Import the Grid component
} from '@mui/material';

/**
 * A visually enhanced card to display a single quiz question.
 * Renders MCQ options in a 2x2 grid or a text field for short answers.
 *
 * @param {object} props
 * @param {number} props.questionNumber
 * @param {string} props.questionText
 * @param {'mcq' | 'short_answer'} props.questionType
 * @param {string[]} [props.options=[]]
 */
export function QuestionCard({ questionNumber, questionText, questionType, options = [] }) {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelectionChange = (event) => {
    setSelectedValue(event.target.value);
  };

  return (
    // Use a flatter, outlined Paper variant for a modern look
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 }, // Responsive padding
        mb: 4,
        borderRadius: 3,
        // Adding a subtle border and shadow that complements the theme
        borderColor: 'divider',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      {/* Question Header */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
        {/* Styled Question Number */}
        <Box
          sx={{
            mr: 2,
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
          }}
        >
          <Typography variant="h6" component="span">{questionNumber}</Typography>
        </Box>
        {/* Question Text */}
        <Typography variant="h6" component="div" sx={{ pt: 0.5 }}>
          {questionText}
        </Typography>
      </Box>

      {/* Answer Area */}
      <Box sx={{ pl: { xs: 0, sm: '56px' } }}> {/* Indent to align with question text */}
        {questionType === 'mcq' && (
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              aria-label={`question-${questionNumber}`}
              name={`question-${questionNumber}`}
              value={selectedValue}
              onChange={handleSelectionChange}
            >
              {/* Use Grid container for the 2x2 layout */}
              <Grid container spacing={2}>
                {options.map((option, index) => (
                  // Each option takes up 6 of 12 columns on small screens and up
                  <Grid item xs={12} sm={6} key={index}>
                    {/* Wrap each option in a styled Paper for a clear clickable area */}
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s, background-color 0.3s',
                        // Highlight the selected option
                        borderColor: selectedValue === option ? 'primary.main' : 'divider',
                        borderWidth: selectedValue === option ? 2 : 1,
                        backgroundColor: selectedValue === option ? 'action.hover' : 'transparent',
                        '&:hover': {
                           borderColor: 'primary.light',
                           backgroundColor: 'action.hover'
                        }
                      }}
                    >
                      <FormControlLabel
                        value={option}
                        control={<Radio sx={{ p: 0.5, mr: 1 }} />}
                        label={<Typography variant="body1">{option}</Typography>}
                        sx={{ width: '100%', m: 0 }} // Ensure the label fills the Paper
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>
        )}

        {questionType === 'short_answer' && (
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Your Answer"
            value={selectedValue}
            onChange={handleSelectionChange}
          />
        )}
      </Box>
    </Paper>
  );
}