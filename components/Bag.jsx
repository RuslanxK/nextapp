"use client"

import React, { useState, useTransition} from 'react'
import { Stack, Typography, IconButton, Autocomplete, Button, TextField} from '@mui/material'
import Image from 'next/image'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useRouter } from 'next/navigation';
import { useTheme } from '@emotion/react';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';
import MuiPopup from './custom/MuiPopup';

const Bag = ({bagData, trips}) => {

  const router = useRouter()
  const theme = useTheme()

  const [tripHover, setTripHover] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [isTransitionStarted, startTransition] = useTransition();
  const [duplicatedBag, setDuplicatedBag] = useState({tripId: null, id: bagData._id, name: bagData.name, goal: bagData.goal, description: bagData.description});

  const NavigateToInnerBag = () => {
    router.push(`/bag?id=${bagData._id}`)
  }

  const openPopup = () => {
     setIsPopupOpen(true)
  }

  const closePopup = () => {

     setIsPopupOpen(false)
  }


  const duplicateBag =  async (e) => {
      e.preventDefault()

       try {
        await axios.post(`/bags/duplicate`, duplicatedBag);
        setIsPopupOpen(false)
        startTransition(router.refresh);
       } catch (err) {
         console.log(err);
       }
     
  }

  const tripOptions = trips.map((x) => ({ name: x.name, _id: x._id }));
  const isOptionEqualToValue = (option, value) => option._id === value?._id;


  return (
    <Stack onMouseOver={() => setTripHover(true)} onMouseLeave={() => setTripHover(false)} borderRadius={theme.radius} height={theme.bags.height} boxShadow={theme.boxShadow} sx={{cursor: "pointer", transition: theme.transition, '&:hover': {boxShadow: theme.boxShadowHover}}} 
    display={theme.flexBox} justifyContent={theme.between} alignItems={theme.center}>

    <IconButton onClick={openPopup} sx={{marginLeft: "auto", marginTop: "4px", marginRight: "4px"}}><ContentCopyIcon sx={{fontSize: "14px"}}/></IconButton>
    <Image src="/backpack.png" width={60} height={60} alt='bag' priority style={{marginBottom: "10px"}} onClick={NavigateToInnerBag}/>
      <Typography height="25px" pl={3} pb={1.5} width={theme.fullWidth} component="span" variant='span' fontSize="14px" display={theme.flexBox} alignItems={theme.center} 
      onClick={NavigateToInnerBag}>{bagData.name.length > 16 ? `${bagData.name.substring(0, 16)}..` : bagData.name}  { tripHover ? <IconButton onClick={NavigateToInnerBag} size='small' sx={{marginLeft: "5px"}}><NearMeOutlinedIcon  sx={{fontSize: "17px"}}  /></IconButton> : null }</Typography>

    { isPopupOpen ? <MuiPopup isOpen={isPopupOpen} onClose={closePopup} >
            <form onSubmit={duplicateBag}>
            <Stack p={2} spacing={2}>
            <Stack flex={1} direction="row" justifyContent="space-between">
            <Typography component="h2" variant="span" fontWeight="600">
              Choose trip
            </Typography>
            <CloseIcon onClick={closePopup} />
            </Stack>
            <Typography component="p" variant="p"> Choose in which trip to duplicate <Typography component="span" variant="span" color={theme.green}>{bagData.name}</Typography></Typography>

            <Autocomplete
              renderInput={(params) => <TextField required {...params} label="Trips" />}
              onChange={(event, newValue) => setDuplicatedBag((prevData) => ({ ...prevData, tripId: newValue ? newValue._id : '' }))}
              options={tripOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={isOptionEqualToValue}
              sx={{marginBottom: "20px"}}/>
              
            <Button type='submit' sx={{padding: "13px", marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.green}} variant="contained" disableElevation>Duplicate</Button>
    
        </Stack>
       </form>
      </MuiPopup> : null }


    </Stack>
  )
}

export default React.memo(Bag)