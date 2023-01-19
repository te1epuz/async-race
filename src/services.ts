import { BASE_URL } from './constances';
import { TWinner, TCar } from './types';

export async function getWinner(id: number) {
  const response = await fetch(`${BASE_URL}/winners/${id}`);
  if (response.status === 200) {
    const data: TWinner = await response.json();
    return data;
  }
  return undefined;
}

export async function createWinner(id: number, newTime: number) {
  const winnerData = await getWinner(id);
  console.log('winner with id ', id, ' and time ', newTime, ' should be added');
  if (!winnerData) {
    await fetch(`${BASE_URL}/winners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id,
        wins: 1,
        time: newTime,
      }),
    });
  } else {
    await fetch(`${BASE_URL}/winners/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        wins: winnerData.wins + 1,
        time: newTime < winnerData.time ? newTime : winnerData.time,
      }),
    });
  }
}

export async function deleteWinner(id: number) {
  await fetch(`${BASE_URL}/winners/${id}`, {
    method: 'DELETE',
  });
}

export async function getCar(id: number) {
  const response = await fetch(`${BASE_URL}/garage/${id}`);
  const data: TCar = await response.json();
  return data;
}

// export async function getWinnersList() {
//   const response = await fetch(`${BASE_URL}/winners?_page=1&_limit=10&_sort=time&_order='ASC`, {
//     method: 'GET',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const totalWinnersInHeader = response.headers.get('X-Total-Count') as string;
//   const winnersData = await response.json() as TWinner[];
//   return [winnersData, totalWinnersInHeader];
// }
