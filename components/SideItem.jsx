import React, { Fragment, useState, useTransition, useEffect } from 'react'
import { Stack, Typography, Autocomplete, TextField, Button} from '@mui/material'
import FlipCameraIosOutlinedIcon from '@mui/icons-material/FlipCameraIosOutlined';
import { useTheme } from '@emotion/react';
import MuiPopup from './custom/MuiPopup';
import CloseIcon from "@mui/icons-material/Close";
import axios from 'axios';

const SideItem = ({itemData, categoryData, update}) => {

const [isPopupOpen, setPopupOpen] = useState(false);
const [isTransitionStarted, startTransition] = useTransition();
const [itemToCategory, setItemToCategory] = useState({ tripId: null, bagId: null, categoryId: null});

const theme = useTheme()

const categoryOptions = categoryData.map((x) => ({ name: x.name, _id: x._id, key: x._id })) 
const isOptionEqualToValue = (option, value) => option._id === value?._id;

useEffect(() => {
    const tripId = localStorage.getItem('tripId');
    const bagId = localStorage.getItem('bagId');
    if (tripId && bagId) {
      setItemToCategory((prevData) => ({
        ...prevData,
        tripId: tripId,
        bagId: bagId
      }));
    }
  }, []);



const openPopup = () => {
  setPopupOpen(true)
}

const closePopup = () => {
    setPopupOpen(false);
};

const addItemToCategory = async (e) => {
    e.preventDefault()

    const itemObj = {tripId: itemToCategory.tripId, bagId: itemToCategory.bagId, categoryId: itemToCategory.categoryId, 
      name: itemData.name, description: itemData.description, link: itemData.link, priority: itemData.priority, qty: itemData.qty, weight: itemData.weight, wgtOpt: itemData.wgtOpt, worn: itemData.worn}

    try {
        await axios.post('/items/new', itemObj);
        setPopupOpen(false)
        update()
      }
       catch (error) {
            console.log(error)
       }
    }

  return (
    <Fragment>
    <Stack pl={1} pr={1} mb={1} pt={0.5} display="flex" flexDirection="row" alignItems='center'>
    <Stack onClick={openPopup}  p={0.7} mr={1} backgroundColor="white" width="20px" borderRadius="5px" sx={{cursor: "pointer", transition: "transform 0.2s ease-in-out", '&:hover': {transform: "scale(1.1)"}}}>
     <FlipCameraIosOutlinedIcon sx={{color: theme.green, fontSize: "20px"}} />
   </Stack>
   <Typography onClick={() => console.log(itemToCategory)} component="span" variant="span" fontSize="15px" color={theme.main.lightGray}>{itemData.name.length > 10 ? itemData.name.substring(0, 10) + "..." : itemData.name}</Typography>
   </Stack>

 <MuiPopup isOpen={isPopupOpen} onClose={closePopup} >
  <form onSubmit={addItemToCategory}>
        <Stack p={2} spacing={2}>
          <Stack flex={1} direction="row" justifyContent="space-between">
            <Typography component="h2" variant="h4">Add Item to category</Typography>
            <CloseIcon onClick={closePopup} />
          </Stack>
          <Typography component="p" variant="p"> Choose where to add <Typography component="span" variant="span" color={theme.green}>{itemData.name}</Typography></Typography>
             <Autocomplete
              renderInput={(params) => <TextField required {...params} label="Categories" />}
              onChange={(event, newValue) => setItemToCategory((prevData) => ({ ...prevData, categoryId: newValue ? newValue._id : '' }))}
              options={categoryOptions}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={isOptionEqualToValue}
              getOptionKey={(option) => option.key}
              sx={{marginBottom: "20px"}}/>


             <Button type="submit"  sx={{padding: "13px", marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.green}} variant="contained" disableElevation>Add</Button>
              
        </Stack>
      </form>
  </MuiPopup>



   </Fragment>
  )
}

export default SideItem