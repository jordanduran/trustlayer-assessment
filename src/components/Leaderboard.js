import { v4 as uuidv4 } from 'uuid';

const Leaderboard = () => {
  const leaderboardUsers = JSON.parse(localStorage.getItem('users'));

  const listOfUsers = leaderboardUsers
    ? leaderboardUsers
        .sort((a, b) => b.score - a.score)
        .map((user) => {
          return (
            <tr key={uuidv4()}>
              <td>{user.user}</td>
              <td>{user.score}</td>
              <td>{user.date}</td>
            </tr>
          );
        })
        .slice(0, 10)
    : 'No Users';

  return (
    <div className='table-container'>
      {listOfUsers.length && (
        <table className='leaderboard-table'>
          <tbody>
            <tr>
              <th>User</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
            {listOfUsers}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;
