import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import clsx from 'clsx';
import SummaryBookTemplate from '../SummaryBookTemplate';
import { Book } from '../../data/books';

import styles from './index.module.scss';

type Props = {
  rowBooks: Book[];
}

function RowSummaryBooks({ rowBooks }: Props) {
  return (
    <div className={clsx('row', styles.rowSummaryBooksWrapper)}>
      {rowBooks.map(({ link, bookName, imgName }) => (
        <SummaryBookTemplate
          key={uuidv4()}
          link={link}
          bookName={bookName}
          imgName={imgName}
        />
      ))}
    </div>
  );
}

export default RowSummaryBooks;
