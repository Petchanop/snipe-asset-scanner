'use client';

import React, { useState } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Select,
  TextField,
  Typography,
  Skeleton,
  FormHelperText,
  IconButton,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import { TLocation } from '@/_types/snipe-it.type';

interface LocationMap {
  [parent: string]: string[];
}

interface Props {
  dateValue: string;
  locationMap: LocationMap;
  loading?: boolean;
}

interface LocationEntry {
  parent: string;
  child: string;
}

export function DateLocationForm(props: {locationMap : TLocation , loading : boolean }) {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  const [parentLocation, setParentLocation] = useState();
  const [childLocation, setChildLocation] = useState();
  const [errors, setErrors] = useState<{ date?: string; parent?: string; child?: string }>({});
  const [locationList, setLocationList] = useState<LocationEntry[]>([]);

  const childOptions = parentLocation ? locationMap[parentLocation] || [] : [];

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!selectedDate) newErrors.date = 'Date is required';
    if (!parentLocation) newErrors.parent = 'Parent location is required';
    if (!childLocation) newErrors.child = 'Child location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddLocation = () => {
    if (!validate()) return;
    setLocationList([...locationList, { parent: parentLocation, child: childLocation }]);
    setParentLocation('');
    setChildLocation('');
    setErrors({});
  };

  const handleRemoveLocation = (index: number) => {
    setLocationList(locationList.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 4, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Typography variant="h6">Select Date and Location</Typography>

      {loading ? (
        <>
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={56} />
          <Skeleton variant="rectangular" height={40} />
        </>
      ) : (
        <>
          <DatePicker
            label="Date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
          />

          <Select
            displayEmpty
            value={parentLocation}
            onChange={(e) => {
              setParentLocation(e.target.value);
              setChildLocation('');
            }}
            error={!!errors.parent}
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Parent Location
            </MenuItem>
            {Object.keys(locationMap).map((parent) => (
              <MenuItem key={parent} value={parent}>
                {parent}
              </MenuItem>
            ))}
          </Select>
          {errors.parent && <FormHelperText error>{errors.parent}</FormHelperText>}

          <Select
            displayEmpty
            value={childLocation}
            onChange={(e) => setChildLocation(e.target.value)}
            error={!!errors.child}
            fullWidth
            disabled={!parentLocation}
          >
            <MenuItem value="" disabled>
              {parentLocation ? 'Select Child Location' : 'Select Parent First'}
            </MenuItem>
            {childOptions.map((child) => (
              <MenuItem key={child} value={child}>
                {child}
              </MenuItem>
            ))}
          </Select>
          {errors.child && <FormHelperText error>{errors.child}</FormHelperText>}

          <Button variant="outlined" onClick={handleAddLocation}>
            Add Location
          </Button>
        </>
      )}

      {/* 📝 List of Added Locations */}
      {locationList.length > 0 && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Selected Locations
          </Typography>
          {locationList.map((loc, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #ccc',
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              <Typography>
                {loc.parent} → {loc.child}
              </Typography>
              <IconButton onClick={() => handleRemoveLocation(index)} size="small">
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Divider />

      <Button
        type="submit"
        variant="contained"
        onClick={(e) => {
          e.preventDefault();
          if (!selectedDate || locationList.length === 0) {
            alert('Please select a date and add at least one location.');
            return;
          }
          console.log('Final Submission');
          console.log('Date:', selectedDate.format('YYYY-MM-DD'));
          console.log('Locations:', locationList);
        }}
      >
        Submit All
      </Button>
    </Box>
  );
};
