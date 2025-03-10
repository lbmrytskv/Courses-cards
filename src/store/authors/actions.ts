
import { getAuthors } from '../../services';
import { removeAuthor } from './reducer';
import { deleteAuthorFromServer } from '../../services';

export const fetchAuthorsAction = () => async (dispatch) => {
  try {
    const authors = await getAuthors();  
  } catch (error) {
    console.error('Failed to fetch authors:', error);
  }
};


export const deleteAuthorAction = (authorId) => async (dispatch) => {
  try {
    await deleteAuthorFromServer(authorId);
    dispatch(removeAuthor(authorId)); 
  } catch (error) {
    console.error('Failed to delete author:', error);
  }
};
