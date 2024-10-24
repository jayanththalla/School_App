import { useRouter } from 'next/router';
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

const DiaryEntriesByDate = () => {
  const router = useRouter();
  const { date } = router.query;
  const { data, error } = useSWR(date ? `/api/diary/${date}` : null, fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Diary Entries for {date}</h2>
      {data.data.map((entry) => (
        <div key={entry._id}>
          <h3>{entry.subject}</h3>
          <p>{entry.content}</p>
        </div>
      ))}
    </div>
  );
};

export default DiaryEntriesByDate;
