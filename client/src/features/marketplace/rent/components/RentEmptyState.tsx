import styles from "../../components/media/styles/Buy.module.css";

interface RentEmptyStateProps {
  hasFilters: boolean;
  onReset: () => void;
}

const RentEmptyState = ({ hasFilters, onReset }: RentEmptyStateProps) => (
  <div className={styles.emptyState}>
    <p>No rental properties found.</p>
    {hasFilters ? (
      <>
        <small>Try adjusting your filters to see more results.</small>
        <button className={styles.resetBtn} onClick={onReset}>
          Clear Filters
        </button>
      </>
    ) : (
      <small>
        No properties available for rent right now. Check back soon!
      </small>
    )}
  </div>
);

export default RentEmptyState;
