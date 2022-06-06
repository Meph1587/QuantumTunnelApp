import useGetTxHistory from "../hooks/useGetTxHistory";

function formatDate(p:Date) {
  return p.getDate() + "-" + p.toLocaleString('default', { month: 'short' }) + "-" +  p.getFullYear() + " " + ('0'+p.getHours()).slice(-2) + ":" +  ('0'+p.getMinutes()).slice(-2)
}

const PendingTxs = ({account, t1, t2}) => {
  const { data } = useGetTxHistory(account, t1, t2);


  return (
    <div >
      <h1 className="text-4xl p-10">Transaction History</h1>
      {data?.length > 0 ? 
      <div className="pb-24 ">
        {data.map(transfer =>(
          <div className="p-10 pl-48 pr-48 grid grid-flow-col grid-cols-auto">
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">Status:</p>
                {transfer.status}
              </div>
              <div className="text-left p-1 ml-5 w-36">
                <p className="text-gray-500">Sent At:</p>
                {formatDate(transfer.sentAt)}
              </div>
              <div className="text-left p-1 ml-5 w-36">
                <p className="text-gray-500">Exec. At:</p>
                {transfer.executedAt ===null ? '' :formatDate(transfer.executedAt)}
              </div>
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">From:</p>
                {transfer.origin}
              </div>
              <div className="text-left p-1 ml-5 w-28">
                <p className="text-gray-500">To:</p>
                {transfer.destination}
              </div>

              <div className="text-left p-1 ml-5 w-32">
                <p className="text-gray-500">TransferId: </p>
                <u><a target="_blank" rel="noreferrer" href={"https://testnet.amarok.connextscan.io/tx/" + transfer.transferId}>
                  {" " + transfer.transferId.slice(0,6) + "..." + transfer.transferId.slice(62,66)}
                </a></u>
              </div>
          </div>
        ))}
      </div>
      :
      <p>No Transactions</p>
    }
    </div>
  );
};

export default PendingTxs;
