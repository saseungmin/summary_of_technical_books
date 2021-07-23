import React from 'react';

import { v4 as uuidv4 } from 'uuid';

import styled from '@emotion/styled';
import SummaryBookTemplate from './SummaryBookTemplate';

const BooksInfoWrapper = styled.div`
  text-align: center;
  align-items: flex-end;
`;

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
