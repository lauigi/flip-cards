import { testDatabaseConnection } from './actions';

export default async function Demo() {
  const isConnected = await testDatabaseConnection();
  return (
    <div className="flex flex-col gap-2">
      demo here
      {isConnected ? (
        <h2 className="text-lg text-green-500">You are connected to MongoDB!</h2>
      ) : (
        <h2 className="text-lg text-red-500">
          You are NOT connected to MongoDB. Check the <code>README.md</code>
          {''}
          for instructions.
        </h2>
      )}
    </div>
  );
}
