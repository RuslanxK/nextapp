"use client"

import {Stack, Typography, IconButton, Autocomplete, Button, Container} from '@mui/material';
import Trip from './Trip'
import axios from 'axios';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import AddLocationAltOutlinedIcon from '@mui/icons-material/AddLocationAltOutlined';
import { useTheme } from '@emotion/react';
import MonitorWeightOutlinedIcon from '@mui/icons-material/MonitorWeightOutlined';
import HorizontalSplitOutlinedIcon from '@mui/icons-material/HorizontalSplitOutlined';
import DataUsageOutlinedIcon from '@mui/icons-material/DataUsageOutlined';
import LatestBagStack from '../components/custom/LatestBackStack'
import CloseIcon from "@mui/icons-material/Close";
import MuiPopup from './custom/MuiPopup'
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { useState, useEffect} from 'react';
import Nav from './Nav';


const Trips = ({trips, bags, session}) => {

  const router = useRouter();

  const countriesApi = "https://restcountries.com/v3.1/all?fields=name,flags"

  const [isTransitionStarted, startTransition] = useTransition();
  const [countries, setCounties] = useState([])
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [newTripData, setNewTripData] = useState({startDate: dayjs(), endDate: dayjs() });

  const theme = useTheme()

  useEffect(() => {
     const getCountries = async () => {
          const { data } = await axios.get(countriesApi)
          setCounties(data)
     }
      getCountries()

  }, []);


    const tripData = trips.trips.sort((a, b) => {
      const aStartDate = new Date(a.startDate);  
      const bStartDate = new Date(b.startDate);
      const aEndDate = new Date(a.endDate);
      const bEndDate = new Date(b.endDate);
       if (aStartDate < bStartDate) return 1;
       if (aStartDate > bStartDate) return -1;
       if (aEndDate < bEndDate) return 1;
       if (aEndDate > bEndDate) return -1;
       return 0; 
     }).map((trip) => (<Trip key={trip._id} tripData={trip}  /> ));
    
    const itemsTotal = trips?.totalItems?.reduce((acc, item) => acc + item.qty, 0) 
    const countriesArr = countries.map((x) => x.name)
    const countryNameArr = countriesArr.map((x) => x.common) 

      const createTrip = async (e) => {
        e.preventDefault()
        try {

          const res = await axios.post(`/api/trips/new`, newTripData)
          startTransition(router.refresh);
          setPopupOpen(false)
          
        } catch (err) {
          console.log(err);
        }
      };

      const navigateToLatestBag = () => {
           router.push(`bag?id=${trips.latestBag._id}`)
      }

      const openPopup = () => {
        setPopupOpen(true);
      };
      
      const closePopup = () => {
        setPopupOpen(false);
      };

      const handleDateChange = (date, fieldName) => {
        setNewTripData((prevData) => ({
          ...prevData,
          [fieldName]: date,
        }));
      };

      const handleChange = (event) => {
        let { name, value } = event.target;
        setNewTripData({ ...newTripData, [name]: value });
      };

  return (

    <Container sx={{display: theme.flexBox}} maxWidth={false} disableGutters>
      <Nav bags={bags} session={session} />

    <Stack display={theme.flexBox} justifyContent={theme.start} width={theme.trips.width} pl={theme.trips.marginLeft} pb={7} backgroundColor={theme.main.lightestGray} minHeight="100vh">
      <Stack p={5}>
       <Typography component="h2" variant="span" fontWeight="600"> 
         Welcome, {session?.user.name}
        </Typography>
        <Typography component="p" variant="p">
          The journey of a thousand miles begins with a single step
        </Typography>
        <Typography component="h3" variant="span" fontWeight="500" mt={1.5} >
          My last planned trips 
        </Typography>
        <Typography component="p" variant="p">
          Seamless Trip Planning and Bag Organization Made Simple.
        </Typography>
        </Stack>

  
    <Stack pl={10} display={theme.grid} gap={5} gridTemplateColumns={theme.trips.columns}>
    <Stack border="2px dashed gray" display={theme.flexBox} justifyContent={theme.center} alignItems={theme.center} backgroundColor={theme.main.lightGray} height="210px" borderRadius={theme.radius} sx={{cursor: "pointer"}} onClick={openPopup}>
      <IconButton><AddLocationAltOutlinedIcon sx={{fontSize: "25px", color: "gray" }}/></IconButton>
    </Stack>
    { tripData}
    </Stack>

   <Stack display={theme.flexBox} flexDirection={theme.row} alignItems={theme.center} justifyContent={theme.center} mt={13}>
    <Typography component="h2" variant="span" fontWeight="500" mr={1}> My last bag status </Typography>
    <Typography component="h3" variant="span" fontWeight="500" sx={{color: theme.green, textDecoration: "underline", cursor: "pointer", "&:hover": {color: "#32cd32"}}} onClick={navigateToLatestBag}>{trips?.latestBag?.name}</Typography>
    </Stack>
        <Typography component="p" variant="p" mb={2} textAlign="center"> Streamline Your Gear, Simplify Your Adventure. </Typography>

        <Stack display={theme.grid} gridTemplateColumns={theme.trips.columns} justifyContent={theme.center}>

        <LatestBagStack>
          <Typography component="h4" variant='span' fontWeight="300">Total weight</Typography>
          <MonitorWeightOutlinedIcon sx={{fontSize: "30px", color: theme.green}}/>
          <Typography component="h3" variant='span'  fontWeight="600" sx={{color: trips.latestBagTotalWeight > trips?.latestBag?.goal ? "red" : "black"}}>{trips?.latestBagTotalWeight?.toFixed(2) || 0.00 } / {trips?.latestBag?.goal || 0.00 } kg</Typography>
        </LatestBagStack>

        <LatestBagStack>
        <Typography component="h4" variant='span' fontWeight="300">Total categories </Typography>
          <HorizontalSplitOutlinedIcon sx={{fontSize: "30px", color: theme.green}}/>
         <Typography component="h3" variant='span' fontWeight="600">{ trips.totalCategories || 0 }</Typography>
        </LatestBagStack>

        <LatestBagStack>
        <Typography component="h4" variant='span' fontWeight="300">Total items</Typography>
        <DataUsageOutlinedIcon sx={{fontSize: "30px", color: theme.green}}/>
        <Typography component="h3" variant='span' fontWeight="600">{itemsTotal || 0 }</Typography>
        </LatestBagStack>

        </Stack>



    { isPopupOpen ?  <MuiPopup isOpen={isPopupOpen} onClose={closePopup} >
        <form onSubmit={createTrip}>

          <Stack direction="row" pl={2} pr={2} pt={1} pb={1} justifyContent="space-between" alignItems="flex-start" flexWrap="wrap">

             <Stack width="80%">

             <Typography variant='span' component="h2" fontWeight="600">Create New Trip</Typography>
             <Typography variant='span' component="span" mb={3}>Popup content goes here</Typography>

             </Stack>

             <CloseIcon onClick={closePopup} sx={{cursor: "pointer"}}/>
             <Autocomplete
              onChange={(event, newValue) => setNewTripData((prevData) => ({ ...prevData, name: newValue || '' }))}
              options={countryNameArr || []}
              renderInput={(params) => <TextField required {...params} label="Location" />}
              sx={{width: "48%", marginBottom: "20px"}}
               />

            <TextField
              label="Distance (km)"
              type="number"
              required
              name="distance"
              onChange={handleChange}
              sx={{ width: "48.5%", marginBottom: "20px" }}
              inputProps={{ min: 1, max: 999999 }}
            />
            <TextField
              multiline
              label="Description"
              name="about"
              onChange={handleChange}
              required
              sx={{ width: "100%", marginBottom: "20px" }}
              inputProps={{ maxLength: 300 }}
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Start date"
                name="startDate"
                onChange={(date) => handleDateChange(date, "startDate")}
                sx={{ width: "48.5%" }}
                defaultValue={dayjs()}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="End date"
                name="endDate"
                onChange={(date) => handleDateChange(date, "endDate")}
                sx={{ width: "48.5%" }}
                defaultValue={dayjs()}
                minDate={newTripData.startDate}
              />
            </LocalizationProvider>

            <Button type="submit" sx={{padding: "13px", marginTop: "20px", width: "100%", fontWeight: "500", backgroundColor: theme.green}} variant="contained" disableElevation>Create</Button>
          </Stack>
      </form>
  </MuiPopup> : null }
</Stack>
</Container>
  )
}

export default Trips