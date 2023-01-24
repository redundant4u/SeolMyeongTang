import { GetStaticProps, NextPage } from 'next';
import { MainLayer } from 'components';
import { getDatabase } from 'api/notion';
import { Database } from 'types/notion';

type PropTypes = {
    database: Database;
};

const Home: NextPage = ({ database }: PropTypes) => {
    return (
        <>
            <MainLayer database={database} />
        </>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const database = await getDatabase();

    return {
        props: { database },
    };
};

export default Home;
