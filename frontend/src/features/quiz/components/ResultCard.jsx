import React from 'react';
import { Paper, Typography, Box, Chip, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

/**
 * A card to display the result of a single quiz question.
 *
 * @param {object} props
 * @param {number} props.questionNumber
 * @param {string} props.questionText
 * @param {string} props.userAnswer
 * @param {string} props.correctAnswer
 * @param {string} props.explanation
 * @param {boolean} props.isCorrect
 */
export function ResultCard({ questionNumber, questionText, userAnswer, correctAnswer, explanation, isCorrect }) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        mb: 3,
        borderRadius: 3,
        borderColor: isCorrect ? 'success.main' : 'error.main',
        borderWidth: 2,
        backgroundColor: 'background.paper',
      }}
    >
      {/* Question Text */}
      <Typography variant="h6" component="div" sx={{ mb: 2, fontWeight: 'medium' }}>
        {`${questionNumber}. ${questionText}`}
      </Typography>

      {/* User's Answer Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <Typography variant="body1" component="span" sx={{ fontWeight: 'bold' }}>
          Your Answer:
        </Typography>
        <Typography variant="body1" component="span">
          {userAnswer || '"No Answer"'} {/* Handle unanswered questions */}
        </Typography>
        <Chip
          icon={isCorrect ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
          label={isCorrect ? "Correct" : "Incorrect"}
          color={isCorrect ? "success" : "error"}
          size="small"
          sx={{ ml: 'auto' }} // Pushes the chip to the right
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Correct Answer & Explanation Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'success.dark' }}>
              Correct Answer:
            </Typography>
            <Typography variant="body1" sx={{ color: 'success.dark' }}>
              {correctAnswer}
            </Typography>
        </Box>
        <Accordion sx={{ boxShadow: 'none', '&:before': { display: 'none' }, backgroundColor: 'transparent' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="body2" color="text.secondary">Show Explanation</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    {explanation}
                </Typography>
            </AccordionDetails>
        </Accordion>
      </Box>
    </Paper>
  );
}