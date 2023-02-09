import { Database } from 'types/notion';
import MainHeader from './MainHeader';
import MainPage from './MainPage';

type PropTypes = {
    database: Database;
};

const MainLayer = ({ database }: PropTypes) => {
    return (
        <main className="pr-8 pl-8 max-w-[800px] mt-0 mr-auto mb-0 ml-auto">
            <MainHeader />
            <MainPage database={database} />
        </main>
    );
};

export default MainLayer;
