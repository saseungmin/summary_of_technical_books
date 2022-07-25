import React from 'react';

import styled from '@emotion/styled';

import SummaryBooksView from './SummaryBooksView';

const BooksInfoSection = styled.section`
  display: flex;
  align-items: center;
  padding: 2rem 0 5rem 0;
  width: 100%;
`;

function SummaryBooks() {
  return (
    <BooksInfoSection>
      <div className="container">
        <div className="row">
          <SummaryBooksView
            title="요약한 책 목록입니다!"
          />
        </div>
      </div>
    </BooksInfoSection>
  );
}

export default SummaryBooks;
