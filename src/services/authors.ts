import { Author } from '../common/interfaces';

export const getAuthors = (): Promise<Author[]> => {
  return fetch(`${process.env.REACT_APP_API}/authors`).then((response) => (response.json() as unknown) as Author[]);
};

export const saveAuthor=(authorData:Author): Promise<Author>=>{
// I tryed to send POST& PUT to the local server but seems it didn't work 
  return fetch(`${process.env.REACT_APP_API}/authors`,{method:'POST',body:JSON.stringify( authorData)}).then((response) => (response.json() as unknown) as Author);

}
