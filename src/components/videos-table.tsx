import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton,Tooltip } from '@material-ui/core';
import { ProcessedVideo, Format } from '../common/interfaces';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import {NavLink} from 'react-router-dom'
interface VideosTableProps {
  videos: ProcessedVideo[];
}

export const VideosTable: React.FC<VideosTableProps> = ({ videos }) => {
  const getHighestResolution = (format: Format): string => {
    let highestSize = 0;
    let highestKey = '';
    for (let key in format) {
      const value = format[key];
      if (value.size > highestSize) {
        highestKey = key;
      }
      highestSize =Math.max(highestSize,value.size);
    }
    return `${highestKey} ${format[highestKey].res}`;
  };
  return (
    <TableContainer component={Paper} style={{ marginTop: '40px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Video Name</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Categories</TableCell>
            <TableCell>Highest Quality Format</TableCell>
            <TableCell>Release Date</TableCell>
            <TableCell>Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos.map((video) => (
            <TableRow hover key={video.id}>
              <TableCell component="th" scope="row">
                {video.name}
              </TableCell>
              <TableCell>{video.author}</TableCell>
              <TableCell>{video.categories.join(', ')}</TableCell>
              <TableCell>{getHighestResolution(video.format)} </TableCell>
              <TableCell> {video.realeaseDate.toLocaleDateString()}</TableCell>
              <TableCell>
              <Tooltip title="edit">
               <IconButton aria-label="edit">
                <NavLink to={'edit/'+video.id} >  <EditIcon color="primary" /></NavLink>
              </IconButton>
              </Tooltip>
               <Tooltip title="Delete">
               <IconButton aria-label="delete">
                  <DeleteIcon color="secondary" />
                 </IconButton>
                  </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
