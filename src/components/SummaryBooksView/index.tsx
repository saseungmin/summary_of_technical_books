import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';

import books from '../../data/books';
import RowSummaryBooks from '../RowSummaryBooks';

import MountainSvg from '../../../static/img/undraw_docusaurus_mountain.svg';

import styles from './index.module.scss';

type Props = {
  title: string;
};

function SummaryBooksView({ title }: Props) {
  return (
    <div className={clsx('col')}>
      <div className="text--center">
        <MountainSvg className={styles.mountainImg} />
      </div>
      <div className="text--center padding-horiz--md">
        <h2>{title}</h2>
        <div>
          {books.map((rowBooks) => (
            <RowSummaryBooks
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
