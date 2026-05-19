import styles from "../styles/WhyUs.module.css";
import { Icon } from "@mdi/react";
import {mdiShieldCheckOutline,mdiAccountMultipleCheckOutline,mdiMagnify,mdiCheckDecagram} from '@mdi/js';

function WhyUs() {
    return (
        <div className={styles.mainContainer}>
            <div className={styles.header}>
                <h2 className={styles.title}>Why Choose <span>Zameen 360?</span></h2>
                <p className={styles.subtitle}>Pakistan's most trusted real estate partner</p>
            </div>

            <div className={styles.cardsWrapper}>
                <div className={styles.subContainer}>
                    <div className={styles.one}>
                        <Icon path={mdiShieldCheckOutline} size={1} />
                    </div>
                    <div className={styles.two}>
                        <h4>Verified Listings</h4>
                        <p>All properties are verified for quality and authenticity.</p>
                    </div>
                </div>

                <div className={styles.subContainer}>
                    <div className={styles.one}>
                        <Icon path={mdiAccountMultipleCheckOutline} size={1} />
                    </div>
                    <div className={styles.two}>
                        <h4>Trusted Agents</h4>
                        <p>Connect with experienced and professional agents.</p>
                    </div>
                </div>

                <div className={styles.subContainer}>
                    <div className={styles.one}>
                        <Icon path={mdiMagnify} size={1} />
                    </div>
                    <div className={styles.two}>
                        <h4>Easy Search</h4>
                        <p>Advanced filters to find the perfect property quickly.</p>
                    </div>
                </div>

                <div className={styles.subContainer}>
                    <div className={styles.one}>
                        <Icon path={mdiCheckDecagram} size={1} />
                    </div>
                    <div className={styles.two}>
                        <h4>Secure Deals</h4>
                        <p>Safe transactions and legal assistance you can trust.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhyUs;