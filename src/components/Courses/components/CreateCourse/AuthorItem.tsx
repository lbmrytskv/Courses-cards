import React from 'react';
import Button from '../../../../common/Button/Button';

export default function AuthorItem({
  author,
  onAction,
  actionText,
  onDelete, 
  showDelete = true,
}: {
  author: any;
  onAction: (authorId: string) => void;
  actionText: string;
  onDelete?: (authorId: string) => void;
  showDelete?: boolean;
}) {
  return (
    <li>
      <span>{author.name}</span>
      <div className='author-buttons'>
      <Button buttonText={actionText} onClick={() => onAction(author.id)} />
      {showDelete && onDelete && <Button buttonText="Delete" onClick={() => onDelete(author.id)} />}
      </div>
    </li>
  );
}
