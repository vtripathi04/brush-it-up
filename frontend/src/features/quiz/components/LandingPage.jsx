import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { QuizInput } from "./QuizInput";

export function LandingPage() {

  const [ playMode, setPlayMode ] = useState(0);

  const handleSolo = () => {
    localStorage.setItem( "playMode", 0 );
  }

  const handleRoom = () => {
    localStorage.setItem( "playMode", 1 );
  }


  return (

    < Box 
      sx= {{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '10px'
      }} >

      <Link to='/quizInput' >
        <Button sx = {{ background: 'white', color: 'black' }} onClick = {handleSolo} >
          Solo
        </Button>
      </Link>
      

      <Link to = '/' >
        <Button sx = {{ background: 'white', color: 'black' }} onClick = {handleRoom} >
          Create Room
        </Button>
      </Link>

    </Box>

  );

}


