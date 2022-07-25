import React from 'react';

import styled from '@emotion/styled';

import { v4 as uuidv4 } from 'uuid';

import SummaryBookTemplate from './SummaryBookTemplate';

function RowSummaryBooksWrapper({ booksInfo }) {
  return (
    <BooksInfoWrapper className="row">
      {booksInfo.map(({ link, bookName, imgName }) => (
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
