import React, { useEffect, useState, SetStateAction, Dispatch } from 'react';
import { InputLabel, Input, Select, MenuItem, Button, Checkbox, ListItemText, Typography, CircularProgress } from '@material-ui/core';
import { getAuthors, saveAuthor } from '../../services/authors';
import { Author, Category, ProcessedVideo, Video } from '../../common/interfaces';
import { getCategories } from '../../services/categories';
import classes from './video-editor.module.css';
import { RouteComponentProps } from 'react-router-dom';
import { ensure, checkValidity } from '../../common/helper-functions';
import { getVideo } from '../../services/videos';

interface MatchParams {
  id: string;
}
interface Props extends RouteComponentProps<MatchParams> {}

const VideoEditor: React.FC<Props> = ({ match, history }: RouteComponentProps<{ id?: string }>) => {
  // List of authors &  categories for select tags
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Selected values by the user
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [name, setName] = useState<string>('');

  //Validation
  const [formIsValid, setFormIsValid] = useState<boolean>(false);
  const formFields = [selectedAuthor, selectedCategories, name];

  //Edit section
  const [loading, setLoading] = useState<boolean>(false); //loading for edit page
  const [isAdd, setIsAdd] = useState<boolean>(true); // To handle between add or edit .. true for add , false for edit
  const [videoID, setVideoID] = useState<string>('');

  // read categoreis & authors to use them in the Form
  useEffect(() => {
    Promise.all([getCategories(), getAuthors()]).then(([categories, authors]) => {
      setAuthors(authors);
      setCategories(categories);
    });
  }, []);

  // read the url params to see if it edit video
  useEffect(() => {
    if (match.params.id) {
      setVideoID(match.params.id);
    }
  }, [match.params]);

  // call get Video funciton to edit
  useEffect(() => {
    const fillForm = (videoData: ProcessedVideo) => {
      const author = ensure(authors.find((author) => author.name === videoData.author));
      setSelectedAuthor((author.id as any) as string);
      setName(videoData.name);
      setSelectedCategories(videoData.categories);
      setFormIsValid(true);
    };

    const changeToEdit = (data: ProcessedVideo) => {
      setIsAdd(false);
      fillForm(data);
    };

    const fetchVideo = () => {
      setLoading(true);
      // to make sure that authors & categories are loaded from the server
      if (authors.length > 0 && categories.length > 0) {
        // get video
        getVideo(videoID, categories, authors).then((data) => {
          console.log('ProcessedVideo:', data);
          changeToEdit(data);
          setLoading(false);
        });
      }
    };

    if (videoID) {
      fetchVideo();
    }
  }, [videoID, authors, categories]);

  // to watch changes on form fields and set Validation status
  useEffect(() => {
    //update form validity
    let formIsValid = true;
    for (let inputIdentifier of formFields) {
      formIsValid = formIsValid = checkValidity(inputIdentifier) && formIsValid;
    }
    setFormIsValid(formIsValid);
  }, [formFields]);
  const redirectToHome = () => {
    history.push('/');
  };

  const videoSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();

    //todo:send save Author API call
    const author: Author = ensure(authors.find((author) => author.id === +selectedAuthor));
    const newVideos: Video[] = [...author.videos];
    const newVideo: Video = { id: Math.round(Math.random() * 10), name: name, catIds: (selectedCategories as unknown) as number[] };
    newVideos.push(newVideo);
    author.videos = newVideos;
    saveAuthor(author).then((res)=>{
      // redirect to home page 
      redirectToHome();
    });
  };
  const cancelClickedHandler = () => {
    redirectToHome();
  };

  const inputChangedHandler = (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>,
    setState: Dispatch<SetStateAction<any>>
  ) => {
    setState(event.target.value);
  };

  let form = (
    <form noValidate autoComplete="off" onSubmit={videoSubmit}>
      <div className={classes.formGroup}>
        <InputLabel htmlFor="video-name">Video Name</InputLabel>
        <Input onChange={(event) => inputChangedHandler(event, setName)} value={name} className={classes.inputRoot} id="video-name" />
      </div>
      <div className={classes.formGroup}>
        <InputLabel htmlFor="video-author">Video author</InputLabel>

        <Select
          className={classes.inputRoot}
          id="video-author"
          value={selectedAuthor}
          onChange={(event) => inputChangedHandler(event, setSelectedAuthor)}>
          {authors.map((author) => (
            <MenuItem key={author.id} value={author.id}>
              {author.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.formGroup}>
        <InputLabel htmlFor="mutiple-categories">Video Categories</InputLabel>

        <Select
          labelId="mutiple-checkbox-label"
          id="mutiple-categories"
          multiple
          value={selectedCategories}
          onChange={(event) => inputChangedHandler(event, setSelectedCategories)}
          input={<Input />}
          className={classes.inputRoot}
          renderValue={(selected) => (selected as string[]).join(', ')}>
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              <Checkbox checked={selectedCategories.indexOf(category.name) > -1} />
              <ListItemText primary={category.name} />
            </MenuItem>
          ))}
        </Select>
      </div>
      <Button color="primary" type="submit" disabled={!formIsValid}>
        Submit
      </Button>
      <Button color="secondary" onClick={cancelClickedHandler}>
        Cancel
      </Button>
    </form>
  );
  if (loading) form = <CircularProgress />;
  return (
    <div className={classes.videoEditor}>
      <Typography>
        <h1>{isAdd ? 'Add Video' : 'Edit Video'} </h1>{' '}
      </Typography>
      {form}
    </div>
  );
};

export default VideoEditor;
