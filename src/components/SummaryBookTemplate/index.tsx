import useBaseUrl from '@docusaurus/useBaseUrl';
import clsx from 'clsx';

import { Book } from '../../data/books';

import styles from './index.module.scss';

type Props = Book;

function SummaryBookTemplate({ link, bookName, imgName }: Props) {
  const imgSrc = useBaseUrl(`/img/books/${imgName}`);

  return (
    <div className={clsx('col col--4', styles.bookInfoWrapper)}>
      <div>
        <h4>
          <a href={link}>
            {bookName}
          </a>
        </h4>
      </div>
      <div>
        <a href={link}>
          <img src={imgSrc} width="300px" height="300px" alt={bookName} />
        </a>
      </div>
    </div>
  );
}

export default SummaryBookTemplate;
