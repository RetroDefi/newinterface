export default function Stats() {
  return (
    <div className="stats-stripe">
      <div className="txt deposit-ttl">My total deposit:</div>
      <div className={"txt total-deposit loading"}>$ 0.00</div>
      <div className="txt qbert-ttl">QBert pending:</div>
      <div className="txt qbert-pending loading">
        <span className="amount">0.000</span>
      </div>
      <div onClick={() => {}} className="btn outlined harvest-all">
        Harvest All
      </div>
    </div>
  );
}
