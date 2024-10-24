import Assignments from '../components/Assignments'; // Assuming you have the Assignments component in /components

export async function getServerSideProps() {
  const res = await fetch(`http://localhost:3000/api/assignments`);
  const assignments = await res.json();

  return {
    props: {
      initialAssignments: assignments || [],
    },
  };
}

export default function AssignmentsPage({ initialAssignments }) {
  return (
    <div>
      <Assignments initialAssignments={initialAssignments} />
    </div>
  );
}
