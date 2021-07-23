import React from 'react';

import clsx from 'clsx';

import styled from '@emotion/styled';

const BookInfoWrapper = styled.div`
  margin-top: 1rem;
`;

function SummaryBookTemplate({ link, bookName, imgName }) {
  return (
    <BookInfoWrapper className={clsx('col col--4')}>
      <div>
        <h4>
          <a href={link}>
            {bookName}
          </a>
        </h4>
      </div>
      <div>
        <a href={link}>
          <img src={`../../images/${imgName}`} width="300px" height="300px" alt={bookName} />
        </a>
      </div>
    </BookInfoWrapper>
  );
}

export default SummaryBookTemplate;
