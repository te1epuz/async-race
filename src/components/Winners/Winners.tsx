import React, { useEffect, useState } from 'react';
import { WINNERS_PER_PAGE } from '../../constances';
import { fetchGetWinnersList } from '../../services/services';
import { TWinner } from '../../types/types';
import { getAvailableMaxPages } from '../../utilites/utilites';
import { WinnersTable } from './WinnersTable';
import styles from './Winners.module.scss';

type TProps = {
  isGarageShown: boolean;
  totalWinners: string;
  isRaceAvailable: boolean;
  isResetAvailable: boolean;
  setTotalWinners: React.Dispatch<React.SetStateAction<string>>;
  totalCars: string;
};

export function Winners({
  isGarageShown,
  totalWinners,
  isRaceAvailable,
  isResetAvailable,
  setTotalWinners,
  totalCars,
}: TProps) {
  const [winnersList, setWinnersList] = useState<TWinner[]>([]);
  const [sortWinnersBy, setSortWinnersBy] = useState<'time' | 'wins' | 'id'>('time');
  const [sortWinnersDirection, setSortWinnersDirection] = useState<'ASC' | 'DESC'>('ASC');
  const [currentWinnersPage, setCurrentWinnersPage] = useState(1);

  async function getWinnersList() {
    const response = await fetchGetWinnersList(currentWinnersPage, sortWinnersBy, sortWinnersDirection);
    const totalWinnersInHeader = response.headers.get('X-Total-Count');
    if (totalWinnersInHeader) setTotalWinners(totalWinnersInHeader);
    // const winnersData = await response.json();
    // setWinnersList(winnersData);
    response.json().then((winnersData: TWinner[]) => setWinnersList(winnersData));
  }

  function handleWinnersPagination(page: number) {
    let newPage = page;
    const availableMaxPages = getAvailableMaxPages(totalWinners, WINNERS_PER_PAGE);
    if (newPage > availableMaxPages) newPage = availableMaxPages;
    if (newPage < 1) newPage = 1;
    setCurrentWinnersPage(newPage);
  }

  useEffect(() => {
    handleWinnersPagination(currentWinnersPage);
    getWinnersList();
  }, [totalCars, totalWinners, currentWinnersPage, sortWinnersBy, sortWinnersDirection]);

  return (
    <div hidden={isGarageShown}>
      <h2 className={styles.title}>Total winners: {totalWinners}</h2>
      <WinnersTable
        winnersList={winnersList}
        sortWinnersBy={sortWinnersBy}
        setSortWinnersBy={setSortWinnersBy}
        sortWinnersDirection={sortWinnersDirection}
        setSortWinnersDirection={setSortWinnersDirection}
      />
      <div className={styles.pagination}>
        <button
          className={`${styles.pagination__button} ${styles.pagination__left}`}
          type="button"
          onClick={() => handleWinnersPagination(currentWinnersPage - 1)}
          disabled={(!isRaceAvailable && !isResetAvailable) || currentWinnersPage === 1}
        >
          -
        </button>
        <div className={styles.pagination__number}>{currentWinnersPage}</div>
        <button
          className={`${styles.pagination__button} ${styles.pagination__right}`}
          type="button"
          onClick={() => handleWinnersPagination(currentWinnersPage + 1)}
          disabled={
            (!isRaceAvailable && !isResetAvailable) ||
            currentWinnersPage === getAvailableMaxPages(totalWinners, WINNERS_PER_PAGE)
          }
        >
          +
        </button>
      </div>
    </div>
  );
}
