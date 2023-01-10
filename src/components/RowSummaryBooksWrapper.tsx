import React from 'react';

import styled from '@emotion/styled';

import { v4 as uuidv4 } from 'uuid';

import SummaryBookTemplate from './SummaryBookTemplate';
import { Book } from '../data/books';

type Props = {
  rowBooks: Book[];
}

function RowSummaryBooksWrapper({ rowBooks }: Props) {
  return (
    <BooksInfoWrapper className="row">
      {rowBooks.map(({ link, bookName, imgName }) => (
        <SummaryBookTemplate
          key={uuidv4()}
          link={link}
          bookName={bookName}
          imgName={imgName}
        />
      ))}
    </BooksInfoWrapper>
  );
}

export default RowSummaryBooksWrapper;

const BooksInfoWrapper = styled.div`
  text-align: center;
  align-items: flex-end;
`;
