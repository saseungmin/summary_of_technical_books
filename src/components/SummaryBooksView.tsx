import React from 'react';

import styled from '@emotion/styled';

import clsx from 'clsx';

import { v4 as uuidv4 } from 'uuid';

import books from '../data/books';
import MountainSvg from '../../static/img/undraw_docusaurus_mountain.svg';

import RowSummaryBooksWrapper from './RowSummaryBooksWrapper';

type Props = {
  title: string;
}

function SummaryBooksView({ title }: Props) {
  return (
    <div className={clsx('col')}>
      <div className="text--center">
        <MountainImg />
      </div>
      <div className="text--center padding-horiz--md">
        <h2>{title}</h2>
        <div>
          {books.map((rowBooks) => (
            <RowSummaryBooksWrapper
              key={uuidv4()}
              rowBooks={rowBooks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SummaryBooksView;

const MountainImg = styled(MountainSvg)`
  height: 200px;
  width: 200px;
`;
