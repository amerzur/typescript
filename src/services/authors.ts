import { Author } from '../common/interfaces';

export const getAuthors = (): Promise<Author[]> => {
  return fetch(`${process.env.REACT_APP_API}/authors`).then((response) => (response.json() as unknown) as Author[]);
};

export const saveAuthor = (authorData: Author): Promise<Author> => {
  // Unfortunatly if i send POST or PUT to localhost:3001 will not save records correctly & cause side effects to the DB ..
  return Promise.resolve({} as any as Author);
}
