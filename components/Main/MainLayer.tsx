import styles from 'styles/index.module.css';
import { Database } from 'types/notion';
import MainHeader from './MainHeader';
import MainPage from './MainPage';

type PropTypes = {
    database: Database;
};

const MainLayer = ({ database }: PropTypes) => {
    return (
        <div>
            <main className={styles.container}>
                <MainHeader />
                <MainPage database={database} />
            </main>
        </div>
    );
};

export default MainLayer;
