import { Author } from '../common/interfaces';

export const getAuthors = (): Promise<Author[]> => {
  return fetch(`${process.env.REACT_APP_API}/authors`).then((response) => (response.json() as unknown) as Author[]);
};

export const saveAuthor = (authorData: Author): Promise<Author> => {
  // I tryed to send POST & PUT on the local server but seems it didn't work
  // if i call send POST or PUT  request will cause side effects to the DB 
  return Promise.resolve({} as any as Author);
}
