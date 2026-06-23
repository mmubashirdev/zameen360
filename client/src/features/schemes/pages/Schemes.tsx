import { useState } from "react";
import { Search } from "lucide-react";
import DashboardNavbar from "../../marketplace/components/DashboardNavbar";
import styles from "../../marketplace/components/media/styles/Buy.module.css";

const Schemes = () => {
  const [search, setSearch] = useState("");

  const handleSearch = () => {
    console.log("Searching schemes:", { search });
  };

  return (
    <div className={styles.page}>
      <DashboardNavbar />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Explore Society Schemes</h1>
          <p>Find your ideal plot or commercial space</p>
        </div>

        <div className={styles.layoutWrapper}>
          <div className={styles.contentArea}>
            <div className={styles.topSearchBar}>
              <Search size={17} color="#94a3b8" />
              <input
                type="text"
                placeholder="Search by scheme name or location..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSearch()}
              />
              <button className={styles.searchBtn} onClick={handleSearch}>
                <Search size={14} /> Search
              </button>
            </div>

            <div className={styles.resultsHead}>
              <span>Schemes Search</span>
            </div>

            <div className={styles.emptyState}>
              <p>Search Area</p>
              <small>No property posts are shown here.</small>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Schemes;
