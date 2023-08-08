import React from 'react';
import SummaryBooksView from '../SummaryBooksView';

import styles from './index.module.scss';

function SummaryBooks() {
  return (
    <section className={styles.booksInfoSection}>
      <div className="container">
        <div className="row">
          <SummaryBooksView
            title="요약한 책 목록입니다!"
          />
        </div>
      </div>
    </section>
  );
}

export default SummaryBooks;
