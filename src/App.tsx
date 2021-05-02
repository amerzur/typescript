import React, { useEffect, useState } from 'react';
import { AppBar, Container, Toolbar, Typography,Button,makeStyles,createStyles } from '@material-ui/core';
import { VideosTable } from './components/videos-table';
import { getVideos } from './services/videos';
import { ProcessedVideo } from './common/interfaces';
import AddIcon from '@material-ui/icons/Add';
import { HashRouter as Router, Route, NavLink, Switch } from 'react-router-dom'
import  VideoEditor  from './components/video-editor/video-editor';

const App: React.FC = () => {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const useStyles = makeStyles(() =>
  createStyles({
    Toolbar: {
       display: 'flex',
    justifyContent: 'space-between'
    },
  })
);
const classes = useStyles();

  useEffect(() => {
    getVideos()
      .then((videos) => {
        setVideos(videos);
        
      });
  }, []);

  return (
    <>
    <Router>
      <AppBar position="static">
        <Toolbar className={classes.Toolbar}>
          <Typography variant="h6"><NavLink className="NavLink" to="/"> Videos </NavLink></Typography>
          <Button
        variant="contained"
        color="secondary"
        endIcon={<AddIcon />}
      >
        <NavLink  className="NavLink" to="/add">
        Add Video
        </NavLink>
      </Button>
        </Toolbar>
      </AppBar>
      <Container>
     {/*  <VideosTable videos={videos} /> */}
        <Switch>
            <Route exact path="/" render={()=> <VideosTable videos={videos} /> } />
           
            <Route exact path="/add" component={VideoEditor} />
            <Route exact path="/edit/:id" component={VideoEditor} />
          </Switch>
      </Container>
      </Router>
    </>
  );
};

export default App;
