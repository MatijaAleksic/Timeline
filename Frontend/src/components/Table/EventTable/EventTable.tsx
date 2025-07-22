import { FunctionComponent } from "react";
import styles from "./EventTable.module.scss";

const EventTable: FunctionComponent = ({}) => {
  return (
    <div className={styles.tableContainer}>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Jane Doe</td>
            <td>jane@example.com</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>2</td>
            <td>John Smith</td>
            <td>john@example.com</td>
            <td>Inactive</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Emily Johnson</td>
            <td>emily@example.com</td>
            <td>Active</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Michael Brown</td>
            <td>michael@example.com</td>
            <td>Pending</td>
          </tr>
        </tbody>
      </table>

      <div className="pagination">
        <button>&laquo; Prev</button>
        <button className="active">1</button>
        <button>2</button>
        <button>3</button>
        <button>Next &raquo;</button>
      </div>
    </div>
  );
};

export default EventTable;
