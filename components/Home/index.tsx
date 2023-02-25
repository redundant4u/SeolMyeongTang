import { Database } from 'types/notion';
import Header from './Header';
import Body from './Body';

type PropTypes = {
    database: Database;
};

const Home = ({ database }: PropTypes) => {
    return (
        <main className="pr-8 pl-8 max-w-[800px] mt-0 mr-auto mb-0 ml-auto">
            <Header />
            <Body database={database} />
        </main>
    );
};

export default Home;
