import useGetTxHistory from "../hooks/useGetTxHistory";

const PendingTxs = ({txs}) => {
  const { data } = useGetTxHistory(txs);

  return (
    <div>
      {data?.length > 0 ? data.map(transfer =>(
      <div>
          <p>Status: {transfer.data.originTransfers[0].status === "XCalled" ? "Pending": "Executed"}</p>
          <p>TransferId:  
            <a target="_blank" href={"https://testnet.amarok.connextscan.io/tx/" + transfer.data.originTransfers[0].transferId}>
              {" " + transfer.data.originTransfers[0].transferId.slice(0,6) + "..."}
            </a>
          </p>
      </div>
      ))
      :
      <p>No Pending Transactions</p>
    }
    </div>
  );
};

export default PendingTxs;
