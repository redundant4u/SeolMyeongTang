import { GetStaticProps, NextPage } from 'next';
import { getDatabase } from 'api/notion';
import { Database } from 'types/notion';
import { Home } from 'components';

type PropTypes = {
    database: Database;
};

const HomePage: NextPage = ({ database }: PropTypes) => {
    return (
        <>
            <Home database={database} />
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const database = await getDatabase();

    return {
        props: { database },
    };
};

export default HomePage;
