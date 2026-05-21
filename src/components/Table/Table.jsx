import "./Table.css";

const Table = ({ head = [], body = [[]] }) => {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            {head.map((title, i) => {
              return <th key={i}>{title}</th>;
            })}
          </tr>
        </thead>

        <tbody>
          {body.map((row, i) => {
            return (
              <tr key={i}>
                {row.map((part, j) => {
                  return <td key={j}>{part}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
