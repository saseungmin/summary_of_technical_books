import React from 'react';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import styled from '@emotion/styled';

import books from '../data/books';

import MountainSvg from '../../static/img/undraw_docusaurus_mountain.svg';

import RowSummaryBooksWrapper from './RowSummaryBooksWrapper';

const MountainImg = styled(MountainSvg)`
  height: 200px;
  width: 200px;
`;

function SummaryBooksView({ title }) {
  return (
    <div className={clsx('col')}>
      <div className="text--center">
        <MountainImg alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h2>{title}</h2>
        <div>
          {books.map((booksInfo) => (
            <RowSummaryBooksWrapper
              key={uuidv4()}
              booksInfo={booksInfo}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SummaryBooksView;
